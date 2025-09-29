# Content Specification Guide

This document provides comprehensive guidelines for creating and managing content in the Surfing platform.

## 📝 Publishing Content

### How to Publish a Markdown File

1. **Choose the content type and language** and create your file in the appropriate directory:
   - **Articles**: `src/content/articles/{lang}/your-article.md`
   - **Showcase**: `src/content/showcase/{lang}/your-project.md`
   - **Documents**: `src/content/documents/{lang}/your-document.md`
   - **Cheatsheets**: `src/content/cheatsheets/{lang}/your-cheatsheet.md`

   **Supported Languages:**
   - `en` - English
   - `cn` - Chinese (Simplified)
   - `jp` - Japanese

2. **Add frontmatter** at the top of your file:

```yaml
---
title: 'Your Article Title'
description: 'Brief description of your content'
publishDate: 2024-01-15
tags: [AI, research, insights]
category: 'technology'
featured: true
author: 'Your Name'
# Obsidian-specific (optional)
aliases: ['article-alias']
cssclass: 'custom-style'
---
# Your Content Here

Your markdown content goes here. Use standard markdown syntax.
```

3. **Save the file** - Your content appears automatically on the site!

## 🌍 Internationalization (i18n)

Surfing supports multi-language content with automatic organization into language-specific directories.

### Content Organization Structure

```
src/content/
├── articles/
│   ├── en/           # English articles
│   │   ├── ai-research.md
│   │   └── tutorial.md
│   ├── cn/           # Chinese articles
│   │   ├── ai-research.md
│   │   └── tutorial.md
│   └── jp/           # Japanese articles
│       ├── ai-research.md
│       └── tutorial.md
├── showcase/
│   ├── en/           # English showcase projects
│   ├── cn/           # Chinese showcase projects
│   └── jp/           # Japanese showcase projects
├── documents/
│   ├── en/           # English documents
│   ├── cn/           # Chinese documents
│   └── jp/           # Japanese documents
└── cheatsheets/
    ├── en/           # English cheatsheets
    ├── cn/           # Chinese cheatsheets
    └── jp/           # Japanese cheatsheets
```

### Language-Specific URLs

Content is accessible via language-specific URLs:

- English: `/articles/en/ai-research`, `/cheatsheets/en/javascript-guide`
- Chinese: `/articles/cn/ai-research`, `/cheatsheets/cn/javascript-guide`
- Japanese: `/articles/jp/ai-research`, `/cheatsheets/jp/javascript-guide`

### Publishing Multi-Language Content

Use the PostSurfing CLI with the `--lang` parameter:

```bash
# Publish English content
postsurfing ./article.md --type articles --lang en

# Publish Chinese content
postsurfing ./article.md --type articles --lang cn

# Publish Japanese content
postsurfing ./article.md --type articles --lang jp
```

### Language Detection

- **Default Language**: English (`en`) if not specified
- **Supported Languages**: `en`, `cn`, `jp`
- **Invalid Languages**: Automatically defaults to `en`

### How to Publish HTML Documents

Surfing supports full HTML content with custom CSS and JavaScript, perfect for migrating existing HTML files, legacy content, or rich interactive documents.

#### Basic HTML Document

1. **Create your HTML file** in `src/content/documents/{lang}/your-document.md`

2. **Add frontmatter** at the top:

```yaml
---
title: 'Legacy Documentation'
description: 'Imported documentation from previous system'
publishDate: 2024-01-15
tags: [documentation, legacy]
category: 'docs'
author: 'Your Name'
contentType: 'legacy' # Options: page, legacy, template, snippet
---
<h1>Your HTML Content</h1>
<p>Any existing HTML content works here.</p>
<div class="custom-styling">
<!-- Rich HTML formatting -->
</div>
```

3. **Save and refresh** - Your HTML content is now live!

#### Full HTML with Custom CSS and JavaScript

For complete HTML applications with custom styling and interactivity:

1. **Create your document** in `src/content/documents/{lang}/your-app.md`

2. **Add comprehensive frontmatter**:

```yaml
---
title: "Interactive HTML Application"
description: "Full HTML content with custom CSS and JavaScript"
publishDate: 2024-01-15
tags: [html, css, javascript, interactive]
category: "applications"
author: "Your Name"
contentType: "page"
featured: true
preserveStyles: true  # Maintains your original styling

# Custom CSS - moved from <style> tags
customCSS: |
  .app-container {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem;
    border-radius: 12px;
    margin: 2rem 0;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  }

  .interactive-button {
    background: #3b82f6;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .interactive-button:hover {
    background: #2563eb;
  }

  @media (prefers-color-scheme: dark) {
    .app-container {
      border: 1px solid #374151;
    }
  }

# Custom JavaScript - moved from <script> tags
customJS: |
  document.addEventListener('DOMContentLoaded', function() {
    // Interactive functionality
    const buttons = document.querySelectorAll('.interactive-button');
    buttons.forEach(button => {
      button.addEventListener('click', function() {
        this.textContent = this.textContent === 'Clicked!' ? 'Click me!' : 'Clicked!';
      });
    });

    // Dynamic content
    const timestampEl = document.getElementById('current-time');
    if (timestampEl) {
      timestampEl.textContent = new Date().toLocaleString();
    }

    // Custom animations
    const container = document.querySelector('.app-container');
    if (container) {
      container.style.opacity = '0';
      container.style.transform = 'translateY(20px)';
      setTimeout(() => {
        container.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
      }, 100);
    }
  });
---

<div class="app-container">
  <h2>🚀 Interactive HTML Application</h2>
  <p>This demonstrates full HTML content with custom CSS and JavaScript preserved exactly as written.</p>

  <button class="interactive-button">Click me!</button>

  <p>Current time: <strong id="current-time">Loading...</strong></p>

  <div class="feature-grid">
    <div class="feature-card">
      <h4>✨ Custom Styling</h4>
      <p>Your existing CSS is preserved and scoped properly.</p>
    </div>
    <div class="feature-card">
      <h4>⚡ JavaScript Support</h4>
      <p>Interactive elements work perfectly within Astro.</p>
    </div>
  </div>
</div>
```

3. **Your content is now live** with full interactivity and custom styling!

#### Migration Tips for Existing HTML

**Converting Full HTML Files:**

1. **Extract CSS and JavaScript**:

   ```html
   <!-- From this: -->
   <style>
     .my-class {
       color: red;
     }
   </style>
   <script>
     console.log('Hello');
   </script>

   <!-- To frontmatter: -->
   --- customCSS: | .my-class { color: red; } customJS: | console.log('Hello'); ---
   ```

2. **Handle Complex HTML Structure**:
   - Remove `<html>`, `<head>`, and `<body>` tags
   - Keep only the content inside `<body>`
   - Move `<meta>` tags to frontmatter fields
   - Extract `<title>` to frontmatter `title` field

3. **Content Type Guidelines**:
   - `page` - Standard HTML documents
   - `legacy` - Migrated content from other systems
   - `template` - Reusable HTML templates
   - `snippet` - Code examples or partial content

4. **Styling Preservation**:

   ```yaml
   preserveStyles: true   # Maintains original appearance
   preserveStyles: false  # Applies site's design system
   ```

5. **File Extension**:
   - Use `.md` extension for better Astro compatibility
   - HTML content works perfectly in `.md` files

**Example Migration:**

```html
<!-- Original HTML file -->
<!DOCTYPE html>
<html>
  <head>
    <title>My App</title>
    <style>
      .container {
        padding: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Hello World</h1>
    </div>
    <script>
      alert('Loaded!');
    </script>
  </body>
</html>
```

```yaml
<!-- Migrated to documents/my-app.md -->
---
title: 'My App'
contentType: 'legacy'
preserveStyles: true
customCSS: |
  .container { padding: 20px; }
customJS: |
  alert('Loaded!');
---
<div class="container">
<h1>Hello World</h1>
</div>
```

#### Document Discovery

Your HTML documents automatically appear in:

- **Documents page**: `/documents`
- **Browse page**: `/browse` (with "Document" badge)
- **RSS feeds**: `/documents/rss.xml` and `/rss.xml`
- **Site navigation**: Header and footer menus

#### Quick Reference

**File Location**: `src/content/documents/{lang}/your-file.md`

**Minimal Example**:

```yaml
---
title: 'My HTML Document'
---
<h1>Hello World</h1>
```

**With Custom CSS/JS**:

```yaml
---
title: 'Interactive Document'
customCSS: |
  .highlight { background: yellow; }
customJS: |
  console.log('Document loaded!');
---
<div class="highlight">Styled content</div>
```

**Content Types**:

- `page` - Standard documents
- `legacy` - Migrated content
- `template` - Reusable templates
- `snippet` - Code examples

### How to Publish AI-Generated Cheatsheets

Surfing supports comprehensive cheatsheets with AI-specific metadata, perfect for quick reference guides, programming references, and technical documentation generated by AI tools.

#### Basic Cheatsheet

1. **Create your cheatsheet file** in `src/content/cheatsheets/{lang}/your-cheatsheet.md`

2. **Add comprehensive frontmatter**:

```yaml
---
title: "JavaScript ES6+ Quick Reference"
description: "Essential JavaScript ES6+ features and syntax for modern web development"
publishDate: 2024-01-15
tags: [javascript, es6, programming, reference]
category: "Programming Languages"

# Cheatsheet-specific fields
topic: "JavaScript"                    # Main topic or technology
difficulty: "intermediate"             # beginner, intermediate, advanced
format: "markdown"                     # html or markdown

# AI generation metadata
generatedBy: "GPT-4"                   # AI model used
prompt: "Create a comprehensive JavaScript ES6+ cheatsheet"  # Optional
version: "v1.0"                        # Version of the cheatsheet

# File attachments (optional)
pdfUrl: "/downloads/javascript-cheatsheet.pdf"    # Generated PDF version
downloadUrl: "/downloads/javascript-cheatsheet-complete.zip"  # Download package

# Standard fields
author: "AI Assistant"
featured: true
draft: false
---

# JavaScript ES6+ Quick Reference

Your cheatsheet content goes here with code examples, explanations, and reference materials.

## Variables and Declarations

\`\`\`javascript
const constant = "immutable";
let mutable = "can change";
\`\`\`

## Arrow Functions

\`\`\`javascript
const add = (a, b) => a + b;
\`\`\`
```

3. **Your cheatsheet is now live** with AI-specific metadata and downloadable formats!

#### HTML-Based Interactive Cheatsheets

For rich interactive cheatsheets with custom styling:

```yaml
---
title: 'CSS Grid Interactive Guide'
description: 'Interactive CSS Grid cheatsheet with live examples'
topic: 'CSS'
difficulty: 'intermediate'
format: 'html'
generatedBy: 'Claude-3'
featured: true

# Custom styling for interactive elements
customCSS: |
  .grid-example {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    padding: 1rem;
    border: 2px solid #3b82f6;
    margin: 1rem 0;
  }

  .grid-item {
    background: #dbeafe;
    padding: 1rem;
    text-align: center;
    border-radius: 4px;
  }

customJS: |
  // Interactive examples
  document.addEventListener('DOMContentLoaded', function() {
    const examples = document.querySelectorAll('.grid-example');
    examples.forEach(example => {
      example.addEventListener('click', function() {
        this.classList.toggle('active');
      });
    });
  });
---
<div class="grid-example">
<div class="grid-item">1</div>
<div class="grid-item">2</div>
<div class="grid-item">3</div>
</div>
```

#### Cheatsheet Discovery

Your cheatsheets automatically appear in:

- **Cheatsheets page**: `/cheatsheets`
- **Browse page**: `/browse` (with "Cheatsheet" badge and difficulty level)
- **RSS feeds**: `/cheatsheets/rss.xml` and `/rss.xml`
- **Site navigation**: Header and footer menus

#### PDF Generation Integration

For cheatsheets with PDF versions:

1. **Generate PDF** from your HTML/Markdown content
2. **Place PDF** in `public/downloads/` directory
3. **Reference in frontmatter**: `pdfUrl: "/downloads/my-cheatsheet.pdf"`
4. **Download link** appears automatically on the cheatsheet page

#### Cheatsheet Frontmatter Schema

```yaml
---
# Required fields
title: string (required)

# Optional basic fields
description: string (optional)
publishDate: date (optional, defaults to file creation)
tags: array of strings (optional)
category: string (optional)
draft: boolean (optional, defaults to false)
featured: boolean (optional, defaults to false)

# Cheatsheet-specific fields
topic: string (optional) # Main subject (e.g., "JavaScript", "Docker")
difficulty: enum (optional) # beginner, intermediate, advanced
format: enum (optional, defaults to "html") # html, markdown

# File attachments
pdfUrl: string (optional) # URL to generated PDF version
downloadUrl: string (optional) # Direct download link for resources

# AI generation metadata
generatedBy: string (optional) # AI model used (e.g., "GPT-4", "Claude")
prompt: string (optional) # Original prompt used for generation
version: string (optional) # Version of the cheatsheet

# Content metadata (auto-calculated)
author: string (optional)
wordCount: number (auto-calculated)
readingTime: number (auto-calculated)
---
```

#### Migration from Existing Cheatsheets

**Converting PDF/Image Cheatsheets:**

1. Extract text content or recreate in Markdown/HTML
2. Add interactive elements if desired
3. Link to original PDF in `pdfUrl` field
4. Use appropriate tags for discoverability

**From Other Platforms:**

1. Copy content structure
2. Add AI-specific metadata if generated by AI
3. Enhance with interactivity using custom CSS/JS
4. Organize by topic and difficulty level

### How to Unpublish Content

**Method 1: Draft Mode**

```yaml
---
title: 'Your Article'
draft: true # This hides the content from public view
---
```

**Method 2: Delete File**
Simply delete the markdown/HTML file from the content directory.

**Method 3: Move to Private**
Move the file outside of `src/content/` directories (e.g., to a `_drafts/` folder).

## 📄 Markdown Specifications

### Supported Markdown Features

**Standard Markdown:**

- Headers (`# ## ### #### ##### ######`)
- Bold (`**text**`) and italic (`*text*`)
- Lists (ordered and unordered)
- Links (`[text](url)`) and images (`![alt](src)`)
- Code blocks and inline code
- Blockquotes (`> text`)
- Tables
- Horizontal rules (`---`)

**Extended Features (MDX):**

- **Astro Components**: Use custom components in markdown
- **JSX-like syntax**: `<Component prop="value" />`
- **Import statements**: `import MyComponent from '../components/MyComponent.astro'`

**Obsidian-Compatible Features:**

- **Internal links**: `[[Link to other note]]`
- **Tags**: `#tag` in content body
- **Aliases**: Use in frontmatter for alternative titles
- **CSS classes**: Apply custom styling via `cssclass` frontmatter

### Frontmatter Schema

**Articles/Posts:**

```yaml
---
title: string (required)
description: string (optional, auto-generated if missing)
publishDate: date (optional, defaults to file creation)
updateDate: date (optional)
tags: array of strings (optional)
category: string (optional)
featured: boolean (optional, defaults to false)
draft: boolean (optional, defaults to false)
author: string (optional)
image: string (optional, path to image)
excerpt: string (optional, auto-generated if missing)
readingTime: number (optional, auto-calculated)
# Obsidian-specific
aliases: array of strings (optional)
cssclass: string (optional)
---
```

**Showcase Projects:**

```yaml
---
title: string (required)
description: string (required)
publishDate: date (optional)
projectUrl: string (optional, live demo URL)
githubUrl: string (optional, source code URL)
image: string (optional, screenshot/logo)
technologies: array of strings (optional)
featured: boolean (optional)
category: string (optional)
tags: array of strings (optional)
author: string (optional)
---
```

**HTML Documents:**

```yaml
---
title: string (required)
description: string (optional)
slug: string (optional, auto-generated from filename)
publishDate: date (optional)
updateDate: date (optional)

# Content organization
tags: array of strings (optional)
category: string (optional)

# Status tracking
draft: boolean (optional, defaults to false)
featured: boolean (optional, defaults to false)

# Document-specific fields
source: string (optional, original source URL/system)
contentType:
  enum (optional, defaults to "page")
  # Options: "page", "snippet", "template", "legacy"
author: string (optional)

# Custom styling support
customCSS: string (optional, CSS code to inject)
customJS: string (optional, JavaScript code to inject)
preserveStyles:
  boolean (optional, defaults to true)
  # true: maintains original styling
  # false: applies site's design system

# Auto-extracted metadata (optional)
headings: array of strings (auto-generated)
links: array of strings (auto-generated)
wordCount: number (auto-calculated)
readingTime: number (auto-calculated)
---
```

**AI-Generated Cheatsheets:**

```yaml
---
# Required fields
title: string (required)

# Optional basic fields
description: string (optional)
publishDate: date (optional, defaults to file creation)
tags: array of strings (optional)
category: string (optional)
draft: boolean (optional, defaults to false)
featured: boolean (optional, defaults to false)

# Cheatsheet-specific fields
topic: string (optional) # Main subject (e.g., "JavaScript", "Docker")
difficulty: enum (optional) # beginner, intermediate, advanced
format: enum (optional, defaults to "html") # html, markdown

# File attachments
pdfUrl: string (optional) # URL to generated PDF version
downloadUrl: string (optional) # Direct download link for resources

# AI generation metadata
generatedBy: string (optional) # AI model used (e.g., "GPT-4", "Claude")
prompt: string (optional) # Original prompt used for generation
version: string (optional) # Version of the cheatsheet

# Content metadata (auto-calculated)
author: string (optional)
wordCount: number (auto-calculated)
readingTime: number (auto-calculated)

# Custom styling support (for HTML format)
customCSS: string (optional, CSS code to inject)
customJS: string (optional, JavaScript code to inject)
preserveStyles: boolean (optional, defaults to true)
---
```

## 🎨 Customizing Styles

### Method 1: Global CSS Changes

Edit `src/styles/base.css` for site-wide changes:

```css
/* Custom global styles */
.prose {
  /* Override article text styling */
  @apply text-gray-800 dark:text-gray-200;
}

/* Add custom classes */
.highlight-box {
  @apply bg-yellow-100 border-l-4 border-yellow-500 p-4 my-4;
}
```

### Method 2: Tailwind Configuration

Modify `tailwind.config.js` to change the design system:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
```

### Method 3: Component-Level Styling

Edit individual `.astro` files in `src/components/` and `src/pages/`:

```astro
---
// Component logic
---

<div class="custom-component bg-gradient-to-r from-blue-500 to-purple-600">
  <h2 class="text-2xl font-bold text-white">Custom Styled Component</h2>
</div>

<style>
  .custom-component {
    /* Scoped CSS that only applies to this component */
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
</style>
```

### Method 4: Per-Article Custom Styling

Use Obsidian's `cssclass` frontmatter:

```yaml
---
title: 'Special Article'
cssclass: 'special-layout'
---
```

Then add CSS for that class in `src/styles/base.css`:

```css
.special-layout {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
}
```

### Color Themes

The site supports automatic dark/light mode. Customize colors:

```css
/* Light mode */
:root {
  --color-primary: #3b82f6;
  --color-background: #ffffff;
  --color-text: #1f2937;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: #60a5fa;
    --color-background: #111827;
    --color-text: #f9fafb;
  }
}
```

## 🎯 Content Management Workflows

### Daily Publishing Workflow

1. **Write content** in Obsidian or your preferred markdown editor
2. **Copy/move files** to the appropriate `src/content/` directory
3. **Commit changes** to your Git repository
4. **Automatic deployment** happens via your hosting platform

### Bulk Content Migration

```bash
# Move all articles from Obsidian vault
cp ~/obsidian-vault/articles/*.md src/content/articles/

# Process and clean up frontmatter if needed
# Then commit all changes
git add src/content/
git commit -m "Add new articles from Obsidian"
```

### Content Organization Best Practices

**File Naming:**

- Use descriptive names: `ai-breakthrough-2024.md`
- Include dates for time-sensitive content: `2024-01-15-market-analysis.md`
- Use hyphens instead of spaces

**Tag Strategy:**

- **Categories**: Broad topics (`technology`, `ai`, `research`)
- **Tags**: Specific concepts (`machine-learning`, `gpt`, `automation`)
- **Keep consistent**: Create a tag taxonomy document

**Featured Content:**

- Mark your best content as `featured: true`
- Featured items appear prominently on homepage and category pages

### Image Management

1. **Place images** in `public/images/`
2. **Reference in markdown**: `![Alt text](/images/filename.jpg)`
3. **Optimize for web**: Use appropriate sizes and formats
4. **For showcase projects**: Include screenshots and logos

## 📊 Content Analytics & SEO

### RSS Feeds

- **All Content**: `https://yoursite.com/rss.xml`
- **Articles Only**: `https://yoursite.com/articles/rss.xml`
- **Showcase Only**: `https://yoursite.com/showcase/rss.xml`
- **Documents Only**: `https://yoursite.com/documents/rss.xml`
- **Cheatsheets Only**: `https://yoursite.com/cheatsheets/rss.xml`

### SEO Features (Automatic)

- Meta tags and Open Graph
- Structured data for articles
- Automatic sitemap generation
- RSS feed discovery
- Reading time calculation
- Content excerpts

### Performance Optimizations

- Static site generation (SSG)
- Automatic image optimization
- Code splitting
- Minimal JavaScript bundle
- CDN-ready output
