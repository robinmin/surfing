---
title: 'Astro Quick Tutorial for Vue Developers'
description: "Astro is a modern web framework that focuses on content-driven websites with zero JS by default. Unlike Vue's SPA approach, Astro uses islands architecture for optimal performance."
tags: ['javascript', 'typescript', 'react', 'vue', 'angular']
readingTime: 4
wordCount: 794
publishDate: 2025-09-28
draft: false
featured: false
---

# Astro Quick Tutorial for Vue Developers

Astro is a modern web framework that focuses on **content-driven websites** with **zero JS by default**. Unlike Vue's SPA approach, Astro uses **islands architecture** for optimal performance.

## Key Differences from Vue

### 1. **Multi-framework Support**

- Use Vue, React, Svelte, or vanilla JS components
- Mix and match frameworks in the same project
- Each component is isolated

### 2. **Static-First Approach**

- Generates static HTML by default
- JavaScript only loads for interactive components
- Better SEO and performance

### 3. **File-based Routing**

- Similar to Nuxt.js
- Pages in `src/pages/` become routes
- Automatic routing configuration

## Getting Started

```bash
# Create new Astro project
npm create astro@latest my-astro-project

# Navigate to project
cd my-astro-project

# Install dependencies
npm install

# Start development server
npm run dev
```

## Component Syntax

Astro components use a frontmatter section for JavaScript and a template section for HTML:

```astro
---
// Component Script (runs on server)
const name = 'World';
const items = ['Vue', 'React', 'Astro'];
---

<!-- Component Template -->
<div>
  <h1>Hello {name}!</h1>
  <ul>
    {items.map((item) => <li>{item}</li>)}
  </ul>
</div>

<style>
  h1 {
    color: #333;
  }
</style>
```

## Using Vue Components in Astro

Install Vue integration:

```bash
npx astro add vue
```

Then use Vue components normally:

```astro
---
import MyVueComponent from '../components/MyVueComponent.vue';
---

<MyVueComponent client:load />
```

## Client Directives

Control when JavaScript loads:

- `client:load` - Load immediately
- `client:idle` - Load when page is idle
- `client:visible` - Load when component is visible
- `client:media` - Load based on media query

This makes Astro perfect for content-heavy sites that need selective interactivity!
