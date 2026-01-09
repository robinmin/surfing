#!/usr/bin/env node

/**
 * HTML to PDF Converter with Intelligent Optimization
 *
 * A powerful tool for converting HTML files to PDF with advanced cheatsheet
 * optimization, auto-detection capabilities, and single-page layout support.
 *
 * Quick Start:
 *   alias html2pdf='node /path/to/scripts/html2pdf/pdf-export.mjs'
 *   html2pdf cheatsheet.html --single-page --margin=10px
 *
 * Key Features:
 *   - Intelligent viewport auto-detection
 *   - Single-page optimization (removes all page breaks)
 *   - Layout analysis and optimization
 *   - Comprehensive error handling
 *
 * Common Usage:
 *   html2pdf page.html                           # → page.pdf (standard multi-page)
 *   html2pdf page.html custom.pdf                # → custom.pdf (custom name)
 *   html2pdf page.html --single-page             # → page.pdf (one continuous page)
 *   html2pdf page.html --verbose                 # → page.pdf (with debug info)
 *
 * See README.md for comprehensive documentation.
 */

import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'
import { pathToFileURL } from 'url'

// Enhanced CLI parser with input/output file logic (replacing bash wrapper)
function parseArgs(argv) {
  const options = { _: [] }

  // Process all arguments
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg.startsWith('--')) {
      const eqIndex = arg.indexOf('=')
      if (eqIndex !== -1) {
        const key = arg.slice(2, eqIndex)
        const value = arg.slice(eqIndex + 1)
        options[key] = value
      } else {
        const key = arg.slice(2)
        options[key] = true
      }
    } else if (arg.startsWith('-')) {
      const key = arg.slice(1)
      options[key] = true
    } else {
      options._.push(arg)
    }
  }

  // Enhanced input/output processing (replaces bash script logic)
  if (options._.length === 0) {
    return { ...options, input: null, output: null }
  }

  // First positional argument is always input
  const input = options._[0]
  let output = null

  // Second positional argument is output if it doesn't look like an option
  if (options._.length >= 2) {
    const potentialOutput = options._[1]
    // If it doesn't start with - and looks like a filename, treat as output
    if (!potentialOutput.startsWith('-')) {
      output = potentialOutput
    }
  }

  // Generate default output filename if not provided
  if (!output && input) {
    const inputPath = path.resolve(input)
    const baseName = path.basename(inputPath, path.extname(inputPath))
    output = path.join(process.cwd(), `${baseName}.pdf`)
  }

  return {
    ...options,
    input: input || null,
    output: output || null,
  }
}

// Validate and normalize margin value
function validateMargin(marginVal) {
  if (!marginVal) return '20px'

  // Check if it's a valid CSS margin value
  const validUnits = ['px', 'pt', 'in', 'cm', 'mm', 'em', 'rem', '%']
  const marginStr = marginVal.toString()

  // Check if it ends with a valid unit
  const hasValidUnit = validUnits.some((unit) => marginStr.endsWith(unit))

  if (!hasValidUnit) {
    // If it's just a number, assume pixels
    if (/^\d+\.?\d*$/.test(marginStr)) {
      return marginStr + 'px'
    }
    // If it looks like it should have 'px' but is missing 'x'
    if (/^\d+\.?\d*p$/.test(marginStr)) {
      return marginStr + 'x'
    }
    throw new Error(
      `Invalid margin value: "${marginVal}". Use a valid CSS value like "10px", "1cm", "0.5in", etc.`
    )
  }

  return marginStr
}

// Auto-detect optimal viewport based on content layout
async function detectOptimalViewport(page, inputUrl) {
  console.log('🔍 Auto-detecting optimal viewport...')

  // Try different viewport widths to find the best fit
  const testWidths = [1920, 1680, 1440, 1280, 1024]
  let bestViewport = { width: 1280, height: 800 }
  let bestScore = Infinity
  let bestLayout = null

  for (const width of testWidths) {
    const height = Math.round(width * 0.7) // Taller aspect ratio for content
    await page.setViewportSize({ width, height })
    await page.goto(inputUrl, { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)

    const metrics = await page.evaluate(() => {
      const body = document.body
      const scrollWidth = body.scrollWidth
      const scrollHeight = body.scrollHeight

      // Check actual grid layout
      const gridContainer = document.querySelector('.grid, [class*="grid-cols"]')
      let actualColumns = 1
      if (gridContainer) {
        const computedStyle = window.getComputedStyle(gridContainer)
        const gridCols = computedStyle.gridTemplateColumns
        if (gridCols && gridCols !== 'none') {
          actualColumns = gridCols.split(' ').length
        }
      }

      // Check if content has multi-column layout
      const mainContent = document.querySelector(
        '.grid, .columns, .flex-wrap, [class*="grid-cols"], [class*="columns-"]'
      )
      const hasMultiColumn = mainContent !== null

      // Calculate layout efficiency score (lower is better)
      const horizontalWaste = Math.max(0, window.innerWidth - scrollWidth)
      const aspectRatio = scrollWidth / scrollHeight

      // Get content bounds
      const contentBounds = document
        .querySelector('.max-w-7xl, .container, main, .grid')
        ?.getBoundingClientRect()

      return {
        scrollWidth,
        scrollHeight,
        horizontalWaste,
        aspectRatio,
        hasMultiColumn,
        actualColumns,
        contentBounds: contentBounds || { width: scrollWidth, height: scrollHeight },
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      }
    })

    // Score based on column utilization and aspect ratio for content
    const wasteScore = metrics.horizontalWaste / width
    // Prefer layouts with more columns but not too tall
    const aspectScore = Math.abs(metrics.aspectRatio - 1.6) // Target wider aspect ratio
    const columnScore = metrics.actualColumns > 2 ? -0.2 : 0.2 // Bonus for multi-column
    const score = wasteScore + aspectScore + columnScore

    console.log(
      `  ${width}x${height}: scroll=${metrics.scrollWidth}x${metrics.scrollHeight}, cols=${metrics.actualColumns}, waste=${metrics.horizontalWaste}px, score=${score.toFixed(3)}`
    )

    if (score < bestScore) {
      bestScore = score
      bestViewport = { width, height }
      bestLayout = metrics
    }
  }

  console.log(
    `✅ Selected viewport: ${bestViewport.width}x${bestViewport.height} (${bestLayout.actualColumns} columns, score: ${bestScore.toFixed(3)})`
  )
  return bestViewport
}

// Prepare page for single-page PDF generation
async function prepareSinglePageLayout(page, isSinglePage) {
  if (!isSinglePage) return

  console.log('🎨 Optimizing layout for single-page PDF...')

  // Inject CSS to override print styles and optimize for single page
  await page.addStyleTag({
    content: `
      /* Completely disable all page breaks for single-page mode */
      *, *::before, *::after {
        page-break-before: avoid !important;
        page-break-after: avoid !important;
        page-break-inside: avoid !important;
        break-before: avoid !important;
        break-after: avoid !important;
        break-inside: avoid !important;
        orphans: 999 !important;
        widows: 999 !important;
      }

      /* Override ALL print media queries */
      @media print {
        @page {
          size: auto !important;
          margin: 0 !important;
        }

        body, html {
          margin: 0 !important;
          padding: 0 !important;
          min-height: auto !important;
          height: auto !important;
          overflow: visible !important;
        }

        * {
          page-break-before: avoid !important;
          page-break-after: avoid !important;
          page-break-inside: avoid !important;
          break-before: avoid !important;
          break-after: avoid !important;
          break-inside: avoid !important;
        }

        .print-optimized {
          break-inside: auto !important;
          page-break-inside: auto !important;
        }
      }

      /* Remove any height constraints that might cause issues */
      html, body {
        height: auto !important;
        min-height: auto !important;
        max-height: none !important;
      }

      /* Ensure content uses full width */
      .max-w-7xl {
        max-width: none !important;
        width: 100% !important;
      }

      /* Fix header positioning for single-page PDF - target ONLY the problematic element */
      header {
        position: static !important;
        z-index: auto !important;
      }

      /* Target ONLY the specific problematic container that causes floating */
      header > div:nth-child(2) > div:last-child {
        position: static !important;
        bottom: auto !important;
        left: auto !important;
        right: auto !important;
        z-index: auto !important;
      }

      /* Remove bottom positioning from elements that have both fixed and bottom classes */
      header div[class*="fixed"][class*="bottom-0"] {
        position: static !important;
        bottom: auto !important;
        z-index: auto !important;
      }

      /* Fix only elements that are explicitly positioned with bottom: 0 */
      header [style*="bottom: 0"], header [style*="bottom:0"] {
        bottom: auto !important;
        position: static !important;
      }

      /* Hide navigation and UI elements in PDF - show only logo */
      header nav {
        display: none !important;
      }

      /* Hide right side controls (theme toggle, language selector, avatar, buttons) */
      header > div > div:last-child {
        display: none !important;
      }

      /* Hide mobile menu toggle */
      header button[data-aw-toggle-menu] {
        display: none !important;
      }

      /* Ensure header with logo is properly positioned */
      header > div > div:first-child {
        margin-right: 0 !important;
      }

      /* Remove any spacing that was meant for navigation */
      header > div {
        justify-content: flex-start !important;
      }

      /* Hide floating UI elements */
      #back-to-top {
        display: none !important;
      }

      #table-of-contents {
        display: none !important;
      }

      /* Optimize grid for single page */
      .grid {
        display: grid !important;
      }

      /* Force optimal column layout based on viewport */
      @media screen and (min-width: 1800px) {
        .xl\\:grid-cols-4 {
          grid-template-columns: repeat(4, 1fr) !important;
        }
      }

      @media screen and (min-width: 1400px) and (max-width: 1799px) {
        .xl\\:grid-cols-4 {
          grid-template-columns: repeat(3, 1fr) !important;
        }
      }

      @media screen and (min-width: 1000px) and (max-width: 1399px) {
        .xl\\:grid-cols-4 {
          grid-template-columns: repeat(2, 1fr) !important;
        }
      }

      /* Reduce gaps for better space utilization */
      .gap-4 {
        gap: 0.75rem !important;
      }

      /* Optimize spacing */
      .p-4 {
        padding: 0.75rem !important;
      }

      .py-3 {
        padding-top: 0.5rem !important;
        padding-bottom: 0.5rem !important;
      }

      /* Ensure no sections break */
      .code-section, .space-y-4 > *, .grid > * {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
    `,
  })

  // Wait for styles to apply
  await page.waitForTimeout(500)
}

// Get optimal PDF dimensions for single-page mode
async function getOptimalPDFDimensions(page, viewport) {
  const dimensions = await page.evaluate(() => {
    const body = document.body
    const documentElement = document.documentElement

    // Get the full content dimensions using multiple methods
    const scrollWidth = Math.max(
      body.scrollWidth,
      body.offsetWidth,
      documentElement.clientWidth,
      documentElement.scrollWidth,
      documentElement.offsetWidth
    )

    const scrollHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      documentElement.clientHeight,
      documentElement.scrollHeight,
      documentElement.offsetHeight
    )

    // Get actual content bounds - use body bounds as primary
    const bodyRect = body.getBoundingClientRect()
    let contentBounds = {
      width: bodyRect.width || scrollWidth,
      height: bodyRect.height || scrollHeight,
    }

    // Also check main containers
    const containers = [
      document.querySelector('.max-w-7xl'),
      document.querySelector('.container'),
      document.querySelector('main'),
      document.querySelector('.grid'),
    ].filter((el) => el !== null)

    let maxContentHeight = contentBounds.height
    let maxContentWidth = contentBounds.width

    containers.forEach((container) => {
      const rect = container.getBoundingClientRect()
      const style = window.getComputedStyle(container)
      const marginTop = parseInt(style.marginTop) || 0
      const marginBottom = parseInt(style.marginBottom) || 0
      const marginLeft = parseInt(style.marginLeft) || 0
      const marginRight = parseInt(style.marginRight) || 0

      const totalHeight = rect.height + marginTop + marginBottom
      const totalWidth = rect.width + marginLeft + marginRight

      if (totalHeight > maxContentHeight) {
        maxContentHeight = totalHeight
      }
      if (totalWidth > maxContentWidth) {
        maxContentWidth = totalWidth
      }
    })

    // Final content bounds - use the larger of scroll or calculated bounds
    contentBounds = {
      width: Math.max(maxContentWidth, scrollWidth),
      height: Math.max(maxContentHeight, scrollHeight),
      bodyWidth: bodyRect.width,
      bodyHeight: bodyRect.height,
    }

    // Check grid layout for optimal sizing
    const gridContainer = document.querySelector('.grid')
    let gridInfo = null
    if (gridContainer) {
      const gridRect = gridContainer.getBoundingClientRect()
      const computedStyle = window.getComputedStyle(gridContainer)
      gridInfo = {
        width: gridRect.width,
        height: gridRect.height,
        columns: computedStyle.gridTemplateColumns?.split(' ').length || 1,
      }
    }

    return {
      scrollWidth,
      scrollHeight,
      contentBounds,
      gridInfo,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      bodyRect: {
        width: bodyRect.width,
        height: bodyRect.height,
        top: bodyRect.top,
        left: bodyRect.left,
      },
    }
  })

  // Calculate optimal PDF size - prioritize scroll dimensions for single-page
  const optimalWidth = Math.max(
    dimensions.scrollWidth,
    dimensions.contentBounds.width || 0,
    dimensions.gridInfo?.width || 0,
    viewport.width
  )

  const optimalHeight = Math.max(
    dimensions.scrollHeight,
    dimensions.contentBounds.height || 0,
    dimensions.gridInfo?.height || 0
  )

  console.log(`📏 Content analysis:`)
  console.log(`   Scroll: ${dimensions.scrollWidth}x${dimensions.scrollHeight}px`)
  console.log(
    `   Content bounds: ${Math.round(dimensions.contentBounds.width || 0)}x${Math.round(dimensions.contentBounds.height || 0)}px`
  )
  console.log(
    `   Body rect: ${Math.round(dimensions.bodyRect.width)}x${Math.round(dimensions.bodyRect.height)}px`
  )
  if (dimensions.gridInfo) {
    console.log(
      `   Grid: ${Math.round(dimensions.gridInfo.width)}x${Math.round(dimensions.gridInfo.height)}px (${dimensions.gridInfo.columns} cols)`
    )
  }
  console.log(`   Viewport: ${dimensions.viewportWidth}x${dimensions.viewportHeight}px`)
  console.log(`   Selected: ${Math.ceil(optimalWidth)}x${Math.ceil(optimalHeight)}px`)

  return {
    width: Math.ceil(optimalWidth),
    height: Math.ceil(optimalHeight),
    rawDimensions: dimensions,
  }
}

// Comprehensive wait for all load events to ensure complete resource loading
async function waitForAllLoadEvents(page) {
  console.log('⏳ Verifying complete page loading with multiple events...')

  try {
    await page.evaluate(() => {
      return new Promise((resolve) => {
        const timeoutId = setTimeout(() => {
          console.log('Timeout waiting for all load events')
          resolve({ success: false, reason: 'timeout' })
        }, 60000)

        const eventsFired = {
          domContentLoaded: false,
          load: false,
          imagesLoaded: false,
        }

        // Check if already complete
        if (document.readyState === 'complete') {
          eventsFired.domContentLoaded = true
          eventsFired.load = true
        }

        // Check images
        const checkImages = () => {
          const images = Array.from(document.querySelectorAll('img'))
          if (images.length === 0) {
            eventsFired.imagesLoaded = true
            return true
          }

          const allImagesLoaded = images.every((img) => img.complete && img.naturalHeight > 0)

          if (allImagesLoaded) {
            eventsFired.imagesLoaded = true
          }

          return allImagesLoaded
        }

        // Check if everything is already loaded
        if (eventsFired.load && checkImages()) {
          clearTimeout(timeoutId)
          resolve({ success: true, eventsFired })
          return
        }

        // Set up event listeners
        const handleDOMContentLoaded = () => {
          eventsFired.domContentLoaded = true
          checkAllEvents()
        }

        const handleLoad = () => {
          eventsFired.load = true
          checkAllEvents()
        }

        const checkAllEvents = () => {
          if (eventsFired.load && checkImages()) {
            clearTimeout(timeoutId)
            document.removeEventListener('DOMContentLoaded', handleDOMContentLoaded)
            window.removeEventListener('load', handleLoad)
            resolve({ success: true, eventsFired })
          }
        }

        // Add event listeners
        if (!eventsFired.domContentLoaded) {
          document.addEventListener('DOMContentLoaded', handleDOMContentLoaded)
        }

        if (!eventsFired.load) {
          window.addEventListener('load', handleLoad)
        }

        // Initial check in case we missed the events
        setTimeout(() => {
          checkAllEvents()
        }, 100)
      })
    })

    console.log('✅ All load events verified successfully')
  } catch {
    console.log('⚠️ Comprehensive event verification timeout')
  }
}

// Enhanced image waiting with event-based detection
async function waitForImagesWithEvents(page, verbose = false, timeout = 30000) {
  console.log('🖼️  Checking image loading status...')

  const startTime = Date.now()

  try {
    // First, check if we have any images at all
    const imageCount = await page.evaluate(() => {
      return document.querySelectorAll('img').length
    })

    if (imageCount === 0) {
      console.log('ℹ️  No images found on page')
      return
    }

    console.log(`📊 Found ${imageCount} image(s), checking load status...`)

    // Use Playwright's waitForFunction with enhanced image checking
    await page.waitForFunction(
      () => {
        const images = Array.from(document.querySelectorAll('img'))
        const imageInfo = {
          total: images.length,
          complete: 0,
          loaded: 0,
          failed: 0,
          loading: 0,
          naturalHeightZero: 0,
        }

        images.forEach((img) => {
          if (img.complete) {
            imageInfo.complete++
          }

          if (img.naturalHeight > 0) {
            imageInfo.loaded++
          } else if (img.complete) {
            imageInfo.naturalHeightZero++
          }

          if (img.complete && img.naturalHeight === 0) {
            imageInfo.failed++
          } else if (!img.complete) {
            imageInfo.loading++
          }
        })

        // Return the analysis and whether all are loaded
        return {
          ...imageInfo,
          allLoaded: imageInfo.loading === 0,
          readyForPDF: imageInfo.loading === 0 && imageInfo.failed === 0,
        }
      },
      {
        timeout: timeout,
      }
    )

    const loadTime = Date.now() - startTime
    console.log(`✅ Image loading analysis completed in ${loadTime}ms`)

    // Get final status for verbose mode
    if (verbose) {
      const finalStatus = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'))
        return images.map((img, index) => ({
          index: index + 1,
          src: img.src.substring(0, 100),
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          loading: img.loading,
          status:
            img.complete && img.naturalHeight > 0
              ? 'LOADED'
              : img.complete && img.naturalHeight === 0
                ? 'FAILED'
                : 'LOADING',
        }))
      })

      console.log('\n📋 Final Image Status:')
      finalStatus.forEach((img) => {
        console.log(`  ${img.index}. ${img.src}... - ${img.status}`)
      })
    }

    // Brief pause for any final rendering
    await page.waitForTimeout(500)
  } catch (error) {
    const loadTime = Date.now() - startTime
    console.log(`⚠️ Image analysis timeout after ${loadTime}ms: ${error.message}`)

    if (verbose) {
      const failedStatus = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'))
        return images.reduce(
          (stats, img) => {
            if (img.complete && img.naturalHeight === 0) {
              stats.failed++
            } else if (!img.complete) {
              stats.loading++
            } else {
              stats.loaded++
            }
            return stats
          },
          { loaded: 0, failed: 0, loading: 0, total: images.length }
        )
      })

      console.log(
        `📊 Status at timeout: ${failedStatus.loaded} loaded, ${failedStatus.failed} failed, ${failedStatus.loading} still loading of ${failedStatus.total} total`
      )
    }
  }
}

// Handle cross-origin images and lazy loading
async function handleCrossOriginImages(page) {
  await page.evaluate(() => {
    const images = document.querySelectorAll('img')
    images.forEach((img) => {
      // Add crossorigin attribute if not present and image is from external domain
      if (
        !img.crossOrigin &&
        img.src &&
        (img.src.includes('http://') || img.src.includes('https://'))
      ) {
        img.crossOrigin = 'anonymous'
      }

      // Remove lazy loading attributes to ensure immediate loading
      if (img.loading === 'lazy') {
        img.loading = 'eager'
      }

      // Remove data-src and similar lazy loading attributes
      if (img.dataset.src && !img.src) {
        img.src = img.dataset.src
      }

      // Handle other common lazy loading patterns
      ;['data-lazy', 'data-original', 'data-srcset'].forEach((attr) => {
        if (img.dataset[attr.replace('data-', '')] && !img.src) {
          img.src = img.dataset[attr.replace('data-', '')]
        }
      })

      // Force reload images that failed to load
      if (img.naturalHeight === 0 && img.complete && img.src) {
        const originalSrc = img.src
        img.src = ''
        setTimeout(() => {
          img.src = originalSrc
        }, 100)
      }
    })

    // Scroll to trigger any remaining lazy-loaded images
    window.scrollTo(0, document.body.scrollHeight)
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 500)
  })
}

async function main() {
  const argv = parseArgs(process.argv.slice(2))

  // Enhanced input/output handling (replaces bash script functionality)
  const input = argv.input
  const output = argv.output

  if (!input) {
    console.error('Usage: pdf-export.mjs <input> [output] [options]')
    console.error('')
    console.error('Arguments:')
    console.error('  <input>                 Input HTML file or URL (required)')
    console.error(
      '  [output]                Output PDF file (optional, defaults to input basename + .pdf)'
    )
    console.error('')
    console.error('Options:')
    console.error(
      '  --single-page          Generate one continuous page PDF (removes all page breaks)'
    )
    console.error(
      '  --viewport WxH         Set viewport, e.g. 1280x800 (auto-detected if not provided)'
    )
    console.error('  --margin VALUE         Margin, e.g. 20px')
    console.error('  --format FORMAT        Page format, e.g. A4')
    console.error('  --width VALUE          Custom width (for single-page)')
    console.error('  --height VALUE         Custom height (for single-page)')
    console.error('  --background           Print background (default true)')
    console.error('  --scale VALUE          Scale factor, e.g. 0.8 (default 1.0)')
    console.error('  --verbose              Enable detailed logging')
    console.error('')
    console.error('Examples:')
    console.error('  pdf-export.mjs page.html                              # → page.pdf (standard)')
    console.error(
      '  pdf-export.mjs page.html custom.pdf --single-page     # → custom.pdf (one page)'
    )
    console.error(
      '  pdf-export.mjs page.html --margin=10px --scale=0.8    # → page.pdf with options'
    )
    console.error('')
    console.error(
      'Note: This script replaces the html2pdf bash function with enhanced functionality.'
    )
    process.exit(1)
  }

  // Validate input file exists (if it's not a URL)
  if (!input.startsWith('http://') && !input.startsWith('https://')) {
    try {
      const inputPath = path.resolve(input)
      // Check if file exists
      await fs.promises.access(inputPath)
    } catch {
      console.error(`❌ Error: Input file not found: ${input}`)
      console.error(`💡 Tip: Make sure the file path is correct and the file exists`)
      process.exit(1)
    }
  }

  // Convert input to absolute path or leave URL as-is
  let inputUrl
  if (input.startsWith('http://') || input.startsWith('https://')) {
    inputUrl = input
  } else {
    inputUrl = pathToFileURL(path.resolve(input)).href
  }

  // Output is already resolved by parseArgs
  const resolvedOutput = path.resolve(output)

  console.log(`📄 Converting: ${input} → ${path.basename(resolvedOutput)}`)
  if (argv.verbose) {
    console.log(`   Input URL: ${inputUrl}`)
    console.log(`   Output Path: ${resolvedOutput}`)
  }

  const browser = await chromium.launch()
  const page = await browser.newPage()

  // Determine viewport - auto-detect if not provided
  let viewport
  if (argv.viewport) {
    const viewportStr = argv.viewport
    const [vw, vh] = viewportStr.split('x').map(Number)
    viewport = { width: vw, height: vh }
    console.log(`🖥️  Using specified viewport: ${vw}x${vh}`)
  } else {
    viewport = await detectOptimalViewport(page, inputUrl)
  }

  // Set final viewport and load page with enhanced wait strategy
  await page.setViewportSize(viewport)

  // Use comprehensive event-based loading detection
  console.log('📄 Loading page with comprehensive event detection...')

  // Load page and wait for network to be idle (all resources downloaded)
  await page.goto(inputUrl, {
    waitUntil: 'networkidle', // Wait for network activity to stop
    timeout: 60000,
  })

  // Additional verification with multiple events
  await waitForAllLoadEvents(page)

  // Handle cross-origin image issues after initial load
  await handleCrossOriginImages(page)

  // Final verification of image loading status
  await waitForImagesWithEvents(page, argv.verbose)

  // Handle page mode
  const isSinglePage = argv['single-page']

  // Prepare layout based on selected mode
  if (isSinglePage) {
    await prepareSinglePageLayout(page, true)
  }

  // Options with defaults and validation
  let marginVal
  try {
    marginVal = validateMargin(argv.margin)
  } catch (error) {
    await browser.close()
    console.error(`❌ ${error.message}`)
    process.exit(1)
  }

  const margin = {
    top: marginVal,
    bottom: marginVal,
    left: marginVal,
    right: marginVal,
  }
  const format = argv.format || 'A4'
  const background = argv.background !== false
  const scale = parseFloat(argv.scale) || 1.0

  if (isSinglePage) {
    // Get optimal PDF dimensions for single-page mode
    const pdfDimensions = await getOptimalPDFDimensions(page, viewport)

    // Use user-specified dimensions or calculated optimal ones
    const pdfWidth = argv.width || `${pdfDimensions.width}px`
    const pdfHeight = argv.height || `${pdfDimensions.height}px`

    // For single-page mode, apply margins if specified, otherwise no margins
    const singlePageMargin = argv.margin
      ? margin
      : { top: '0px', bottom: '0px', left: '0px', right: '0px' }

    console.log(`📄 Single-page PDF dimensions: ${pdfWidth} x ${pdfHeight}`)
    console.log(`📐 Margins: ${JSON.stringify(singlePageMargin)}`)

    await page.pdf({
      path: resolvedOutput,
      printBackground: background,
      width: pdfWidth,
      height: pdfHeight,
      margin: singlePageMargin,
      scale: scale,
      preferCSSPageSize: false,
      // Force single page mode
      format: undefined,
      displayHeaderFooter: false,
      headerTemplate: '',
      footerTemplate: '',
      omitBackground: false,
    })
  } else {
    // Standard mode
    console.log(`📄 Using format: ${format}`)
    console.log(`📐 Margins: ${JSON.stringify(margin)}`)
    console.log(`🔍 Scale: ${scale}`)

    await page.pdf({
      path: resolvedOutput,
      printBackground: background,
      format: format,
      margin,
      scale: scale,
      preferCSSPageSize: true,
    })
  }

  await browser.close()
  console.log(`✅ PDF saved to: ${resolvedOutput}`)
}

main().catch((error) => {
  console.error(`❌ Error: ${error.message}`)

  // Provide helpful suggestions based on common error patterns
  if (error.message.includes('Failed to parse parameter value')) {
    console.error(
      `💡 Tip: Check your margin value. Use valid CSS units like "10px", "1cm", "0.5in", etc.`
    )
  } else if (error.message.includes('viewport')) {
    console.error(`💡 Tip: Viewport should be in format "1920x1080" (width x height in pixels)`)
  } else if (error.message.includes('ENOENT') || error.message.includes('file not found')) {
    console.error(`💡 Tip: Make sure the input file exists and path is correct`)
  }

  process.exit(1)
})
