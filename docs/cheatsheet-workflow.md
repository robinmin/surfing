# 📚 Cheatsheet Publishing Workflow

## Overview

This document describes the refined 4-step process for publishing cheatsheets to the Surfing platform. The workflow is designed to be streamlined, user-friendly, and free from permission interruptions.

---

## 🎯 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    CHEATSHEET PUBLISHING WORKFLOW                │
└─────────────────────────────────────────────────────────────────┘

   ┌──────────────────────────────────────────────────────────┐
   │ Step 1: PREPROCESS                                        │
   │ ./scripts/preprocess-cheatsheets.sh your-file.html       │
   └──────────────────────────────────────────────────────────┘
                              │
                              │ • Analyzes HTML structure
                              │ • Generates configuration
                              │ • Caches to contents/cheatsheets/en/
                              │ • Provides AI instructions
                              ▼
   ┌──────────────────────────────────────────────────────────┐
   │ Step 2: AI REFINEMENT                                    │
   │ Use AI with: docs/prompt_cheatsheets.md                  │
   └──────────────────────────────────────────────────────────┘
                              │
                              │ • Refines content quality
                              │ • Optimizes layout & columns
                              │ • Removes navigation
                              │ • Previews with Playwright
                              ▼
   ┌──────────────────────────────────────────────────────────┐
   │ Step 3: USER REVIEW                                       │
   │ Review refined HTML in browser preview                    │
   └──────────────────────────────────────────────────────────┘
                              │
                              │ • Review in browser
                              │ • Optional: html2pdf (manual)
                              │ • Approve OR iterate to Step 2
                              ▼
   ┌──────────────────────────────────────────────────────────┐
   │ Step 4: POSTPROCESS                                       │
   │ ./scripts/postprocess-cheatsheets.sh refined-file.html   │
   └──────────────────────────────────────────────────────────┘
                              │
                              │ • Validates HTML
                              │ • Converts to markdown
                              │ • Generates PDF (optional)
                              │ • Publishes to website
                              ▼
                       ┌─────────────┐
                       │  PUBLISHED  │
                       └─────────────┘
```

---

## 📝 Step-by-Step Instructions

### Step 1: Preprocess

**Purpose:** Analyze and prepare the HTML file for AI optimization

**Command:**

```bash
./scripts/preprocess-cheatsheets.sh your-cheatsheet.html [options]
```

**Options:**

- `--style <css-file>` - Preserve custom CSS styles
- `--columns <n>` - Force specific column count (1-4)
- `--compact` - Use compact spacing (default)
- `--comfortable` - Use comfortable spacing
- `--no-toc` - Disable table of contents
- `--dry-run` - Preview without creating files

**Output:**

- Cached HTML file in `contents/cheatsheets/en/`
- Processing configuration in `/tmp/cheatsheet_config_*.json`
- AI assistant instructions in console

**Example:**

```bash
./scripts/preprocess-cheatsheets.sh golang-cheatsheet.html --compact --columns 3
```

---

### Step 2: AI Refinement

**Purpose:** Refine content quality and optimize layout using AI assistant

**Prompt:** `docs/prompt_cheatsheets.md`

**What the AI does:**

1. Loads cached HTML from `contents/cheatsheets/en/`
2. Refines code examples for accuracy and readability
3. Optimizes section layout with column balancing
4. Removes navigation elements (TOC, sidebar, etc.)
5. Previews with Playwright MCP for user approval

**Key Points:**

- ✅ AI focuses ONLY on content and layout
- 🚫 AI does NOT execute external commands
- ✅ Uses Playwright MCP to preview results
- ✅ No permission interruptions

**AI Workflow:**

```
1. Read cached HTML file
2. Analyze and refine content
3. Balance columns intelligently
4. Generate optimized HTML
5. Preview with Playwright
6. Wait for user approval
```

---

### Step 3: User Review

**Purpose:** Review and approve the refined HTML before publishing

**Actions:**

1. **Review** the refined HTML in browser (Playwright preview)
2. **Verify** content quality, layout, and code readability
3. **Approve** or iterate back to Step 2 if changes needed

**Quality Checklist:**

- [ ] All content visible in single page
- [ ] No horizontal scrolling in code blocks
- [ ] Columns are balanced (<15% variance)
- [ ] Navigation elements removed
- [ ] Code examples are correct
- [ ] Mobile responsive layout works

---

### Step 4: Postprocess

**Purpose:** Publish the refined cheatsheet to the website

**Command:**

```bash
./scripts/postprocess-cheatsheets.sh refined-file.html [options]
```

**Options:**

- `--lang <lang>` - Content language: en, cn, jp (default: en)
- `--no-commit` - Skip git commit (only generate files)
- `--commit-message <msg>` - Custom commit message
- `--dry-run` - Preview without applying changes
- `--verbose` - Detailed logging

**What it does:**

1. Validates the refined HTML file
2. Auto-detects if PDF exists in `assets/pdf/cheatsheets/<lang>/`
3. Generates PDF if not already present (intelligent auto-generation)
4. Converts HTML to Astro-compatible markdown
5. Calls `postsurfing` to publish to website
6. Cleans up cached HTML file from `contents/cheatsheets/<lang>/`
7. Commits and pushes changes (unless `--no-commit`)

**Example:**

```bash
# Auto-generates PDF if not present
./scripts/postprocess-cheatsheets.sh golang-cheatsheet.html

# Specify language
./scripts/postprocess-cheatsheets.sh golang-cheatsheet.html --lang cn
```

**Output:**

- Markdown file in `contents/cheatsheets/<lang>/`
- PDF file in `assets/pdf/cheatsheets/<lang>/` (auto-generated if not present)
- Published to website after deployment

---

## 🔧 Tools Reference

### Independent Tools

These tools are designed for generic purposes and can be used independently:

#### **html2pdf**

Converts HTML to single-page PDF with customizable settings.

```bash
html2pdf input.html output.pdf [options]
```

**Options:**

- `--single-page` - Force single-page output
- `--margin=<value>` - Set page margin (e.g., 10px)
- `--viewport=<width>x<height>` - Custom viewport size

**Location:** `scripts/html2pdf/pdf-export.mjs`

#### **postsurfing**

Automated content publishing tool for the Surfing platform.

```bash
postsurfing <file-path> --type <content-type> [options]
```

**Options:**

- `--type <type>` - Content type (articles|showcase|documents|cheatsheets)
- `--lang <lang>` - Content language: en, cn, jp (default: en)
- `--auto-convert` - Auto-convert HTML to Surfing format
- `--no-commit` - Skip git operations
- `--interactive` - Prompt for missing fields

**Note:** This is a generic tool that doesn't handle PDF generation. PDF logic is in `postprocess-cheatsheets.sh`.

**Location:** `scripts/postsurfing/postsurfing.mjs`

---

## 🎯 Key Improvements

### Compared to Previous Workflow

| Aspect           | Previous               | Refined                          |
| ---------------- | ---------------------- | -------------------------------- |
| **Steps**        | 3 steps                | 4 steps (clearer separation)     |
| **AI Role**      | Executes commands      | Only content/layout optimization |
| **Permissions**  | Frequent interruptions | Zero interruptions               |
| **User Control** | Auto-publish           | Manual review before publish     |
| **Tools**        | Tightly coupled        | Independent, reusable            |
| **PDF Logic**    | In postsurfing         | In postprocess (auto-detect)     |
| **Flexibility**  | Limited                | High (iterate freely, auto PDF)  |

### Benefits

1. **No Permission Interruptions**
   - AI doesn't execute external commands
   - Smooth, uninterrupted workflow

2. **User Control**
   - Review before publishing
   - Iterate freely on refinement
   - Optional PDF generation

3. **Clear Separation of Concerns**
   - Preprocess: Analysis and preparation
   - AI: Content and layout optimization
   - Review: User validation
   - Postprocess: Publishing automation (includes PDF logic)

4. **Independent Tools**
   - `html2pdf` and `postsurfing` usable for other purposes
   - Not tightly coupled to cheatsheet workflow
   - Flexible configuration options
   - `postsurfing` remains generic (no PDF logic)

5. **Intelligent Auto PDF Generation**
   - Auto-detects if PDF already exists
   - Generates only when needed
   - Respects language-specific directories
   - Non-blocking (continues if PDF generation fails)

6. **Better Quality Control**
   - User reviews refined HTML before publishing
   - Playwright preview ensures visual accuracy
   - Iterative refinement possible

---

## 📊 File Locations

```
surfing/
├── scripts/
│   ├── preprocess-cheatsheets.sh      # Step 1: Preprocessing
│   ├── postprocess-cheatsheets.sh     # Step 4: Publishing
│   ├── html2pdf/
│   │   └── pdf-export.mjs             # PDF generation tool
│   └── postsurfing/
│       └── postsurfing.mjs            # Publishing tool
├── docs/
│   ├── prompt_cheatsheets_optimized.md # Step 2: AI prompt
│   └── cheatsheet-workflow.md         # This document
├── contents/cheatsheets/
│   ├── en/                            # English cheatsheets
│   ├── cn/                            # Chinese cheatsheets
│   └── jp/                            # Japanese cheatsheets
└── assets/pdf/cheatsheets/
    ├── en/                            # English PDFs
    ├── cn/                            # Chinese PDFs
    └── jp/                            # Japanese PDFs
```

---

## 🚀 Quick Start Examples

### Basic Workflow

```bash
# Step 1: Preprocess
./scripts/preprocess-cheatsheets.sh golang-cheatsheet.html

# Step 2: Use AI with docs/prompt_cheatsheets.md
# (AI refines content and previews with Playwright)

# Step 3: Review in browser and approve

# Step 4: Postprocess and publish (auto-generates PDF if needed)
./scripts/postprocess-cheatsheets.sh golang-cheatsheet.html
```

### With Custom Styling

```bash
# Step 1: Preprocess with custom CSS
./scripts/preprocess-cheatsheets.sh react-cheatsheet.html \
  --style my-custom-styles.css \
  --comfortable \
  --columns 3

# Steps 2-4: Same as basic workflow
```

### Dry Run (Preview Only)

```bash
# Preview preprocessing
./scripts/preprocess-cheatsheets.sh javascript-cheatsheet.html --dry-run

# Preview postprocessing
./scripts/postprocess-cheatsheets.sh javascript-cheatsheet.html --dry-run
```

### Without Git Commit

```bash
# Generate files only, no commit (PDF auto-generated if needed)
./scripts/postprocess-cheatsheets.sh python-cheatsheet.html --no-commit
```

### With Language Specification

```bash
# Chinese cheatsheet (PDF goes to assets/pdf/cheatsheets/cn/)
./scripts/postprocess-cheatsheets.sh golang-cheatsheet.html --lang cn
```

---

## 🆘 Troubleshooting

### Common Issues

**Issue:** Preprocess script can't find HTML file

```bash
# Solution: Use absolute or relative path
./scripts/preprocess-cheatsheets.sh ./path/to/file.html
```

**Issue:** AI assistant can't find cached file

```bash
# Solution: Check the cached file location
ls -la contents/cheatsheets/en/
```

**Issue:** PDF generation fails

```bash
# Solution: Verify html2pdf tool is installed
node scripts/html2pdf/pdf-export.mjs --help
```

**Issue:** Postprocess script fails

```bash
# Solution: Run with --verbose for detailed logs
./scripts/postprocess-cheatsheets.sh file.html --verbose
```

---

## 📚 Additional Resources

- **Preprocess Script:** `scripts/preprocess-cheatsheets.sh --help`
- **Postprocess Script:** `scripts/postprocess-cheatsheets.sh --help`
- **AI Prompt:** `docs/prompt_cheatsheets.md`
- **PostSurfing CLI:** `docs/postsurfing-cli.md`
- **Content Specification:** `docs/content-specification.md`

---

**Built with ❤️ for streamlined cheatsheet publishing**
