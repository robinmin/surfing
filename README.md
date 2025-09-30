# Surfing 🏄‍♂️

**AI-Powered Content Showcase Platform**

A modern content management and publishing platform designed specifically for AI creators, researchers, and writers who want to showcase their insights beautifully.

## 🏗️ Foundation

Surfing is built on top of:

- **[Astro](https://astro.build/)** - Modern static site generator with zero JS by default
- **[AstroWind](https://github.com/onwidget/astrowind)** - Professional template with Tailwind CSS integration
- **Enhanced with** - Custom content collections, automated workflows, and AI-optimized features

## 🚀 Features

What we've built beyond the foundation:

### 🤖 AI-First Content Workflow

- Optimized for AI-generated content publishing
- Automatic metadata extraction and processing
- Smart categorization and content discovery
- PostSurfing CLI for automated publishing

### 📝 Multi-Format Support

- **Articles**: AI insights, research, and technical content
- **Showcase**: Project portfolios with live demos and source links
- **Documents**: Full HTML content with custom CSS/JS support
- **Cheatsheets**: AI-generated reference materials with PDF support and difficulty levels
- **Obsidian Integration**: Native support for Obsidian markdown files

### 🔧 Enhanced Publishing

- Automated frontmatter validation and completion
- Build validation before publishing
- Git integration with smart commit messages
- HTML-to-Markdown conversion for legacy content

### 📡 Content Syndication

- Multiple RSS feeds (site-wide, articles, showcase, documents, cheatsheets)
- SEO optimization with structured data
- Advanced search and filtering capabilities

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

## 📝 Content Publishing FAQs

### How do I publish content?

**Option 1: PostSurfing CLI (Recommended)**

Use our automated CLI tool for the best experience:

```bash
# Publish a markdown article
postsurfing ./my-article.md --type articles

# Convert and publish HTML document
postsurfing ./legacy-page.html --type documents --auto-convert

# Interactive mode for showcase projects
postsurfing ./project.md --type showcase --interactive

 # Publish AI-generated cheatsheet
 postsurfing ./javascript-cheatsheet.md --type cheatsheets

 # Publish HTML cheatsheet
 postsurfing ./cheatsheet.html --type cheatsheets --auto-convert
```

The CLI handles frontmatter validation, build testing, and git operations automatically.

### How do I publish HTML cheatsheets with PDF generation?

For AI-generated HTML cheatsheets that need PDF versions, we have a streamlined 4-step process:

```bash
# Step 1: Preprocess - Prepare working file in /tmp
./scripts/preprocess-cheatsheets.sh your-cheatsheet.html

# Step 2: Refine with AI assistant
# Use AI assistant with prompt: docs/prompt_cheatsheets.md
# The AI will refine content and layout in /tmp, then preview with Playwright

# Step 3: Review and approve
# Review the refined HTML in the browser preview

# Step 4: Publish - Convert and publish to website
# (Auto-generates PDF if not already present)
./scripts/postprocess-cheatsheets.sh /tmp/cheatsheets-working/your-cheatsheet.html
```

**What each step does:**

**Step 1 - Preprocess:**
- ✅ Analyzes HTML structure and content
- ✅ Generates processing configuration
- ✅ Copies input file to `/tmp/cheatsheets-working/`
- ✅ Provides AI assistant instructions with full /tmp path

**Step 2 - AI Refinement:**
- ✅ Refines content quality and accuracy in /tmp
- ✅ Optimizes layout and column balancing
- ✅ Removes navigation elements
- ✅ Previews with Playwright for approval

**Step 3 - User Review:**
- ✅ Review refined HTML in browser
- ✅ Approve or iterate back to Step 2

**Step 4 - Postprocess:**
- ✅ Validates refined HTML
- ✅ Auto-generates PDF if not present
- ✅ Converts HTML to markdown with postsurfing:
  - Extracts external CSS/JS URLs → `externalCSS`, `externalJS` arrays
  - Extracts inline styles → `customCSS` frontmatter
  - Extracts inline scripts → `customJS` frontmatter
  - Extracts body content → markdown body
- ✅ Publishes to `src/content/cheatsheets/en/*.md`
- ✅ Cleans up temporary /tmp file
- ✅ Commits and publishes to website

**Key improvements:**
- 🚫 No permission interruptions (AI doesn't call external commands)
- ✅ User reviews before publishing
- ✅ Auto PDF generation (only if not already present)
- ✅ Separate working directory (/tmp) prevents accidental overwrites
- ✅ External libraries (CDN) preserved via `externalCSS`/`externalJS`
- ✅ Custom styles preserved via `customCSS`/`customJS`
- ✅ Site navigation integrated via `ExternalPageLayout`
- ✅ SEO-friendly markdown format with full styling support

**Option 2: Manual Publishing**

1. Create your file in the appropriate directory:
   - Articles: `src/content/articles/your-article.md`
   - Showcase: `src/content/showcase/your-project.md`
   - Documents: `src/content/documents/your-document.md`
   - Cheatsheets: `src/content/cheatsheets/your-cheatsheet.md`

2. Add frontmatter and content
3. Commit to git

### What content formats are supported?

- **Markdown**: Standard markdown with frontmatter
- **HTML**: Full HTML documents with custom CSS/JS
- **Obsidian**: Native support for Obsidian markdown files
- **Mixed**: HTML content within markdown files
- **AI-Enhanced**: Cheatsheets with AI metadata, PDF attachments, and difficulty levels

### How do I migrate existing HTML content?

The PostSurfing CLI automatically converts HTML files and extracts external resources:

```bash
# Auto-convert HTML to Surfing format (for documents)
postsurfing ./existing-page.html --type documents --auto-convert

# What gets extracted:
# - External CSS: <link rel="stylesheet"> → externalCSS array
# - External JS: <script src="..."> → externalJS array
# - Inline CSS: <style> → customCSS frontmatter
# - Inline JS: <script> → customJS frontmatter
# - Body content → markdown body
```

The resulting markdown will use `ExternalPageLayout` which:
- ✅ Loads external libraries from CDN
- ✅ Injects custom styles and scripts
- ✅ Integrates with site navigation
- ✅ Preserves original layout and functionality

Or see our [Content Specification Guide](./docs/content-specification.md) for manual migration steps.

### How do I unpublish content?

1. **Draft mode**: Add `draft: true` to frontmatter
2. **Delete**: Remove the file from `src/content/`
3. **Archive**: Move file outside content directories

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run check        # Type checking and linting
npm run fix          # Auto-fix formatting and lint issues
```

## 📚 Documentation

- **[Content Specification Guide](./docs/content-specification.md)** - Detailed guide for content creation, frontmatter schemas, and styling
- **[PostSurfing CLI Documentation](./docs/postsurfing-cli.md)** - Complete reference for the automated publishing tool
- **[Astro Documentation](https://docs.astro.build/)** - Official Astro framework documentation
- **[AstroWind Template](https://github.com/onwidget/astrowind)** - Base template documentation

## 🚀 Deployment

The site builds to a static `dist/` directory compatible with all major hosting platforms:

```bash
npm run build  # Creates dist/ directory
```

**Recommended Platforms:**

- **Cloudflare Pages** (recommended)
- **Netlify**
- **Vercel**
- **GitHub Pages**

All platforms support Astro with zero configuration needed.

## 🆘 Support & Troubleshooting

**Common Issues:**

- Build failures: Check Node.js version (18+ required)
- Content not appearing: Verify file location and frontmatter
- Images not loading: Place in `public/images/` and use absolute paths

**Getting Help:**

- Check the [Content Specification Guide](./docs/content-specification.md)
- Review [PostSurfing CLI docs](./docs/postsurfing-cli.md) for publishing issues
- Refer to [Astro documentation](https://docs.astro.build/) for framework questions

---

**Built with ❤️ on Astro + AstroWind foundation**

_Designed for AI researchers, content creators, and anyone who wants to showcase their insights beautifully._

## Reference

- [Astro](https://astro.build/)
- [AstroWind Template](https://github.com/arthelokyo/astrowinds)s
- [Add i18n features for Astro](https://docs.astro.build/en/recipes/i18n/)
- [Markdown & MDX](https://tanggd.github.io/en/guides/markdown-content/)
- [mdx](https://mdxjs.com/)
