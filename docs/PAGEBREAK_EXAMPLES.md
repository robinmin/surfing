# Page Break Examples

## Example 1: Simple Page Break

```markdown
## Chapter 1: Introduction

This is the introduction content...

<div style="page-break-after: always; break-after: page;"></div>

## Chapter 2: Getting Started

This will appear on a new page when printed.
```

## Example 2: Page Break with Visual Indicator (for development)

```markdown
## Section 1

Content here...

<div style="page-break-after: always; break-after: page; margin: 2rem 0; padding: 1rem; border-top: 2px dashed #e0e0e0; border-bottom: 2px dashed #e0e0e0; text-align: center;">
  <span style="display: inline-block; padding: 0.25rem 0.75rem; background: #f5f5f5; color: #666; font-size: 0.75rem; font-weight: 500;">📄 Page Break (Hidden in Print)</span>
</div>

## Section 2

This visual indicator helps during development but won't show when printing.
```

## Example 3: For Cheatsheets (Multi-Column Layout)

```markdown
<div class="grid grid-cols-2 gap-4">
  <div class="code-section">
    <!-- Column 1 content -->
  </div>

  <div class="code-section">
    <!-- Column 2 content -->
  </div>
</div>

<div style="page-break-after: always; break-after: page;"></div>

<div class="grid grid-cols-2 gap-4">
  <div class="code-section">
    <!-- Next page Column 1 -->
  </div>

  <div class="code-section">
    <!-- Next page Column 2 -->
  </div>
</div>
```

## Example 4: Using the Astro Component (MDX files only)

```mdx
---
title: 'My Document'
---

import PageBreak from '~/components/ui/PageBreak.astro';

## Part 1

Content...

<PageBreak />

## Part 2

More content...

<PageBreak showIndicator={true} />

## Part 3

Final content with a visual indicator above.
```

## Testing Your Page Breaks

1. **Open your markdown file in the browser**
2. **Press `Cmd + P` (Mac) or `Ctrl + P` (Windows/Linux)**
3. **Check the print preview** - you should see content split across pages
4. **Visual indicators won't appear** in the actual print output

## CSS Properties Used

The page break implementation uses:

- `page-break-after: always` - Legacy CSS2 property (wide browser support)
- `break-after: page` - Modern CSS3 Fragmentation standard

Both are included for maximum compatibility across browsers and print engines.

## Print-Specific Styling

If you want additional print customization, you can add this to your markdown frontmatter:

```markdown
---
title: 'My Document'
customCSS: |
  @media print {
    @page {
      size: A4;
      margin: 2cm;
    }

    body {
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }
  }
---
```

This gives you control over:

- Page size (A4, Letter, etc.)
- Page margins
- Color printing behavior

## Quick Copy-Paste Snippets

### Basic (no indicator):

```html
<div style="page-break-after: always; break-after: page;"></div>
```

### With indicator:

```html
<div
  style="page-break-after: always; break-after: page; margin: 2rem 0; padding: 1rem; border-top: 2px dashed #e0e0e0; border-bottom: 2px dashed #e0e0e0; text-align: center;"
>
  <span
    style="display: inline-block; padding: 0.25rem 0.75rem; background: #f5f5f5; color: #666; font-size: 0.75rem; font-weight: 500;"
    >📄 Page Break</span
  >
</div>
```

### Component (MDX only):

```jsx
<PageBreak />
```

### Component with indicator (MDX only):

```jsx
<PageBreak showIndicator={true} />
```
