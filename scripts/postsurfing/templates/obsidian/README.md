# Simple Obsidian Templates for PostSurfing

Clean, minimal templates that automatically add the required frontmatter for PostSurfing CLI. Just focus on writing content!

## Templates Overview

### 📝 Articles Template (`articles.tpl.md`)
- **Purpose**: AI insights, research, and technical content
- **What it does**: Adds frontmatter, you write the content
- **Publishing**: `postsurfing filename.md --type articles`

### 🚀 Showcase Template (`showcase.tpl.md`)
- **Purpose**: Project portfolios with live demos and source links
- **What it does**: Adds frontmatter with project fields, you write the content
- **Publishing**: `postsurfing filename.md --type showcase`

### 📚 Documents Template (`documents.tpl.md`)
- **Purpose**: Documentation, legacy content, guides, and references
- **What it does**: Adds frontmatter, you write the content
- **Publishing**: `postsurfing filename.md --type documents`

## Quick Setup

### 1. Install Quick-add Plugin
1. Open Obsidian Settings → Community Plugins
2. Search for "Quick-add" and install it

### 2. Add Templates
1. Quick-add settings → "Add Choice" → "Template"
2. Set template paths to these files
3. Choose your content folders

### 3. Use Templates
- Create new content with Quick-add
- Fill in the basic info (title, tags, etc.)
- Write your content
- Publish with: `postsurfing filename.md --type [articles|showcase|documents]`

## What You Get

Each template provides:
- ✅ **Required frontmatter** - No manual YAML writing
- ✅ **Smart prompts** - Quick-add asks for the essentials
- ✅ **Clean structure** - Just title + content area
- ✅ **Ready to publish** - Works directly with PostSurfing CLI

## Template Variables

- `{{VALUE:Title}}` - Prompts for title
- `{{VALUE:tag1, tag2}}` - Prompts for tags
- `{{DATE:YYYY-MM-DD}}` - Auto-inserts today's date
- Category dropdowns for each content type

## Simple Workflow

1. **Create**: Use Quick-add to create new content
2. **Write**: Focus on your content, frontmatter is handled
3. **Publish**: `postsurfing filename.md --type [type]`

That's it! No complex setup, no metadata management.

## Example Templates

### Articles Template
```yaml
---
title: "My Article Title"
description: "Brief description"
publishDate: 2024-01-15
tags: [ai, research, technical]
category: "technical"
author: "Your Name"
draft: true
---

# My Article Title

Write your article content here...
```

### Showcase Template
```yaml
---
title: "My Project"
description: "Brief project description"
publishDate: 2024-01-15
projectUrl: "https://my-demo.com"
githubUrl: "https://github.com/me/project"
image: "/images/showcase/screenshot.png"
technologies: [React, TypeScript, Tailwind CSS]
category: "web-development"
tags: [react, typescript]
featured: false
---

# My Project

Write about your project here...
```

### Documents Template
```yaml
---
title: "My Document"
description: "Brief description"
publishDate: 2024-01-15
tags: [documentation, guide]
category: "documentation"
contentType: "page"
author: "Your Name"
draft: true
---

# My Document

Write your document content here...
```

That's it! Simple templates that handle the frontmatter so you can focus on writing great content.
