---
title: 'Astro Quick Tutorial for Vue Developers'
description: "Astro is a modern web framework that focuses on **content-driven websites** with **zero JS by default**. Unlike Vue's SPA approach, Astro uses **islands archite"
tags: ['Astro', 'frontend', 'web development', 'tutorial', 'Vue']
readingTime: 4
wordCount: 794
publishDate: 2025-09-29
draft: false
featured: true
image: '@assets/images/astro_logo.png'
---

## What is Astro?

Astro is a modern web framework that focuses on **content-driven websites** with **zero JS by default**. Unlike Vue's SPA approach, Astro uses **islands architecture** - you ship HTML/CSS by default and add JavaScript only where needed.

## Key Concepts Coming from Vue

### 1. Component Structure

```astro
---
// Component Script (runs at build time)
const title = 'Hello World';
const items = ['Vue', 'React', 'Svelte'];
---

<!-- Template (similar to Vue template) -->
<h1>{title}</h1>
<ul>
  {items.map((item) => <li>{item}</li>)}
</ul>

<style>
  h1 {
    color: blue;
  }
</style>
```

**Key Differences from Vue:**

- **Frontmatter**: Code between `---` runs at build time (server-side)
- **JSX-like syntax**: Use `{}` instead of `{{ }}` for expressions
- **No reactivity by default**: Variables are static unless you add client-side JS

### 2. File-based Routing

```
src/pages/
├── index.astro          → /
├── about.astro          → /about
├── blog/
│   ├── index.astro      → /blog
│   └── [slug].astro     → /blog/hello-world
└── api/
    └── posts.json.js    → /api/posts.json
```

### 3. Layouts (Similar to Vue Router layouts)

```astro
---
const { title } = Astro.props;
---

<!-- src/layouts/BaseLayout.astro -->
<html>
  <head>
    <title>{title}</title>
  </head>
  <body>
    <nav>...</nav>
    <main>
      <slot />
    </main>
  </body>
</html>
```

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<!-- src/pages/about.astro -->
<BaseLayout title="About">
  <h1>About Page</h1>
</BaseLayout>
```

### 4. Using Vue Components in Astro

```astro
---
import VueCounter from '../components/VueCounter.vue';
---

<!-- Static by default -->
<VueCounter count={5} />

<!-- Interactive (hydrated) -->
<VueCounter count={5} client:load />
<VueCounter count={5} client:idle />
<VueCounter count={5} client:visible />
```

**Client Directives:**

- `client:load` - Hydrate immediately
- `client:idle` - Hydrate when main thread is free
- `client:visible` - Hydrate when component is visible
- `client:media` - Hydrate when media query matches

### 5. Data Fetching (Build-time)

```astro
---
// This runs at build time, similar to Vue's asyncData
const response = await fetch('https://api.example.com/posts');
const posts = await response.json();
---

<div>
  {
    posts.map((post) => (
      <article>
        <h2>{post.title}</h2>
        <p>{post.excerpt}</p>
      </article>
    ))
  }
</div>
```

### 6. Dynamic Routes

```astro
---
export async function getStaticPaths() {
  const posts = await fetchPosts();
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
---

<!-- src/pages/blog/[slug].astro -->
<h1>{post.title}</h1>
<p>{post.content}</p>
```

### 7. Content Collections (for Markdown/MDX)

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
  }),
});

export const collections = { blog };
```

```astro
---
import { getCollection } from 'astro:content';
const posts = await getCollection('blog');
---
```

## Migration Tips from Vue

### 1. **Mindset Shift**

- **Vue**: Runtime, reactive, SPA
- **Astro**: Build-time, static-first, MPA

### 2. **State Management**

- Use Vue components with `client:*` directives for reactive state
- Consider [nanostores](https://github.com/nanostores/nanostores) for shared state between islands

### 3. **Styling**

```astro
---
// Can import CSS modules, Sass, etc.
import styles from './Component.module.css';
---

<div class={styles.container}>
  <!-- Scoped styles work similar to Vue -->
  <style>
    .local-class {
      color: red;
    }
  </style>

  <!-- Global styles -->
  <style is:global>
    body {
      font-family: Arial;
    }
  </style>
</div>
```

### 4. **Environment Variables**

```javascript
// Access like Vue's process.env
const apiUrl = import.meta.env.PUBLIC_API_URL;
const secret = import.meta.env.SECRET_KEY; // Only available server-side
```

## Project Setup

```bash
# Create new Astro project
npm create astro@latest my-project

# Add Vue integration
npx astro add vue

# Add other integrations
npx astro add tailwind
npx astro add mdx
```

## Configuration

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';

export default defineConfig({
  integrations: [vue()],
  output: 'static', // or 'server' for SSR
});
```

## Common Patterns

### Mixed Static + Interactive

```astro
---
// Static data fetching
const products = await fetchProducts();
---

<!-- Static list -->
<div class="products">
  {
    products.map((product) => (
      <div class="product-card">
        <h3>{product.name}</h3>
        <p>{product.price}</p>
        {/* Interactive component */}
        <AddToCart product={product} client:visible />
      </div>
    ))
  }
</div>
```

### API Routes

```javascript
// src/pages/api/newsletter.js
export async function POST({ request }) {
  const data = await request.formData();
  const email = data.get('email');

  // Process signup
  await addToNewsletter(email);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
```

## Best Practices

1. **Start static, add interactivity where needed**
2. **Use Vue components for complex interactive features**
3. **Leverage Astro's build-time data fetching**
4. **Consider SEO benefits of server-rendered HTML**
5. **Use content collections for blog/documentation sites**

## Performance Benefits

- **Smaller bundles**: Only ship JS for interactive components
- **Better Core Web Vitals**: Less JavaScript = faster loading
- **SEO-friendly**: Server-rendered HTML by default
- **Progressive enhancement**: Site works without JavaScript

This architecture is perfect for content sites, marketing pages, blogs, and e-commerce where you want the performance benefits of static sites but the flexibility to add interactivity where needed.
