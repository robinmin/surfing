# Quick Setup Guide

## What These Templates Do

✅ **Automatically add frontmatter** - No manual YAML writing  
✅ **Prompt for essentials only** - Title, tags, basic info  
✅ **Clean content area** - Just write your content  
✅ **Ready to publish** - Works with PostSurfing CLI immediately

## Setup Steps

### 1. Install Quick-add Plugin

1. Obsidian Settings → Community Plugins
2. Search "Quick-add" → Install & Enable

### 2. Add Templates

1. Quick-add Settings → "Add Choice" → "Template"
2. Create 3 templates:

**📝 Article Template**

- Name: `New Article`
- Template Path: `scripts/postsurfing/templates/obsidian/articles.tpl.md`
- Folder: Your articles folder

**🚀 Showcase Template**

- Name: `New Showcase`
- Template Path: `scripts/postsurfing/templates/obsidian/showcase.tpl.md`
- Folder: Your projects folder

**📚 Document Template**

- Name: `New Document`
- Template Path: `scripts/postsurfing/templates/obsidian/documents.tpl.md`
- Folder: Your docs folder

### 3. Optional: Add Hotkeys

- Settings → Hotkeys → Search "Quick-add"
- Assign keys like `Ctrl+Shift+A` for articles

## Usage

1. **Create**: Use Quick-add (hotkey or command palette)
2. **Fill**: Answer the prompts (title, tags, etc.)
3. **Write**: Focus on your content
4. **Publish**: `postsurfing filename.md --type [articles|showcase|documents]`

## What You Get

### Articles Template

```yaml
---
title: 'Your Title'
description: 'Your description'
publishDate: 2024-01-15
tags: [your, tags]
category: 'technical'
author: 'Your Name'
draft: true
---
# Your Title

Your content here...
```

### Showcase Template

```yaml
---
title: 'Project Name'
description: 'Project description'
publishDate: 2024-01-15
projectUrl: 'https://demo.com'
githubUrl: 'https://github.com/you/project'
image: '/images/screenshot.png'
technologies: [React, TypeScript]
category: 'web-development'
tags: [react, project]
featured: false
---
# Project Name

Your project description...
```

### Documents Template

```yaml
---
title: 'Document Title'
description: 'Document description'
publishDate: 2024-01-15
tags: [documentation]
category: 'documentation'
contentType: 'page'
author: 'Your Name'
draft: true
---
# Document Title

Your documentation...
```

That's it! Simple templates that handle the boring frontmatter stuff so you can focus on writing great content.
