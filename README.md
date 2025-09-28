# Surfing 🏄‍♂️

**AI-Powered Content Showcase Platform**

A modern content management and publishing platform built with Astro, designed specifically for AI creators, researchers, and writers who want to showcase their insights beautifully.

## 🚀 Features

### 🤖 AI-First Design
- Optimized for AI-generated content workflows
- Automatic metadata extraction and content processing
- Smart categorization and discovery systems

### 📝 Obsidian Integration
- **Native Obsidian Support**: Drop your Obsidian markdown files directly
- **Full Frontmatter Compatibility**: Supports `aliases`, `cssclass`, `tags`, `category`
- **Preserve Your Workflow**: Keep using Obsidian exactly as you do now

### 📚 Multi-Format Content
- **Articles**: AI insights, research, and technical content
- **Showcase**: Project portfolios with live demos and source links
- **Blog Posts**: Traditional blog content with MDX support
- **HTML Documents**: Full HTML content with custom CSS/JS for legacy migration and rich applications

### 🔍 Smart Discovery
- **Advanced Search**: Real-time filtering across all content
- **Tag-Based Organization**: Automatic tag extraction and filtering
- **Category Browsing**: Organize content by topics
- **Related Content**: AI-powered content suggestions

### 📡 Content Syndication
- **Multiple RSS Feeds**: Site-wide, articles, showcase, and documents feeds
- **Rich Metadata**: Reading time, technologies, categories, and content types in feeds
- **SEO Optimized**: Structured data and meta tags for discoverability

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:4321` to see your site!

## 📝 Publishing Content

### How to Publish a Markdown File

1. **Choose the content type** and create your file in the appropriate directory:
   - **Articles**: `src/content/articles/your-article.md`
   - **Showcase**: `src/content/showcase/your-project.md`
   - **Blog Posts**: `src/content/post/your-post.md`

2. **Add frontmatter** at the top of your file:

```yaml
---
title: "Your Article Title"
description: "Brief description of your content"
publishDate: 2024-01-15
tags: [AI, research, insights]
category: "technology"
featured: true
author: "Your Name"
# Obsidian-specific (optional)
aliases: ["article-alias"]
cssclass: "custom-style"
---

# Your Content Here

Your markdown content goes here. Use standard markdown syntax.
```

3. **Save the file** - Your content appears automatically on the site!

### How to Publish HTML Documents

Surfing supports full HTML content with custom CSS and JavaScript, perfect for migrating existing HTML files, legacy content, or rich interactive documents.

#### Basic HTML Document

1. **Create your HTML file** in `src/content/documents/your-document.md`

2. **Add frontmatter** at the top:

```yaml
---
title: "Legacy Documentation"
description: "Imported documentation from previous system"
publishDate: 2024-01-15
tags: [documentation, legacy]
category: "docs"
author: "Your Name"
contentType: "legacy"  # Options: page, legacy, template, snippet
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

1. **Create your document** in `src/content/documents/your-app.md`

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
     .my-class { color: red; }
   </style>
   <script>
     console.log('Hello');
   </script>

   <!-- To frontmatter: -->
   ---
   customCSS: |
     .my-class { color: red; }
   customJS: |
     console.log('Hello');
   ---
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
    .container { padding: 20px; }
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
title: "My App"
contentType: "legacy"
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

**File Location**: `src/content/documents/your-file.md`

**Minimal Example**:
```yaml
---
title: "My HTML Document"
---
<h1>Hello World</h1>
```

**With Custom CSS/JS**:
```yaml
---
title: "Interactive Document"
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

### How to Unpublish Content

**Method 1: Draft Mode**
```yaml
---
title: "Your Article"
draft: true  # This hides the content from public view
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
contentType: enum (optional, defaults to "page")
  # Options: "page", "snippet", "template", "legacy"
author: string (optional)

# Custom styling support
customCSS: string (optional, CSS code to inject)
customJS: string (optional, JavaScript code to inject)
preserveStyles: boolean (optional, defaults to true)
  # true: maintains original styling
  # false: applies site's design system

# Auto-extracted metadata (optional)
headings: array of strings (auto-generated)
links: array of strings (auto-generated)
wordCount: number (auto-calculated)
readingTime: number (auto-calculated)
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
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    }
  }
}
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
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  }
</style>
```

### Method 4: Per-Article Custom Styling

Use Obsidian's `cssclass` frontmatter:

```yaml
---
title: "Special Article"
cssclass: "special-layout"
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

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run check        # Type checking
npm run check:watch  # Watch mode type checking
npm run lint         # Lint code
npm run format       # Format code

# Testing
npm run astro check  # Astro-specific checks
```

## 📊 Content Analytics & SEO

### RSS Feeds
- **All Content**: `https://yoursite.com/rss.xml`
- **Articles Only**: `https://yoursite.com/articles/rss.xml`
- **Showcase Only**: `https://yoursite.com/showcase/rss.xml`

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

## 🏗️ Project Structure

```
src/
├── content/               # All your content
│   ├── articles/          # Obsidian markdown files
│   ├── showcase/          # Project portfolios
│   ├── post/              # Blog posts
│   ├── documents/         # HTML content
│   └── config.ts          # Content schemas
├── pages/                 # Site pages
│   ├── index.astro        # Homepage
│   ├── browse.astro       # Content browser
│   ├── articles/          # Article pages & RSS
│   ├── showcase/          # Showcase pages & RSS
│   └── rss.xml.ts         # Main RSS feed
├── components/            # Reusable UI components
├── layouts/               # Page layouts
├── utils/                 # Helper functions
│   ├── content.ts         # Content utilities
│   └── metadata-extractor.ts # Auto-metadata
├── styles/                # Global styles
└── navigation.ts          # Site navigation

public/                    # Static assets
├── images/                # Your images
└── favicon.ico            # Site favicon
```

## 🚀 Deployment

### Build Configuration

The site builds to the `dist/` directory:

```bash
npm run build
# Output: dist/ directory ready for deployment
```

### Deployment Platforms

**Cloudflare Pages:**
- Build command: `npm run build`
- Publish directory: `dist`
- Framework preset: Astro

**Netlify:**
- Build command: `npm run build`
- Publish directory: `dist`
- Framework preset: Astro

**Vercel:**
- Import your repository
- Framework preset: Astro
- No additional configuration needed

**GitHub Pages:**
- Use the official Astro GitHub Pages action
- Configure in `.github/workflows/deploy.yml`

### Environment Variables (if needed)

Create `.env` file for local development:
```env
PUBLIC_SITE_URL=http://localhost:4321
# Add other environment variables as needed
```

## 🛠️ Extending the Platform

### Adding New Content Types

1. **Define schema** in `src/content/config.ts`:
```typescript
const tutorials = defineCollection({
  loader: glob({ pattern: ['*.md'], base: 'src/content/tutorials' }),
  schema: z.object({
    title: z.string(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    // Add your custom fields
  }),
});
```

2. **Create directory**: `src/content/tutorials/`
3. **Add pages**: Create `src/pages/tutorials/` with index and detail pages

### Custom Components

Create reusable components in `src/components/`:

```astro
---
// src/components/CustomCallout.astro
export interface Props {
  type: 'info' | 'warning' | 'error';
  title: string;
}

const { type, title } = Astro.props;
---

<div class={`callout callout-${type}`}>
  <h4>{title}</h4>
  <slot />
</div>

<style>
  .callout {
    padding: 1rem;
    border-radius: 8px;
    margin: 1rem 0;
  }
  .callout-info { @apply bg-blue-50 border-blue-200; }
  .callout-warning { @apply bg-yellow-50 border-yellow-200; }
  .callout-error { @apply bg-red-50 border-red-200; }
</style>
```

Use in your markdown with MDX:
```mdx
import CustomCallout from '../../components/CustomCallout.astro';

<CustomCallout type="info" title="Pro Tip">
This is a custom callout component!
</CustomCallout>
```

## 📞 Support & Troubleshooting

### Common Issues

**Build failures:**
- Check Node.js version (18+ required)
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Verify all frontmatter syntax is valid YAML

**Content not appearing:**
- Check file is in correct `src/content/` subdirectory
- Verify frontmatter is properly formatted
- Ensure `draft: true` is not set

**Images not loading:**
- Place images in `public/images/`
- Reference with absolute path: `/images/filename.jpg`
- Check file extensions match exactly

### Performance Tips

- Optimize images before adding to `public/images/`
- Use WebP format when possible
- Keep markdown files under 100KB for best performance
- Use external links for large files/videos

---

**Built with ❤️ using Astro, Tailwind CSS, and modern web technologies.**

*Perfect for AI researchers, content creators, and anyone who wants to showcase their insights beautifully.*