/**
 * Build Validator for PostSurfing CLI
 *
 * Validates that the site builds successfully after content changes
 */

import { spawn } from 'child_process'

export class BuildValidator {
  constructor(logger) {
    this.logger = logger
    this.projectRoot = process.cwd()
  }

  /**
   * Validate that the site builds successfully
   */
  async validate() {
    this.logger.debug('Starting build validation')

    try {
      const result = await this.runBuild()

      if (result.success) {
        this.logger.success('Build validation passed')
        return { success: true }
      } else {
        const analysis = this.analyzeBuildErrors(result.output)
        return {
          success: false,
          error: result.error,
          output: result.output,
          analysis,
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        analysis: {
          type: 'system_error',
          suggestions: ['Check Node.js installation', 'Verify npm dependencies'],
        },
      }
    }
  }

  /**
   * Run the build command
   */
  async runBuild() {
    return new Promise((resolve) => {
      this.logger.infoVerbose('Running npm run build...')

      const buildProcess = spawn('npm', ['run', 'build'], {
        cwd: this.projectRoot,
        stdio: 'pipe',
        shell: true,
      })

      let stdout = ''
      let stderr = ''

      buildProcess.stdout.on('data', (data) => {
        const output = data.toString()
        stdout += output

        // Show real-time output in verbose mode
        if (this.logger.verbose) {
          this.logger.buildOutput(output)
        }
      })

      buildProcess.stderr.on('data', (data) => {
        const output = data.toString()
        stderr += output

        if (this.logger.verbose) {
          this.logger.buildOutput(output, true)
        }
      })

      buildProcess.on('close', (code) => {
        const output = stdout + stderr

        if (code === 0) {
          resolve({ success: true, output })
        } else {
          resolve({
            success: false,
            error: `Build failed with exit code ${code}`,
            output,
          })
        }
      })

      buildProcess.on('error', (error) => {
        resolve({
          success: false,
          error: `Failed to start build process: ${error.message}`,
          output: stderr,
        })
      })
    })
  }

  /**
   * Analyze build errors and provide helpful suggestions
   */
  analyzeBuildErrors(output) {
    const analysis = {
      type: 'unknown',
      errors: [],
      suggestions: [],
      affectedFiles: [],
    }

    const lines = output.split('\n')

    for (const line of lines) {
      const trimmed = line.trim()

      // Content collection errors
      if (trimmed.includes('content collection') || trimmed.includes('frontmatter')) {
        analysis.type = 'content_error'
        analysis.errors.push(this.extractContentError(trimmed))
        analysis.suggestions.push('Check frontmatter syntax and required fields')
      }

      // TypeScript errors
      else if (trimmed.includes('TS') && (trimmed.includes('error') || trimmed.includes('Error'))) {
        analysis.type = 'typescript_error'
        analysis.errors.push(this.extractTypeScriptError(trimmed))
        analysis.suggestions.push('Fix TypeScript type errors')
      }

      // Astro component errors
      else if (trimmed.includes('.astro') && trimmed.includes('error')) {
        analysis.type = 'astro_error'
        analysis.errors.push(this.extractAstroError(trimmed))
        analysis.suggestions.push('Check Astro component syntax')
      }

      // Markdown/MDX errors
      else if (trimmed.includes('.md') || trimmed.includes('.mdx')) {
        analysis.type = 'markdown_error'
        analysis.errors.push(this.extractMarkdownError(trimmed))
        analysis.suggestions.push('Check markdown syntax and frontmatter')
      }

      // Import/module errors
      else if (trimmed.includes('Cannot resolve') || trimmed.includes('Module not found')) {
        analysis.type = 'import_error'
        analysis.errors.push(this.extractImportError(trimmed))
        analysis.suggestions.push('Check import paths and module availability')
      }

      // Memory errors
      else if (trimmed.includes('out of memory') || trimmed.includes('ENOMEM')) {
        analysis.type = 'memory_error'
        analysis.errors.push('Out of memory during build')
        analysis.suggestions.push('Increase Node.js memory limit with --max-old-space-size')
      }

      // File path errors
      else if (trimmed.includes('ENOENT') || trimmed.includes('no such file')) {
        analysis.type = 'file_error'
        analysis.errors.push(this.extractFileError(trimmed))
        analysis.suggestions.push('Check file paths and ensure all referenced files exist')
      }
    }

    // Extract affected files
    analysis.affectedFiles = this.extractAffectedFiles(output)

    // Add specific suggestions based on error type
    this.addSpecificSuggestions(analysis)

    return analysis
  }

  /**
   * Extract content collection errors
   */
  extractContentError(line) {
    // Look for patterns like "Invalid frontmatter in contents/articles/file.md"
    const fileMatch = line.match(/src\/content\/[^:]+/)
    const file = fileMatch ? fileMatch[0] : 'unknown file'

    if (line.includes('required')) {
      return `Missing required field in ${file}`
    } else if (line.includes('invalid')) {
      return `Invalid frontmatter in ${file}`
    } else {
      return `Content error in ${file}`
    }
  }

  /**
   * Extract TypeScript errors
   */
  extractTypeScriptError(line) {
    const tsErrorMatch = line.match(/TS\d+:/)
    const errorCode = tsErrorMatch ? tsErrorMatch[0] : ''

    const fileMatch = line.match(/[^:]+\.ts/)
    const file = fileMatch ? fileMatch[0] : 'unknown file'

    return `${errorCode} TypeScript error in ${file}`
  }

  /**
   * Extract Astro component errors
   */
  extractAstroError(line) {
    const fileMatch = line.match(/[^:]+\.astro/)
    const file = fileMatch ? fileMatch[0] : 'unknown file'

    return `Astro component error in ${file}`
  }

  /**
   * Extract markdown errors
   */
  extractMarkdownError(line) {
    const fileMatch = line.match(/[^:]+\.mdx?/)
    const file = fileMatch ? fileMatch[0] : 'unknown file'

    return `Markdown error in ${file}`
  }

  /**
   * Extract import errors
   */
  extractImportError(line) {
    const moduleMatch = line.match(/['"]([^'"]+)['"]/)
    const module = moduleMatch ? moduleMatch[1] : 'unknown module'

    return `Cannot resolve module: ${module}`
  }

  /**
   * Extract file errors
   */
  extractFileError(line) {
    const pathMatch = line.match(/['"]([^'"]+)['"]/)
    const path = pathMatch ? pathMatch[1] : 'unknown path'

    return `File not found: ${path}`
  }

  /**
   * Extract affected files from build output
   */
  extractAffectedFiles(output) {
    const files = new Set()
    const filePattern = /(?:src\/[^:\s]+\.[a-z]+)/g

    let match
    while ((match = filePattern.exec(output)) !== null) {
      files.add(match[0])
    }

    return Array.from(files)
  }

  /**
   * Add specific suggestions based on error analysis
   */
  addSpecificSuggestions(analysis) {
    switch (analysis.type) {
      case 'content_error':
        analysis.suggestions.push(
          'Validate YAML frontmatter syntax',
          'Ensure all required fields are present',
          'Check for proper indentation in frontmatter',
          'Verify date formats (YYYY-MM-DD)'
        )
        break

      case 'typescript_error':
        analysis.suggestions.push(
          'Run "npm run check:astro" for detailed type checking',
          'Check import statements and type definitions',
          'Ensure all dependencies are properly typed'
        )
        break

      case 'astro_error':
        analysis.suggestions.push(
          'Check Astro component syntax',
          'Verify frontmatter script syntax',
          'Ensure proper component imports'
        )
        break

      case 'markdown_error':
        analysis.suggestions.push(
          'Check markdown syntax',
          'Validate frontmatter YAML',
          'Ensure proper heading structure',
          'Check for unclosed code blocks'
        )
        break

      case 'import_error':
        analysis.suggestions.push(
          'Check file paths are correct',
          'Ensure imported files exist',
          'Verify npm dependencies are installed',
          'Check for typos in import statements'
        )
        break

      case 'memory_error':
        analysis.suggestions.push(
          'Increase Node.js memory: NODE_OPTIONS="--max-old-space-size=4096" npm run build',
          'Close other applications to free memory',
          'Consider building in smaller chunks'
        )
        break

      case 'file_error':
        analysis.suggestions.push(
          'Check all file paths are correct',
          'Ensure referenced images exist in public/ directory',
          'Verify all imported files are present'
        )
        break

      default:
        analysis.suggestions.push(
          'Check the full build output for more details',
          'Try running "npm run check" for additional validation',
          'Ensure all dependencies are installed with "npm install"'
        )
    }
  }

  /**
   * Display build error analysis
   */
  displayAnalysis(analysis) {
    this.logger.error('Build Analysis:')
    this.logger.info(`Error Type: ${analysis.type}`)

    if (analysis.errors.length > 0) {
      this.logger.list(analysis.errors, 'Errors Found')
    }

    if (analysis.affectedFiles.length > 0) {
      this.logger.list(analysis.affectedFiles, 'Affected Files')
    }

    if (analysis.suggestions.length > 0) {
      this.logger.list(analysis.suggestions, 'Suggested Fixes')
    }
  }
}
