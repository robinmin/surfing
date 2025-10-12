# 📄 HTML to PDF Converter - Comprehensive User Guide

A powerful, intelligent HTML to PDF conversion tool with advanced cheatsheet optimization, auto-detection capabilities, and single-page layout support.

## 🚀 **Quick Start**

### **Setup Alias (Recommended)**

```bash
# Add to your ~/.zshrc or ~/.bashrc
alias html2pdf='node /path/to/your/scripts/html2pdf/pdf-export.mjs'

# Reload shell configuration
source ~/.zshrc  # or ~/.bashrc
```

### **Basic Usage**

```bash
# Convert HTML to PDF (auto-generates output filename)
html2pdf mypage.html                    # → mypage.pdf

# Specify custom output filename
html2pdf mypage.html custom-name.pdf    # → custom-name.pdf

# Single-page optimization (recommended for cheatsheets)
html2pdf cheatsheet.html --single-page  # → cheatsheet.pdf (no page breaks)
```

---

## 📚 **Complete Command Reference**

### **Basic Syntax**

```bash
html2pdf <input> [output] [options]
```

### **Arguments**

- **`<input>`** (required) - Input HTML file path or URL
- **`[output]`** (optional) - Output PDF filename (auto-generated if omitted)

### **Core Options**

| Option            | Description                                      | Example                |
| ----------------- | ------------------------------------------------ | ---------------------- |
| `--single-page`   | Generate continuous single page (no page breaks) | `--single-page`        |
| `--margin=VALUE`  | Set margins (CSS units)                          | `--margin=10px`        |
| `--viewport=WxH`  | Set viewport size (auto-detected if omitted)     | `--viewport=1920x1080` |
| `--format=FORMAT` | Paper format for multi-page PDFs                 | `--format=A4`          |
| `--scale=VALUE`   | Scaling factor (0.1-2.0)                         | `--scale=0.8`          |
| `--verbose`       | Enable detailed logging and debugging            | `--verbose`            |

### **Advanced Options**

| Option            | Description                                 | Example           |
| ----------------- | ------------------------------------------- | ----------------- |
| `--width=VALUE`   | Custom page width (single-page mode)        | `--width=2000px`  |
| `--height=VALUE`  | Custom page height (single-page mode)       | `--height=3000px` |
| `--background`    | Include background colors/images            | `--background`    |
| `--no-background` | Exclude backgrounds (faster, smaller files) | `--no-background` |

---

## 🎯 **Usage Scenarios & Examples**

### **📋 Cheatsheet Conversion (Recommended Settings)**

```bash
# Optimal cheatsheet conversion (auto-detects viewport, no page breaks)
html2pdf golang-cheatsheet.html --single-page --margin=10px

# Compact cheatsheet (minimal margins)
html2pdf react-cheatsheet.html --single-page --margin=5px

# High-quality cheatsheet with debugging
html2pdf python-guide.html --single-page --verbose --margin=15px
```

### **📑 Document Conversion**

```bash
# Standard document (A4 format with page breaks)
html2pdf report.html --format=A4 --margin=20px

# Legal document (US Letter format)
html2pdf contract.html --format=Letter --margin=1in

# Presentation slides (landscape)
html2pdf slides.html --format=A4 --landscape --margin=10px
```

### **🌐 Web Page Conversion**

```bash
# Convert remote webpage
html2pdf https://example.com/page.html webpage.pdf --single-page

# Convert with custom scaling for better readability
html2pdf https://docs.example.com/guide.html guide.pdf --scale=1.2 --margin=15px
```

### **🔧 Custom Sizing & Layout**

```bash
# Force specific viewport (override auto-detection)
html2pdf dashboard.html --viewport=1440x900 --single-page

# Custom page dimensions for special layouts
html2pdf infographic.html --single-page --width=1200px --height=1800px

# Scaled output for printing
html2pdf poster.html --single-page --scale=0.7 --margin=20px
```

---

## 🧠 **Intelligent Features**

### **🔍 Auto-Detection Capabilities**

The tool automatically analyzes your HTML content and optimizes settings:

#### **Viewport Auto-Detection**

```bash
# No viewport specified - tool analyzes content and chooses optimal size
html2pdf cheatsheet.html --single-page

# Analysis output example:
# 🔍 Auto-detecting optimal viewport...
#   1920x1344: scroll=1920x3052, cols=4, waste=0px, score=0.771
#   1680x1176: scroll=1680x3052, cols=4, waste=0px, score=0.850
#   1440x1008: scroll=1440x3052, cols=4, waste=0px, score=0.928
# ✅ Selected viewport: 1920x1344 (4 columns, score: 0.771)
```

#### **Layout Analysis**

- **Grid Detection**: Identifies CSS Grid, Flexbox, and multi-column layouts
- **Content Optimization**: Measures content density and distribution
- **Column Balancing**: Optimizes for even content distribution
- **Code Block Analysis**: Ensures no horizontal scrolling in code examples

#### **Single-Page Optimization**

```bash
html2pdf technical-guide.html --single-page
# Automatically:
# - Disables CSS page-break rules
# - Calculates optimal page dimensions
# - Preserves layout integrity
# - Ensures all content fits on one continuous page
```

### **📊 Content Analysis Output**

```bash
html2pdf cheatsheet.html --single-page --verbose

# Detailed analysis:
# 📏 Content analysis:
#    Scroll: 1920x3052px        # Full content dimensions
#    Content bounds: 1920x2848px # Effective content area
#    Grid: 1896x2824px (4 cols) # Grid layout detection
#    Viewport: 1920x1344px      # Selected viewport
#    Selected: 1920x2848px      # Final PDF dimensions
```

---

## 🎨 **Output Quality & Optimization**

### **📄 Single-Page Mode (Recommended for Cheatsheets)**

- ✅ **No page breaks** - All content on one continuous page
- ✅ **Optimal viewport** - Auto-detects best width for content layout
- ✅ **Layout preservation** - Maintains original responsive design
- ✅ **Code readability** - Ensures code blocks don't get cut off

```bash
# Perfect for cheatsheets, reference guides, dashboards
html2pdf golang-cheatsheet.html --single-page
```

### **📑 Multi-Page Mode (Standard Documents)**

- ✅ **Standard formats** - A4, Letter, Legal, Tabloid
- ✅ **Proper pagination** - Natural page breaks at logical points
- ✅ **Print-ready** - Standard margins and formatting

```bash
# Perfect for reports, documentation, articles
html2pdf documentation.html --format=A4 --margin=1cm
```

### **🎯 Quality Settings**

#### **High Quality (Detailed Content)**

```bash
html2pdf detailed-guide.html --single-page --scale=1.0 --margin=15px --background
```

#### **Compact Output (Smaller File Size)**

```bash
html2pdf simple-page.html --single-page --scale=0.8 --no-background --margin=10px
```

#### **Print Optimized**

```bash
html2pdf document.html --format=A4 --margin=2cm --scale=0.9
```

---

## 🔧 **Advanced Configuration**

### **🎛️ Fine-Tuning Options**

#### **Margin Specifications**

```bash
# Pixels (most common for cheatsheets)
html2pdf page.html --margin=10px

# Centimeters (good for printing)
html2pdf document.html --margin=1.5cm

# Inches (US standard)
html2pdf report.html --margin=0.75in

# Points (typography)
html2pdf flyer.html --margin=36pt

# Relative units
html2pdf responsive.html --margin=2rem
```

#### **Scaling for Different Purposes**

```bash
# Enlarge for better readability
html2pdf small-text.html --scale=1.3 --single-page

# Reduce for more content per page
html2pdf dense-content.html --scale=0.7 --single-page

# Standard scaling
html2pdf normal-page.html --scale=1.0
```

#### **Custom Viewport Scenarios**

```bash
# Wide screens (ultrawide monitors)
html2pdf dashboard.html --viewport=2560x1080 --single-page

# Standard desktop
html2pdf webpage.html --viewport=1920x1080 --single-page

# Tablet layout
html2pdf mobile-app.html --viewport=768x1024 --single-page

# Mobile layout
html2pdf mobile-site.html --viewport=375x667 --single-page
```

### **🌐 URL Processing**

```bash
# Remote websites
html2pdf https://github.com/user/repo/blob/main/README.md readme.pdf --single-page

# Local development servers
html2pdf http://localhost:3000/documentation docs.pdf --single-page

# Specific pages with parameters
html2pdf "https://api.example.com/docs?format=html" api-docs.pdf --single-page
```

---

## 🎯 **Best Practices & Recommendations**

### **📋 For Cheatsheets & Reference Materials**

```bash
# Recommended settings for optimal cheatsheet output
html2pdf cheatsheet.html --single-page --margin=10px --verbose

# Why these settings:
# --single-page: Prevents awkward page breaks in reference material
# --margin=10px: Provides minimal white space for maximum content
# --verbose: Shows analysis for optimization verification
```

### **📚 For Documentation & Articles**

```bash
# Multi-page with proper pagination
html2pdf long-article.html --format=A4 --margin=2cm --scale=0.9

# Why these settings:
# --format=A4: Standard readable format
# --margin=2cm: Comfortable reading margins
# --scale=0.9: Fits more content while maintaining readability
```

### **🖼️ For Visual Content (Infographics, Dashboards)**

```bash
# Large single page with exact dimensions
html2pdf infographic.html --single-page --width=1200px --height=1600px --margin=0px

# Why these settings:
# Custom dimensions: Preserves exact visual layout
# --margin=0px: No white space around visual content
# --single-page: Keeps visual elements together
```

### **⚡ Performance Optimization**

```bash
# Faster conversion (removes backgrounds and complex rendering)
html2pdf simple-page.html --no-background --scale=0.8

# High quality but slower
html2pdf complex-page.html --background --scale=1.0 --single-page
```

---

## 🐛 **Troubleshooting Guide**

### **❌ Common Issues & Solutions**

#### **"Input file not found"**

```bash
# ❌ Problem
html2pdf nonexistent.html
# Error: Input file not found: nonexistent.html

# ✅ Solution: Check file path and existence
ls -la *.html                    # List available HTML files
html2pdf ./docs/guide.html       # Use relative path
html2pdf /full/path/to/file.html # Use absolute path
```

#### **"Failed to parse parameter value"**

```bash
# ❌ Problem
html2pdf page.html --margin=10p
# Error: Failed to parse parameter value: 10p

# ✅ Solution: Use valid CSS units
html2pdf page.html --margin=10px  # Pixels
html2pdf page.html --margin=1cm   # Centimeters
html2pdf page.html --margin=0.5in # Inches
```

#### **Content Cut Off or Poor Layout**

```bash
# ❌ Problem: Content doesn't fit properly

# ✅ Solutions:
# 1. Use single-page mode for cheatsheets
html2pdf cheatsheet.html --single-page

# 2. Let auto-detection choose viewport
html2pdf page.html --single-page --verbose  # Remove manual --viewport

# 3. Adjust scaling
html2pdf page.html --single-page --scale=0.8  # Fit more content

# 4. Use custom dimensions
html2pdf page.html --single-page --width=2000px --height=3000px
```

#### **File Too Large or Slow Conversion**

```bash
# ✅ Optimization strategies:
html2pdf page.html --no-background --scale=0.8     # Remove backgrounds
html2pdf page.html --single-page --margin=5px      # Reduce margins
html2pdf page.html --viewport=1280x800 --single-page # Smaller viewport
```

### **🔍 Debugging with Verbose Mode**

```bash
# Enable detailed logging to understand what's happening
html2pdf problematic-page.html --single-page --verbose

# Output shows:
# - Viewport detection process
# - Content analysis results
# - Layout optimization decisions
# - Final PDF dimensions
# - Processing steps and timing
```

### **🧪 Testing Different Settings**

```bash
# Test with minimal settings first
html2pdf test.html --single-page

# Then add options incrementally
html2pdf test.html --single-page --margin=10px
html2pdf test.html --single-page --margin=10px --verbose
html2pdf test.html --single-page --margin=10px --scale=0.9
```

---

## 📈 **Integration Examples**

### **🔄 Automated Workflows**

```bash
# Batch processing multiple files
for file in *.html; do
    html2pdf "$file" --single-page --margin=10px
done

# Integration with build processes
npm run build-docs && html2pdf dist/documentation.html docs.pdf --single-page
```

### **🧩 Cheatsheet Processing Pipeline**

```bash
# Complete cheatsheet workflow
# 1. Process HTML with AI enhancement
# 2. Generate optimized PDF
# 3. Publish to platform

# Step 2: PDF generation (after HTML enhancement)
html2pdf enhanced-golang-cheatsheet.html golang-cheatsheet.pdf --single-page --margin=10px

# Step 3: Integration with publishing
postsurfing golang-cheatsheet.md --type cheatsheets --lang en
```

### **⚙️ Scripting Integration**

```bash
#!/bin/bash
# Advanced cheatsheet processor script

INPUT_FILE="$1"
OUTPUT_NAME="${INPUT_FILE%.html}"

# Generate PDF with optimal settings
html2pdf "$INPUT_FILE" "${OUTPUT_NAME}.pdf" \
  --single-page \
  --margin=10px \
  --verbose

echo "✅ PDF generated: ${OUTPUT_NAME}.pdf"
```

---

## 🏆 **Pro Tips & Advanced Usage**

### **🎯 Viewport Selection Strategy**

```bash
# For cheatsheets with 4+ columns: Use wide viewport
html2pdf multi-column-cheatsheet.html --viewport=1920x1080 --single-page

# For simple content: Let auto-detection choose
html2pdf simple-guide.html --single-page  # Auto-detects optimal size

# For mobile-first designs: Use smaller viewport
html2pdf responsive-design.html --viewport=768x1024 --single-page
```

### **📐 Margin Strategy by Content Type**

```bash
# Cheatsheets (maximize content space)
html2pdf cheat.html --single-page --margin=5px

# Documentation (readable margins)
html2pdf docs.html --format=A4 --margin=2cm

# Presentations (minimal margins)
html2pdf slides.html --single-page --margin=10px

# Print materials (generous margins for binding)
html2pdf book-chapter.html --format=A4 --margin=3cm
```

### **🚀 Performance Optimization**

```bash
# Fast conversion (basic content)
html2pdf simple.html --no-background --scale=0.8

# Balanced (good quality, reasonable speed)
html2pdf standard.html --single-page --margin=10px

# High quality (complex content, slower)
html2pdf complex.html --single-page --background --scale=1.0 --verbose
```

### **🔄 Batch Operations**

```bash
# Convert all HTML files in directory
find . -name "*.html" -exec html2pdf {} --single-page --margin=10px \;

# Convert with custom naming pattern
for file in *-cheatsheet.html; do
    name=$(basename "$file" -cheatsheet.html)
    html2pdf "$file" "${name}-reference.pdf" --single-page
done
```

---

## 📚 **Quick Reference Card**

### **Most Common Commands**

```bash
# Basic cheatsheet conversion
html2pdf cheatsheet.html --single-page

# With custom output name
html2pdf source.html target.pdf --single-page --margin=10px

# Standard document
html2pdf document.html --format=A4 --margin=2cm

# Debug/optimize
html2pdf page.html --single-page --verbose
```

### **Essential Options Quick Reference**

| Use Case        | Command Template                                                  |
| --------------- | ----------------------------------------------------------------- |
| **Cheatsheet**  | `html2pdf file.html --single-page --margin=10px`                  |
| **Document**    | `html2pdf file.html --format=A4 --margin=2cm`                     |
| **Debug**       | `html2pdf file.html --single-page --verbose`                      |
| **Custom Size** | `html2pdf file.html --single-page --width=2000px --height=3000px` |
| **URL**         | `html2pdf https://example.com/page.html output.pdf --single-page` |

---

## 🆘 **Support & Resources**

### **Getting Help**

```bash
# Show help and all options
html2pdf --help

# Test with verbose output for debugging
html2pdf your-file.html --single-page --verbose
```

### **Common File Patterns**

- ✅ **Cheatsheets**: `--single-page --margin=10px`
- ✅ **Documentation**: `--format=A4 --margin=2cm`
- ✅ **Dashboards**: `--single-page --viewport=1920x1080`
- ✅ **Mobile Content**: `--viewport=375x667 --single-page`

This tool is optimized for cheatsheet generation and technical documentation, providing intelligent auto-detection and optimization for the best possible PDF output quality. 🚀
