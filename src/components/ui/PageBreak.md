# PageBreak Component Usage

The `PageBreak` component allows you to add forced page breaks in your markdown/MDX files.

## Usage

### In MDX files

```mdx
---
title: 'My Document'
---

import PageBreak from '~/components/ui/PageBreak.astro';

## Section 1

Some content here...

<PageBreak />

## Section 2

This will appear on a new page when printed or exported to PDF.

<PageBreak showIndicator={true} />

## Section 3

The indicator helps you see where page breaks are in the browser.
```

### Props

| Prop            | Type      | Default | Description                                        |
| --------------- | --------- | ------- | -------------------------------------------------- |
| `class`         | `string`  | -       | Additional CSS classes to apply                    |
| `showIndicator` | `boolean` | `false` | Show visual indicator in browser (hidden in print) |

### Alternative: Using Raw HTML

If you can't use the component directly, you can also use raw HTML in your markdown:

```html
<div style="page-break-after: always;"></div>
```

Or with better browser support:

```html
<div style="page-break-after: always; break-after: page;"></div>
```

## CSS Page Break Properties

The component uses the following CSS properties for maximum compatibility:

- `page-break-after: always` - Legacy CSS for page breaks
- `break-after: page` - Modern CSS Fragmentation standard

Both properties are used to ensure compatibility across different browsers and print engines.

## Print Testing

To test page breaks:

1. Open your page in a browser
2. Use Print Preview (Cmd/Ctrl + P)
3. Check that content breaks at the correct locations

## Example Use Cases

- Multi-column cheatsheets (like your Python cheatsheet)
- Long documentation that needs logical page divisions
- PDF exports where you want control over page boundaries
- Print-optimized layouts
