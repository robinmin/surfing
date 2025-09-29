# PostSurfing CLI Tool

A comprehensive command-line tool for automated content publishing to the Surfing platform. Handles markdown files, HTML documents, and provides automated publishing workflow with frontmatter validation, build testing, and git integration.

## Features

- **Multi-format Support**: Articles (Markdown), Showcase projects, HTML documents
- **Internationalization (i18n)**: Multi-language content support with automatic directory organization
- **Intelligent Processing**: Auto-detects content type and extracts metadata
- **HTML Conversion**: Converts full HTML documents to Surfing format
- **Frontmatter Management**: Validates and auto-completes frontmatter fields
- **Build Validation**: Tests that content builds successfully before publishing
- **Git Integration**: Automated commit and push workflow
- **Error Handling**: Comprehensive error analysis and suggestions

## Installation

The tool is designed to run locally within the Surfing project:

```bash
# Make the CLI executable
chmod +x scripts/postsurfing/postsurfing.mjs

# Create a shell alias for convenience (add to your ~/.bashrc or ~/.zshrc)
alias postsurfing="node /path/to/surfing/scripts/postsurfing/postsurfing.mjs"

# Or use the wrapper script
alias postsurfing="/path/to/surfing/scripts/postsurfing/postsurfing.sh"
```

## Usage

### Basic Syntax

```bash
postsurfing <file-path> --type <content-type> [--lang <language>] [options]
```

### Content Types

- `articles` - AI insights, research, and technical content
- `showcase` - Project portfolios with live demos and source links
- `documents` - HTML content for legacy or rich-formatted pieces

### Supported Languages

- `en` - English (default)
- `cn` - Chinese (Simplified)
- `jp` - Japanese

Content is automatically organized into language-specific subdirectories: `src/content/{type}/{lang}/`

### Examples

```bash
# Publish a markdown article (English by default)
postsurfing ./my-article.md --type articles

# Publish content in Chinese
postsurfing ./my-article.md --type articles --lang cn

# Publish content in Japanese
postsurfing ./my-article.md --type articles --lang jp

# Convert and publish HTML document
postsurfing ./legacy-page.html --type documents --auto-convert

# Interactive mode for showcase project
postsurfing ./project.md --type showcase --interactive

# Dry run to preview changes
postsurfing ./content.md --type articles --dry-run

# Skip build validation and git operations
postsurfing ./content.md --type articles --no-build --no-commit
```

## Internationalization (i18n)

The PostSurfing CLI supports multi-language content publishing with automatic directory organization.

### Language-Specific Content Organization

Content is automatically placed in language-specific subdirectories:

```
src/content/
├── articles/
│   ├── en/           # English articles
│   ├── cn/           # Chinese articles
│   └── jp/           # Japanese articles
├── showcase/
│   ├── en/           # English showcase projects
│   ├── cn/           # Chinese showcase projects
│   └── jp/           # Japanese showcase projects
└── documents/
    ├── en/           # English documents
    ├── cn/           # Chinese documents
    └── jp/           # Japanese documents
```

### Language Validation

- **Default Language**: English (`en`) if no language is specified
- **Supported Languages**: `en`, `cn`, `jp`
- **Invalid Languages**: Automatically defaults to `en` with a warning

### Usage Examples

```bash
# Publish English content (default)
postsurfing ./article.md --type articles

# Explicitly specify English
postsurfing ./article.md --type articles --lang en

# Publish Chinese content
postsurfing ./article.md --type articles --lang cn

# Publish Japanese content
postsurfing ./article.md --type articles --lang jp

# Invalid language defaults to English
postsurfing ./article.md --type articles --lang fr  # → Uses 'en' with warning
```

### File Output Examples

```bash
# English article
postsurfing ./my-article.md --type articles --lang en
# Output: src/content/articles/en/my-article.md

# Chinese showcase
postsurfing ./project.md --type showcase --lang cn
# Output: src/content/showcase/cn/project.md

# Japanese document
postsurfing ./doc.html --type documents --lang jp
# Output: src/content/documents/jp/doc.md
```

### Options

- `-t, --type <type>` - Content type (required): articles, showcase, documents
- `-l, --lang <lang>` - Content language (default: en): en, cn, jp
- `-i, --interactive` - Prompt for missing required fields
- `--auto-convert` - Auto-convert HTML files to Surfing format
- `--dry-run` - Preview changes without applying them
- `--no-build` - Skip build validation step
- `--no-commit` - Skip git commit and push
- `--commit-message <msg>` - Custom commit message
- `-v, --verbose` - Enable detailed logging
- `-h, --help` - Show help message

## HTML Document Processing

The tool automatically converts HTML documents following the migration guide:

### Full HTML Documents

For complete HTML files with `<html>`, `<head>`, and `<body>` tags:

1. **Extracts metadata** from `<title>` and `<meta>` tags
2. **Moves CSS** from `<style>` tags to `customCSS` frontmatter
3. **Moves JavaScript** from `<script>` tags to `customJS` frontmatter
4. **Preserves content** from `<body>` while removing structure tags
5. **Generates frontmatter** with extracted metadata

### HTML Fragments

For HTML snippets without full document structure:

1. **Extracts inline styles** and scripts
2. **Preserves HTML structure**
3. **Minimal processing** to maintain content integrity

### Example Conversion

**Input HTML:**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Document</title>
    <meta name="description" content="A test document" />
    <style>
      .highlight {
        background: yellow;
      }
    </style>
  </head>
  <body>
    <h1>My Document</h1>
    <p class="highlight">Content here</p>
    <script>
      console.log('Loaded');
    </script>
  </body>
</html>
```

**Output Markdown:**

```yaml
---
title: 'My Document'
description: 'A test document'
contentType: 'page'
preserveStyles: true
customCSS: |
  .highlight { background: yellow; }
customJS: |
  console.log('Loaded');
---
<h1>My Document</h1>
<p class="highlight">Content here</p>
```

## Frontmatter Management

### Auto-completion

The tool automatically generates missing fields:

- `publishDate` → Current date
- `slug` → Generated from title
- `tags` → Suggested from content analysis
- `readingTime` → Calculated from word count
- `wordCount` → Calculated from content

### Validation

Validates frontmatter against content type schemas:

- **Articles**: Requires `title`
- **Showcase**: Requires `title`, `description`, `publishDate`, `image`
- **Documents**: Requires `title`

### Interactive Mode

Use `--interactive` to prompt for missing required fields:

```bash
postsurfing ./content.md --type showcase --interactive
```

## Build Validation

The tool runs `npm run build` to ensure content doesn't break the site:

### Error Analysis

Provides detailed analysis of build failures:

- **Content errors**: Frontmatter validation issues
- **TypeScript errors**: Type checking problems
- **Astro errors**: Component syntax issues
- **Import errors**: Missing modules or files

### Error Suggestions

Offers actionable suggestions for common issues:

- Missing required frontmatter fields
- Invalid YAML syntax
- Broken import paths
- Memory issues

## Git Integration

Automated git workflow:

1. **Adds the processed file** to git staging
2. **Commits with descriptive message** (auto-generated or custom)
3. **Pushes to remote repository**

### Smart Commit Messages

Auto-generates commit messages based on content:

```
Add article: "My Article Title"
Add showcase: "My Project Name"
Add document: "Legacy Documentation"
```

### Error Handling

Handles common git issues:

- No git repository
- No remote configured
- Authentication failures
- Push conflicts

## Testing

Run the comprehensive test suite:

```bash
# Run all tests
node tests/postsurfing/test-runner.mjs

# Run specific test categories
node tests/postsurfing/unit/content-processor.test.mjs
node tests/postsurfing/integration/cli-basic.test.mjs
```

### Test Coverage

- **Unit Tests**: Individual component functionality
- **Integration Tests**: End-to-end workflow testing
- **Fixtures**: Sample content for testing scenarios

## Architecture

```
scripts/postsurfing/
├── postsurfing.mjs           # Main CLI entry point
├── postsurfing.sh            # Shell wrapper script
├── lib/
│   ├── content-processor.mjs # Content analysis & transformation
│   ├── frontmatter-manager.mjs # Frontmatter validation & completion
│   ├── html-converter.mjs    # HTML to Surfing format conversion
│   ├── git-manager.mjs       # Git operations
│   ├── build-validator.mjs   # Build testing & validation
│   └── logger.mjs           # Logging & error handling
└── templates/               # Frontmatter templates
    ├── articles.yaml
    ├── showcase.yaml
    └── documents.yaml

Content Organization:
src/content/
├── articles/                 # Article content
│   ├── en/                   # English articles
│   ├── cn/                   # Chinese articles
│   └── jp/                   # Japanese articles
├── showcase/                 # Showcase projects
│   ├── en/                   # English showcase
│   ├── cn/                   # Chinese showcase
│   └── jp/                   # Japanese showcase
└── documents/                # HTML documents
    ├── en/                   # English documents
    ├── cn/                   # Chinese documents
    └── jp/                   # Japanese documents
```

## Error Handling

The tool provides comprehensive error handling with:

- **Detailed error messages** with context
- **Actionable suggestions** for fixes
- **Graceful degradation** for non-critical failures
- **Verbose logging** for debugging

## Contributing

To extend the tool:

1. **Add new content types** by creating templates in `templates/`
2. **Extend processors** in the `lib/` directory
3. **Add tests** for new functionality
4. **Update documentation** for new features

## License

Part of the Surfing project. See main project license.
