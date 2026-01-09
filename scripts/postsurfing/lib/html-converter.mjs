/**
 * HTML Converter for PostSurfing CLI
 *
 * Converts HTML files to Surfing-compatible format following the migration guide
 */

export class HtmlConverter {
  constructor(logger) {
    this.logger = logger
  }

  /**
   * Convert HTML content to Surfing format
   */
  async convert(content, metadata, autoConvert = false) {
    this.logger.debug('Starting HTML conversion')

    // Check if this is a full HTML document
    const isFullHtml = this.isFullHtmlDocument(content)

    if (!isFullHtml) {
      this.logger.infoVerbose('Content appears to be HTML fragment, minimal processing needed')
      return this.processHtmlFragment(content, metadata)
    }

    this.logger.infoVerbose('Full HTML document detected, performing complete conversion')

    if (!autoConvert) {
      const shouldConvert = await this.promptForConversion()
      if (!shouldConvert) {
        throw new Error('HTML conversion cancelled by user')
      }
    }

    return this.processFullHtmlDocument(content, metadata)
  }

  /**
   * Check if content is a full HTML document
   */
  isFullHtmlDocument(content) {
    const hasDoctype = content.includes('<!DOCTYPE')
    const hasHtmlTag = content.includes('<html')
    const hasHeadTag = content.includes('<head')
    const hasBodyTag = content.includes('<body')

    return hasDoctype || hasHtmlTag || hasHeadTag || hasBodyTag
  }

  /**
   * Process HTML fragment (minimal processing)
   */
  processHtmlFragment(content) {
    const results = {
      extractedMetadata: {},
      customCSS: null,
      customJS: null,
      bodyContent: content,
      cssLines: 0,
      jsLines: 0,
      bodyLines: content.split('\n').length,
    }

    // Extract inline styles and scripts
    const { css, js, cleanContent } = this.extractInlineAssets(content)

    if (css) {
      results.customCSS = css
      results.cssLines = css.split('\n').length
    }

    if (js) {
      results.customJS = js
      results.jsLines = js.split('\n').length
    }

    results.bodyContent = cleanContent
    results.bodyLines = cleanContent.split('\n').length

    this.logger.htmlConversion(results)
    return results
  }

  /**
   * Process full HTML document
   */
  processFullHtmlDocument(content) {
    const results = {
      extractedMetadata: {},
      externalCSS: null,
      externalJS: null,
      externalCSSCount: 0,
      externalJSCount: 0,
      customCSS: null,
      customJS: null,
      bodyContent: '',
      cssLines: 0,
      jsLines: 0,
      bodyLines: 0,
      metaExtracted: [],
    }

    // Extract head content
    const headMatch = content.match(/<head[^>]*>([\s\S]*?)<\/head>/i)
    if (headMatch) {
      const headContent = headMatch[1]

      // Extract title
      const titleMatch = headContent.match(/<title[^>]*>(.*?)<\/title>/i)
      if (titleMatch) {
        results.extractedMetadata.title = titleMatch[1].trim()
        results.title = titleMatch[1].trim()
      }

      // Extract meta tags
      const metaTags = this.extractMetaTags(headContent)
      results.extractedMetadata = { ...results.extractedMetadata, ...metaTags }
      results.metaExtracted = Object.keys(metaTags)

      // Extract external CSS from head
      const externalCSS = this.extractExternalCSSFromHead(headContent)
      if (externalCSS) {
        results.externalCSS = externalCSS
        results.externalCSSCount = externalCSS.length
      }

      // Extract external JS from head
      const externalJS = this.extractExternalJSFromHead(headContent)
      if (externalJS) {
        results.externalJS = externalJS
        results.externalJSCount = externalJS.length
      }

      // Extract CSS from head
      const headCSS = this.extractCSSFromHead(headContent)
      if (headCSS) {
        results.customCSS = headCSS
        results.cssLines = headCSS.split('\n').length
        results.cssExtracted = true
      }

      // Extract JS from head
      const headJS = this.extractJSFromHead(headContent)
      if (headJS) {
        results.customJS = headJS
        results.jsLines = headJS.split('\n').length
        results.jsExtracted = true
      }
    }

    // Extract body content
    const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    if (bodyMatch) {
      const bodyContent = bodyMatch[1]

      // Extract inline CSS and JS from body
      const { css: bodyCSS, js: bodyJS, cleanContent } = this.extractInlineAssets(bodyContent)

      // Combine CSS from head and body
      if (bodyCSS) {
        results.customCSS = results.customCSS
          ? `${results.customCSS}\n\n/* Inline styles from body */\n${bodyCSS}`
          : bodyCSS
        results.cssLines += bodyCSS.split('\n').length
        results.cssExtracted = true
      }

      // Combine JS from head and body
      if (bodyJS) {
        results.customJS = results.customJS
          ? `${results.customJS}\n\n// Inline scripts from body\n${bodyJS}`
          : bodyJS
        results.jsLines += bodyJS.split('\n').length
        results.jsExtracted = true
      }

      results.bodyContent = cleanContent.trim()
      results.bodyLines = results.bodyContent.split('\n').length
    } else {
      // No body tag found, use entire content minus head
      let bodyContent = content
      if (headMatch) {
        bodyContent = content.replace(/<head[^>]*>[\s\S]*?<\/head>/i, '')
      }

      // Remove html, doctype, and body tags
      bodyContent = bodyContent
        .replace(/<!DOCTYPE[^>]*>/i, '')
        .replace(/<\/?html[^>]*>/gi, '')
        .replace(/<\/?body[^>]*>/gi, '')
        .trim()

      const { css, js, cleanContent } = this.extractInlineAssets(bodyContent)

      if (css) {
        results.customCSS = results.customCSS ? `${results.customCSS}\n${css}` : css
        results.cssLines += css.split('\n').length
        results.cssExtracted = true
      }

      if (js) {
        results.customJS = results.customJS ? `${results.customJS}\n${js}` : js
        results.jsLines += js.split('\n').length
        results.jsExtracted = true
      }

      results.bodyContent = cleanContent.trim()
      results.bodyLines = results.bodyContent.split('\n').length
    }

    this.logger.htmlConversion(results)
    return results
  }

  /**
   * Extract meta tags from head content
   */
  extractMetaTags(headContent) {
    const metadata = {}

    // Extract description
    const descMatch = headContent.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i
    )
    if (descMatch) {
      metadata.description = descMatch[1]
    }

    // Extract keywords
    const keywordsMatch = headContent.match(
      /<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["']/i
    )
    if (keywordsMatch) {
      metadata.keywords = keywordsMatch[1].split(',').map((k) => k.trim())
    }

    // Extract author
    const authorMatch = headContent.match(
      /<meta[^>]*name=["']author["'][^>]*content=["']([^"']+)["']/i
    )
    if (authorMatch) {
      metadata.author = authorMatch[1]
    }

    // Extract viewport (for responsive indication)
    const viewportMatch = headContent.match(/<meta[^>]*name=["']viewport["']/i)
    if (viewportMatch) {
      metadata.responsive = true
    }

    return metadata
  }

  /**
   * Extract external CSS links from head section
   */
  extractExternalCSSFromHead(headContent) {
    const externalCSS = []

    // Extract link tags with rel="stylesheet"
    const linkMatches = headContent.matchAll(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi)
    for (const match of linkMatches) {
      const hrefMatch = match[0].match(/href=["']([^"']+)["']/i)
      if (hrefMatch) {
        externalCSS.push(hrefMatch[1])
      }
    }

    return externalCSS.length > 0 ? externalCSS : null
  }

  /**
   * Extract CSS from head section
   */
  extractCSSFromHead(headContent) {
    const cssBlocks = []

    // Extract style tags
    const styleMatches = headContent.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)
    for (const match of styleMatches) {
      cssBlocks.push(match[1].trim())
    }

    return cssBlocks.length > 0 ? cssBlocks.join('\n\n') : null
  }

  /**
   * Extract external JavaScript links from head section
   */
  extractExternalJSFromHead(headContent) {
    const externalJS = []

    // Extract script tags with src attribute
    const scriptMatches = headContent.matchAll(/<script[^>]*src=["']([^"']+)["'][^>]*>/gi)
    for (const match of scriptMatches) {
      externalJS.push(match[1])
    }

    return externalJS.length > 0 ? externalJS : null
  }

  /**
   * Extract JavaScript from head section
   */
  extractJSFromHead(headContent) {
    const jsBlocks = []

    // Extract script tags with content (not external scripts)
    const scriptMatches = headContent.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi)
    for (const match of scriptMatches) {
      const scriptContent = match[1].trim()
      if (scriptContent) {
        jsBlocks.push(scriptContent)
      }
    }

    return jsBlocks.length > 0 ? jsBlocks.join('\n\n') : null
  }

  /**
   * Extract inline CSS and JS from content and return clean content
   */
  extractInlineAssets(content) {
    const cssBlocks = []
    const jsBlocks = []
    let cleanContent = content

    // Extract style tags
    const styleMatches = content.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)
    for (const match of styleMatches) {
      cssBlocks.push(match[1].trim())
      cleanContent = cleanContent.replace(match[0], '')
    }

    // Extract script tags
    const scriptMatches = content.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi)
    for (const match of scriptMatches) {
      const scriptContent = match[1].trim()
      if (scriptContent) {
        jsBlocks.push(scriptContent)
      }
      cleanContent = cleanContent.replace(match[0], '')
    }

    // Clean up extra whitespace
    cleanContent = cleanContent.replace(/\n\s*\n\s*\n/g, '\n\n').trim()

    return {
      css: cssBlocks.length > 0 ? cssBlocks.join('\n\n') : null,
      js: jsBlocks.length > 0 ? jsBlocks.join('\n\n') : null,
      cleanContent,
    }
  }

  /**
   * Prompt user for conversion confirmation
   */
  async promptForConversion() {
    this.logger.prompt('This appears to be a full HTML document.')
    this.logger.infoVerbose('The conversion will:')
    this.logger.list(
      [
        'Extract CSS from <style> tags to customCSS frontmatter',
        'Extract JavaScript from <script> tags to customJS frontmatter',
        'Remove <html>, <head>, and <body> tags',
        'Extract metadata from <meta> tags',
        'Preserve only the body content',
      ],
      'Conversion Steps'
    )

    // In a real implementation, you'd use a proper prompt library
    // For now, we'll assume auto-conversion
    this.logger.infoVerbose('Auto-converting (use --auto-convert to skip this prompt)')
    return true
  }
}
