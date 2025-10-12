# HTML2PDF - Enhanced Usage Guide 📄→📋

A comprehensive HTML to PDF converter with intelligent cheatsheet optimization, auto-viewport detection, and enhanced layout analysis.

## 🚀 Quick Start

```bash
# Setup alias in your shell profile
alias html2pdf='node /path/to/scripts/html2pdf/pdf-export.mjs'

# Basic conversion
html2pdf page.html                    # → page.pdf
html2pdf page.html custom.pdf         # → custom.pdf

# Cheatsheet optimization
html2pdf cheatsheet.html --single-page --margin=10px
```

## 📋 Command Syntax

```bash
html2pdf <input> [output] [options]
```

### Arguments

- `<input>` - HTML file path or URL (required)
- `[output]` - Output PDF filename (optional, auto-generated from input)

### Core Options

```bash
--single-page          Generate continuous single-page PDF (removes all page breaks)
--auto-page            Respect CSS page-break properties from HTML/markdown
--viewport WxH         Set viewport size (e.g. 1920x1080)
--margin VALUE         Page margins (e.g. 10px, 1cm, 0.5in)
--format FORMAT        Standard format (A4, Letter, Legal)
--scale VALUE          Scale factor (e.g. 0.8, default: 1.0)
--background           Include background graphics
--verbose              Detailed logging and analysis
```

**Note:** If both `--single-page` and `--auto-page` are specified, `--single-page` takes priority.

## 🎯 Use Case Examples

### Cheatsheet Optimization

```bash
# Perfect for technical references
html2pdf golang-cheat.html --single-page --margin=10px

# High-density layout
html2pdf python-ref.html --single-page --scale=0.9

# Auto-detected viewport (recommended)
html2pdf js-cheatsheet.html --single-page
```

### Documentation

```bash
# Standard document
html2pdf manual.html --format=A4 --margin=20px

# Print-ready document
html2pdf guide.html --format=Letter --margin=1in --scale=0.95
```

### Web Capture

```bash
# Full webpage screenshot
html2pdf https://example.com --single-page

# Mobile view
html2pdf https://mobile-site.com --viewport 375x812
```

### Page Break Handling

```bash
# Multi-page PDF with page breaks (respects CSS page-break properties)
html2pdf document.html --auto-page

# Documentation with controlled pagination
html2pdf user-guide.html --auto-page --format=A4 --margin=20px

# Single-page (ignores all page breaks)
html2pdf reference.html --single-page

# Priority demonstration (uses --single-page, shows warning)
html2pdf file.html --single-page --auto-page
```

**CSS Page Break Support:**
The `--auto-page` mode respects these CSS properties:

```css
/* Force page break after element */
page-break-after: always;
break-after: page;

/* Force page break before element */
page-break-before: always;
break-before: page;

/* Prevent page breaks inside element */
page-break-inside: avoid;
break-inside: avoid;
```

**Usage in Markdown:**

```html
## Section 1 Content here...

<div style="page-break-after: always; break-after: page;"></div>

## Section 2 This will appear on a new page when using --auto-page
```

## 🧠 Intelligent Features

### Auto-Viewport Detection

When `--viewport` is omitted, the tool:

1. Tests multiple viewport sizes (1920×1344, 1680×1176, 1440×1008, etc.)
2. Analyzes layout efficiency and column distribution
3. Measures content dimensions and horizontal waste
4. Selects optimal viewport automatically

Example output:

```
🔍 Auto-detecting optimal viewport...
  1920x1344: scroll=1920x3493, cols=4, waste=0px, score=1.258
  1680x1176: scroll=1680x6385, cols=1, waste=0px, score=1.537
✅ Selected viewport: 1920x1344 (4 columns, score: 1.258)
```

### Page Mode Options

**Three PDF Generation Modes:**

| Mode            | Command                            | Behavior                 | Best For                    |
| --------------- | ---------------------------------- | ------------------------ | --------------------------- |
| **Standard**    | `html2pdf file.html`               | Default pagination       | General documents           |
| **Auto-Page**   | `html2pdf file.html --auto-page`   | Respects CSS page breaks | Multi-section documentation |
| **Single-Page** | `html2pdf file.html --single-page` | One continuous page      | Cheatsheets, references     |

**Single-Page Optimization:**
For `--single-page` mode:

- Disables all CSS page breaks
- Optimizes grid layouts for continuous flow
- Calculates optimal content dimensions
- Ensures complete content visibility

**Auto-Page Mode:**
For `--auto-page` mode:

- Explicitly respects CSS page-break properties
- Creates multi-page PDFs with controlled pagination
- Perfect for markdown files with manual page breaks
- Honors both legacy and modern CSS page break syntax

### Layout Analysis

Real-time feedback:

```
📏 Content analysis:
   Scroll: 1920x3493px
   Content bounds: 1920x3493px
   Grid: 1896x2824px (4 cols)
   Selected: 1920x3493px
📄 PDF dimensions: 1920px x 3493px
```

## 💡 Best Practices

### Cheatsheet Guidelines

```bash
# Recommended for technical cheatsheets
html2pdf cheatsheet.html \
  --single-page \
  --margin=10px \
  --background

# For code-heavy references (ensures readability)
html2pdf code-ref.html \
  --single-page \
  --viewport=1920x1080 \
  --margin=5px
```

### Documentation Best Practices

```bash
# Print-optimized documents
html2pdf document.html \
  --format=A4 \
  --margin=20px \
  --scale=0.95

# Multi-section documentation with page breaks
html2pdf user-guide.html \
  --auto-page \
  --format=Letter \
  --margin=1in

# Screen-optimized PDFs
html2pdf content.html \
  --single-page \
  --margin=15px \
  --scale=1.0
```

### Page Break Best Practices

**When to use `--auto-page`:**

- Documentation with multiple sections
- Reports that need controlled pagination
- Content with intentional page breaks
- Markdown files with `<div style="page-break-after: always;">` tags

**When to use `--single-page`:**

- Technical cheatsheets
- Quick reference guides
- Single-topic documents
- Content that should flow continuously

**Adding Page Breaks in Markdown:**

```html
<!-- Basic page break -->
<div style="page-break-after: always; break-after: page;"></div>

<!-- With visual indicator (hidden in PDF) -->
<div
  style="page-break-after: always; break-after: page; margin: 2rem 0; padding: 1rem; border: 2px dashed #ccc; text-align: center;"
>
  <span>Page Break</span>
</div>
```

## 🔧 Advanced Configuration

### Margin Specifications

```bash
--margin=10px          # Pixels
--margin=1cm           # Centimeters
--margin=0.5in         # Inches
--margin=20pt          # Points
--margin=2rem          # Relative units
```

### Viewport Optimization

The scoring algorithm considers:

- **Waste minimization**: Unused horizontal space
- **Column efficiency**: Multi-column layout utilization
- **Aspect ratio**: Optimal width/height for content
- **Content bounds**: Actual vs. viewport dimensions

### Error Handling

Helpful diagnostics:

```bash
❌ Error: Invalid margin value: "10p"
💡 Tip: Use valid CSS units like "10px", "1cm", "0.5in"

❌ Error: Input file not found: missing.html
💡 Tip: Make sure the file path is correct and file exists

❌ Error: Failed to parse parameter value: 10p
💡 Tip: Check your margin value. Use valid CSS units.
```

## 📊 Quality Metrics

### Verbose Analysis

Use `--verbose` for detailed insights:

```bash
html2pdf cheatsheet.html --single-page --verbose
```

Reports include:

- Content structure breakdown
- Viewport optimization reasoning
- Column balance analysis
- Performance timing
- Quality recommendations

### Output Validation

The tool validates:

- ✅ Single-page completeness (no pagination)
- ✅ Code readability (no horizontal overflow)
- ✅ Column balance (height variance analysis)
- ✅ Content efficiency (screen utilization)

## 🚨 Troubleshooting

### Common Issues & Solutions

**Issue**: Content cut off in PDF

```bash
# Solution: Use larger viewport or auto-detection
html2pdf file.html --viewport 1920x1200
html2pdf file.html --single-page  # Auto-detects optimal
```

**Issue**: Code lines truncated

```bash
# Solution: Single-page mode with proper viewport
html2pdf code-heavy.html --single-page --margin=5px
```

**Issue**: Multiple pages for cheatsheet

```bash
# Solution: Force single-page with minimal margins
html2pdf cheat.html --single-page --margin=5px --scale=0.9
```

**Issue**: Poor print quality

```bash
# Solution: Use standard format with scaling
html2pdf doc.html --format=A4 --scale=0.95 --margin=1cm
```

**Issue**: Slow processing

```bash
# Solution: Optimize HTML structure, use smaller viewport
html2pdf large-page.html --viewport 1280x800
```

## 🔄 Migration Guide

### From html2pdf bash function

**Old (deprecated)**:

```bash
html2pdf input.html --single-page --margin=10px
# Relied on bash wrapper for file handling
```

**New (enhanced)**:

```bash
node scripts/html2pdf/pdf-export.mjs input.html --single-page --margin=10px
# Or with alias:
alias html2pdf='node /path/to/scripts/html2pdf/pdf-export.mjs'
html2pdf input.html --single-page --margin=10px
```

### Key Improvements

1. ✅ **Enhanced file handling**: Auto-generates output filenames
2. ✅ **Intelligent viewport detection**: Optimal layout analysis
3. ✅ **Better error messages**: Actionable troubleshooting tips
4. ✅ **Layout optimization**: Single-page cheatsheet focus
5. ✅ **Performance insights**: Detailed processing analysis

## 🎨 Integration Examples

### Build Pipelines

```json
// package.json
{
  "scripts": {
    "build:pdf": "html2pdf dist/cheatsheet.html docs/cheatsheet.pdf --single-page",
    "build:docs": "html2pdf docs/*.html --format=A4"
  }
}
```

### Automation Scripts

```bash
#!/bin/bash
# Batch process cheatsheets
for file in cheatsheets/*.html; do
  output="pdfs/$(basename "$file" .html).pdf"
  html2pdf "$file" "$output" --single-page --margin=10px
  echo "✅ Generated: $output"
done
```

### CI/CD Integration

```yaml
# GitHub Actions example
- name: Generate PDFs
  run: |
    for cheat in cheatsheets/*.html; do
      html2pdf "$cheat" "dist/$(basename "$cheat" .html).pdf" --single-page
    done
```

## 📈 Performance Optimization

### Speed Tips

1. **Optimize HTML structure**: Clean, semantic markup converts faster
2. **Use appropriate viewports**: Larger = slower processing
3. **Minimize external resources**: Local assets load faster
4. **Cache-friendly**: Reuse PDFs when source unchanged
5. **Batch processing**: Process similar files together

### Quality vs. Speed Trade-offs

```bash
# Fast processing (good for development)
html2pdf file.html --viewport 1280x800 --scale=0.8

# High quality (production ready)
html2pdf file.html --single-page --scale=1.0

# Balanced (recommended)
html2pdf file.html --single-page --margin=10px
```

## 📚 Related Documentation

- [Cheatsheet Processing Guide](../docs/prompt_cheatsheets.md)
- [PostSurfing CLI](../postsurfing/postsurfing.mjs)
- [Playwright Documentation](https://playwright.dev/docs/)

## 🎯 Success Metrics

### Quality Gates for Cheatsheets

- ✅ **Single page**: All content visible without pagination
- ✅ **No horizontal scroll**: Complete code lines visible
- ✅ **Balanced columns**: Height variance < 20%
- ✅ **Space efficiency**: > 80% screen utilization
- ✅ **Fast generation**: < 10 seconds processing time

### Validation Checklist

Before publishing, verify:

- [ ] PDF opens as single page
- [ ] All code blocks fully readable
- [ ] No content cut off at edges
- [ ] Consistent formatting throughout
- [ ] Appropriate file size (< 5MB for cheatsheets)

---

**Enhanced HTML2PDF Tool**  
_Part of the Surfing Documentation Platform_  
[Surfing Cheatsheets](https://surfing.salty.vip/) | [Report Issues](https://github.com/surfing-platform/issues)
