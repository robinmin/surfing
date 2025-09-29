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
- **Obsidian Integration**: Native support for Obsidian markdown files

### 🔧 Enhanced Publishing

- Automated frontmatter validation and completion
- Build validation before publishing
- Git integration with smart commit messages
- HTML-to-Markdown conversion for legacy content

### 📡 Content Syndication

- Multiple RSS feeds (site-wide, articles, showcase, documents)
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
```

The CLI handles frontmatter validation, build testing, and git operations automatically.

**Option 2: Manual Publishing**

1. Create your file in the appropriate directory:
   - Articles: `src/content/articles/your-article.md`
   - Showcase: `src/content/showcase/your-project.md`
   - Documents: `src/content/documents/your-document.md`

2. Add frontmatter and content
3. Commit to git

### What content formats are supported?

- **Markdown**: Standard markdown with frontmatter
- **HTML**: Full HTML documents with custom CSS/JS
- **Obsidian**: Native support for Obsidian markdown files
- **Mixed**: HTML content within markdown files

### How do I migrate existing HTML content?

The PostSurfing CLI automatically converts HTML files:

```bash
# Auto-convert HTML to Surfing format
postsurfing ./existing-page.html --type documents --auto-convert
```

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
- [AstroWind Template](https://github.com/arthelokyo/astrowinds)
- [Add i18n features for Astro](https://docs.astro.build/en/recipes/i18n/)
