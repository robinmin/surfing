# Document Metadata Completion Prompt

Use this prompt to process markdown/HTML document files and ensure they have complete metadata according to the documents template specification.

## Your Task

Analyze the provided document file(s) and pad any missing frontmatter fields according to the documents template specification (`scripts/postsurfing/templates/documents.yaml`).

## Required Field

- **title**: Must be present (extract from HTML `<title>`, filename, or first heading if missing)

## Optional Fields to Auto-Generate

When padding metadata, intelligently generate these fields based on content analysis:

### Basic Metadata

- **description**: SEO-friendly summary (50-160 characters) of the document content
- **slug**: URL-friendly version of the title (lowercase, hyphenated)
- **publishDate**: Use current date if not specified
- **tags**: Array of relevant tags based on content keywords and topics

### Document-Specific Fields

- **category**: Choose from: `documentation`, `legacy`, `templates`, `examples`, `guides`, `references`
- **contentType**: Choose from: `page`, `snippet`, `template`, `legacy` (default: `page`)
- **preserveStyles**: Whether to preserve original styling (default: `true`)

### Content Analysis

- **wordCount**: Count all words in the document content
- **readingTime**: Calculate based on word count (avg 200-250 words/minute)
- **headings**: Extract all heading elements (h1-h6) with their text content
- **links**: Extract all links with href and text

### HTML-Specific Extraction

- **customCSS**: Extract inline `<style>` blocks or style attributes
- **customJS**: Extract inline `<script>` blocks
- **source**: Original source URL or system if applicable

### Optional Fields (Preserve if Present)

- **updateDate**: Only set if document was modified
- **draft**: Default to `false` if not specified
- **featured**: Default to `false` if not specified
- **author**: Leave empty unless specified

## HTML Conversion Settings

When processing HTML documents:

1. **extractTitle**: Extract from `<title>` tag
2. **extractMeta**: Extract from `<meta>` tags (description, keywords)
3. **extractCSS**: Extract all CSS from `<style>` tags and inline styles
4. **extractJS**: Extract all JavaScript from `<script>` tags
5. **cleanStructure**: Clean and normalize HTML structure
6. **preserveContent**: Preserve original content fidelity

## Guidelines

1. **Preserve existing fields**: Never overwrite fields that already exist
2. **Content-aware generation**: Analyze actual content for relevant metadata
3. **HTML parsing**: Extract structured data from HTML elements
4. **Consistency**: Use consistent date format (ISO 8601: YYYY-MM-DD)
5. **SEO optimization**: Ensure description is compelling and within character limits
6. **Style preservation**: Maintain original CSS/JS if `preserveStyles` is true
7. **Link tracking**: Capture all external and internal links for reference

## Output Format

Return the complete frontmatter block with all fields properly formatted:

```yaml
---
title: 'Document Title'
description: 'Concise SEO-friendly description (50-160 chars)'
slug: 'document-title'
publishDate: 2025-10-02
tags: ['documentation', 'html', 'reference']
category: 'documentation'
contentType: 'page'
preserveStyles: true
draft: false
featured: false
author: ''
source: ''
customCSS: |
  .custom-class {
    color: blue;
  }
customJS: |
  console.log('Custom script');
headings:
  - level: 1
    text: 'Main Heading'
  - level: 2
    text: 'Subheading'
links:
  - href: 'https://example.com'
    text: 'Example Link'
wordCount: 850
readingTime: 4
---
```

## Example Usage

### Example 1: HTML Document with Minimal Metadata

**Input**: HTML file with basic structure

```html
<!DOCTYPE html>
<html>
  <head>
    <title>API Reference Guide</title>
    <style>
      .code {
        font-family: monospace;
      }
    </style>
  </head>
  <body>
    <h1>API Reference Guide</h1>
    <p>Complete documentation for our REST API...</p>
  </body>
</html>
```

**Output**: Complete frontmatter with extracted and generated fields

```yaml
---
title: 'API Reference Guide'
description: 'Complete documentation for our REST API endpoints, authentication, and usage examples.'
slug: 'api-reference-guide'
publishDate: 2025-10-02
tags: ['api', 'documentation', 'reference', 'rest']
category: 'documentation'
contentType: 'page'
preserveStyles: true
draft: false
featured: false
author: ''
customCSS: |
  .code { font-family: monospace; }
headings:
  - level: 1
    text: 'API Reference Guide'
links: []
wordCount: 450
readingTime: 2
---
```

### Example 2: Legacy HTML Snippet

**Input**: HTML snippet with scripts

```html
<div class="legacy-content">
  <h2>Migration Guide</h2>
  <script>
    function showAlert() {
      alert('Legacy code');
    }
  </script>
  <p>Steps to migrate from v1 to v2...</p>
</div>
```

**Output**: Complete frontmatter with extracted content

```yaml
---
title: 'Migration Guide'
description: 'Steps to migrate from version 1 to version 2 with detailed instructions and examples.'
slug: 'migration-guide'
publishDate: 2025-10-02
tags: ['migration', 'legacy', 'guide']
category: 'guides'
contentType: 'legacy'
preserveStyles: true
draft: false
featured: false
customJS: |
  function showAlert() { alert('Legacy code'); }
headings:
  - level: 2
    text: 'Migration Guide'
wordCount: 125
readingTime: 1
---
```

## Processing Instructions

1. Read the document file content
2. Parse existing frontmatter (if any)
3. If HTML, extract:
   - Title from `<title>` or first heading
   - Meta description from `<meta name="description">`
   - All CSS from `<style>` tags
   - All JS from `<script>` tags
   - All headings (h1-h6)
   - All links with href attributes
4. Analyze content to understand topic and purpose
5. Generate missing fields intelligently
6. Calculate wordCount and readingTime
7. Preserve all existing fields
8. Return complete frontmatter block
9. Ensure all required fields are present

## Special Considerations

- **Legacy content**: Set `contentType: "legacy"` for older HTML content
- **Templates**: Set `contentType: "template"` for reusable HTML templates
- **Snippets**: Set `contentType: "snippet"` for small code examples
- **Custom styling**: Always extract CSS/JS into separate fields for maintainability
- **Link validation**: Extract both internal and external links for reference
- **Heading hierarchy**: Maintain proper heading structure in extracted data
