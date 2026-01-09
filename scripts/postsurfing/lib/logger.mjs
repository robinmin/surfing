/**
 * Logger utility for PostSurfing CLI
 *
 * Provides structured logging with different levels and formatting
 */

import { inspect } from 'util'

export class Logger {
  constructor(verbose = false) {
    this.verbose = verbose
    this.stepCounter = 0
  }

  /**
   * Log an informational message
   */
  info(message) {
    console.log(`ℹ️  ${message}`)
  }

  /**
   * Log an informational message (verbose mode only)
   */
  infoVerbose(message) {
    if (this.verbose) {
      console.log(`ℹ️  ${message}`)
    }
  }

  /**
   * Log a success message
   */
  success(message) {
    console.log(`✅ ${message}`)
  }

  /**
   * Log a success message (verbose mode only)
   */
  successVerbose(message) {
    if (this.verbose) {
      console.log(`✅ ${message}`)
    }
  }

  /**
   * Log a warning message
   */
  warn(message) {
    console.log(`⚠️  ${message}`)
  }

  /**
   * Log a warning message (verbose mode only)
   */
  warnVerbose(message) {
    if (this.verbose) {
      console.log(`⚠️  ${message}`)
    }
  }

  /**
   * Log an error message
   */
  error(message) {
    console.error(`❌ ${message}`)
  }

  /**
   * Log a debug message (only in verbose mode)
   */
  debug(message) {
    if (this.verbose) {
      console.log(`🐛 DEBUG: ${message}`)
    }
  }

  /**
   * Log a step in the process
   */
  step(message) {
    this.stepCounter++
    console.log(`\n${this.stepCounter}. ${message}`)
  }

  /**
   * Log an object in a readable format
   */
  object(obj, label = 'Object') {
    if (this.verbose) {
      console.log(`📋 ${label}:`)
      console.log(inspect(obj, { colors: true, depth: 3 }))
    }
  }

  /**
   * Log a file operation
   */
  file(operation, path) {
    if (this.verbose) {
      console.log(`📁 ${operation}: ${path}`)
    }
  }

  /**
   * Log a prompt message
   */
  prompt(message) {
    console.log(`❓ ${message}`)
  }

  /**
   * Log a list of items
   */
  list(items, title = 'Items') {
    if (this.verbose) {
      console.log(`\n📋 ${title}:`)
      items.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item}`)
      })
    }
  }

  /**
   * Log a list of items (always visible)
   */
  listAlways(items, title = 'Items') {
    console.log(`\n📋 ${title}:`)
    items.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item}`)
    })
  }

  /**
   * Log a table of key-value pairs
   */
  table(data, title = 'Data') {
    console.log(`\n📊 ${title}:`)
    Object.entries(data).forEach(([key, value]) => {
      const displayValue = typeof value === 'object' ? JSON.stringify(value) : String(value)
      console.log(`   ${key}: ${displayValue}`)
    })
  }

  /**
   * Log a separator line
   */
  separator() {
    console.log('─'.repeat(50))
  }

  /**
   * Log build output with error highlighting
   */
  buildOutput(output, isError = false) {
    const lines = output.split('\n')

    lines.forEach((line) => {
      if (line.includes('error') || line.includes('Error') || line.includes('ERROR')) {
        console.log(`🔴 ${line}`)
      } else if (line.includes('warn') || line.includes('Warning') || line.includes('WARN')) {
        console.log(`🟡 ${line}`)
      } else if (line.includes('✓') || line.includes('success') || line.includes('Success')) {
        console.log(`🟢 ${line}`)
      } else if (this.verbose || isError) {
        console.log(`   ${line}`)
      }
    })
  }

  /**
   * Log a progress indicator
   */
  progress(current, total, operation = 'Processing') {
    const percentage = Math.round((current / total) * 100)
    const progressBar =
      '█'.repeat(Math.floor(percentage / 5)) + '░'.repeat(20 - Math.floor(percentage / 5))

    process.stdout.write(`\r⏳ ${operation}: [${progressBar}] ${percentage}% (${current}/${total})`)

    if (current === total) {
      console.log() // New line when complete
    }
  }

  /**
   * Clear the current line (useful for progress updates)
   */
  clearLine() {
    process.stdout.write('\r\x1b[K')
  }

  /**
   * Log a confirmation prompt result
   */
  confirmation(question, answer) {
    const emoji = answer ? '✅' : '❌'
    console.log(`${emoji} ${question} → ${answer ? 'Yes' : 'No'}`)
  }

  /**
   * Log frontmatter validation results
   */
  frontmatterValidation(results) {
    if (this.verbose) {
      console.log('\n📝 Frontmatter Validation:')
    }

    if (results.valid) {
      if (this.verbose) {
        console.log('✅ All required fields are present')
      }
    } else {
      console.log('❌ Missing required fields:')
      results.missing.forEach((field) => {
        console.log(`   • ${field}`)
      })
    }

    if (this.verbose && results.warnings && results.warnings.length > 0) {
      console.log('\n⚠️  Warnings:')
      results.warnings.forEach((warning) => {
        console.log(`   • ${warning}`)
      })
    }

    if (this.verbose && results.suggestions && results.suggestions.length > 0) {
      console.log('\n💡 Suggestions:')
      results.suggestions.forEach((suggestion) => {
        console.log(`   • ${suggestion}`)
      })
    }
  }

  /**
   * Log git operation results
   */
  gitOperation(operation, result) {
    if (result.success) {
      console.log(`✅ Git ${operation} successful`)
      if (result.output && this.verbose) {
        console.log(`   Output: ${result.output}`)
      }
    } else {
      console.log(`❌ Git ${operation} failed`)
      console.log(`   Error: ${result.error}`)
    }
  }

  /**
   * Log HTML conversion results
   */
  htmlConversion(results) {
    if (this.verbose) {
      console.log('\n🔄 HTML Conversion Results:')

      if (results.title) {
        console.log(`   📝 Title extracted: ${results.title}`)
      }

      if (results.externalCSSCount > 0) {
        console.log(`   🔗 External CSS: ${results.externalCSSCount} file(s)`)
      }

      if (results.externalJSCount > 0) {
        console.log(`   🔗 External JS: ${results.externalJSCount} file(s)`)
      }

      if (results.cssExtracted) {
        console.log(`   🎨 Custom CSS extracted: ${results.cssLines} lines`)
      }

      if (results.jsExtracted) {
        console.log(`   ⚡ Custom JavaScript extracted: ${results.jsLines} lines`)
      }

      if (results.metaExtracted && results.metaExtracted.length > 0) {
        console.log(`   📋 Meta tags extracted: ${results.metaExtracted.length}`)
      }

      console.log(`   📄 Content body: ${results.bodyLines} lines`)
    }
  }
}
