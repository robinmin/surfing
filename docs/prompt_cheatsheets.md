# 📚 Cheatsheet Content Optimization Prompt

## 🎯 **Mission**

Refine and optimize HTML cheatsheet content for high-quality, compact single-page display on the Surfing platform, focusing on content quality, layout optimization, and visual polish.

---

## 📋 **Input Context**

You will receive:

- A cached HTML file at: `src/content/cheatsheets/en/<filename>.html`
- Processing configuration from the preprocess script
- User preferences for columns, spacing, and styling

---

## 🎨 **Core Optimization Tasks**

### 1. **Tech Stack Alignment** ⭐ **PRIORITY**

**Prefer Built-in Tech Stack** (to minimize external dependencies and avoid class conflicts):

- **CSS Framework**: Use **Tailwind CSS** (already available via CDN)
- **Component Framework**: Use **Astro** patterns where applicable
- **Icons**: Use Unicode/emoji instead of icon libraries
- **Fonts**: Use system fonts (`system-ui`, `Inter`) instead of Google Fonts
- **Syntax Highlighting**: Use inline styles or Tailwind instead of highlight.js if possible

**If external dependencies are necessary**:

- Use only well-maintained CDN libraries (highlight.js, etc.)
- Document why they're needed in the output
- Keep the list minimal (1-2 external resources max)

**Conversion Strategy**:

- If source uses Bootstrap → Convert to Tailwind classes
- If source uses custom CSS → Simplify to Tailwind utilities where possible
- If source uses jQuery → Convert to vanilla JS or remove if not essential
- If source uses icon fonts → Replace with emoji or Unicode

### 2. **Content Refinement**

- **Accuracy**: Verify code examples are syntactically correct and follow best practices
- **Completeness**: Ensure all essential concepts are covered without redundancy
- **Clarity**: Improve explanations to be concise yet comprehensive
- **Consistency**: Standardize formatting, naming conventions, and terminology
- **Code Quality**: Optimize code examples for readability and proper line length

### 3. **Layout Optimization**

#### **Column Balancing**

- Analyze section heights and content density
- Redistribute sections to achieve balanced column heights (variance < 15%)
- Keep related content together when possible
- Apply intelligent section placement based on visual weight

#### **Responsive Grid Structure**

```html
<div class="cheat-grid">
  <!-- Sections distributed across columns -->
  <div class="cheat-section"><!-- Section content --></div>
  <div class="cheat-section"><!-- Section content --></div>
  <!-- ... balanced sections ... -->
</div>
```

#### **Column Count Guidelines**

- **2 columns**: Long code examples (>80 chars), few sections (<8)
- **3 columns**: Balanced content (8-15 sections)
- **4 columns**: Many short sections (>15), compact content

### 4. **Visual Polish**

#### **Remove Navigation Elements**

```css
/* Ensure these are hidden */
nav,
.nav,
.navigation,
.toc,
.sidebar,
.menu {
  display: none !important;
}
```

#### **Code Readability**

- Ensure no horizontal scrolling in code blocks
- Use appropriate font sizes (13-14px for code)
- Apply syntax highlighting if not present
- Wrap long lines intelligently at natural break points

#### **Spacing & Density**

- **Compact**: Minimal padding, dense information (default for cheatsheets)
- **Comfortable**: Moderate spacing for easier scanning
- **Spacious**: Maximum readability for complex content

### 5. **HTML Structure Template**

```html
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{title}} | Surfing Cheatsheets</title>
    <meta name="description" content="{{description}}" />

    <!-- Core responsive framework -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- User Custom Styles (ABSOLUTE PRIORITY) -->
    {{#if user_custom_css}}
    <style id="user-styles">
      {{user_custom_css}}
    </style>
    {{/if}}

    <!-- Surfing Design System (fallback only) -->
    <style id="surfing-fallbacks">
      :root {
        --cheat-primary: #2563eb;
        --cheat-secondary: #64748b;
        --cheat-accent: #10b981;
        --cheat-font-family: 'Inter', system-ui, sans-serif;
        --cheat-font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
      }

      body {
        font-family: var(--cheat-font-family);
        background: #f9fafb;
        margin: 0;
        padding: 0;
      }

      .cheat-grid {
        display: grid;
        gap: 1rem;
        padding: 1rem;
        max-width: 100%;
      }

      /* Responsive column layout */
      @media screen and (min-width: 1800px) {
        .cheat-grid {
          grid-template-columns: repeat(4, 1fr);
        }
      }

      @media screen and (min-width: 1400px) and (max-width: 1799px) {
        .cheat-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      @media screen and (min-width: 1000px) and (max-width: 1399px) {
        .cheat-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media screen and (max-width: 999px) {
        .cheat-grid {
          grid-template-columns: 1fr;
        }
      }

      .cheat-section {
        break-inside: avoid;
        background: white;
        border-radius: 8px;
        padding: 1rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .cheat-section h2 {
        margin: 0 0 0.75rem 0;
        font-size: 1.25rem;
        color: var(--cheat-primary);
        font-weight: 600;
      }

      .cheat-code,
      pre,
      code {
        font-family: var(--cheat-font-mono);
        font-size: 13px;
        line-height: 1.5;
        overflow-x: auto;
        background: #f3f4f6;
        border-radius: 4px;
        padding: 0.5rem;
        margin: 0.5rem 0;
      }

      pre code {
        background: none;
        padding: 0;
      }

      /* Remove navigation elements */
      nav,
      .nav,
      .navigation,
      .toc,
      .sidebar,
      .menu {
        display: none !important;
      }
    </style>

    <!-- Print optimizations -->
    <style media="print">
      nav,
      .nav,
      .navigation,
      .toc,
      .sidebar {
        display: none !important;
      }
      .cheat-grid {
        gap: 0.5rem;
      }
      body {
        margin: 10px;
      }
    </style>
  </head>
  <body>
    <!-- Minimal header -->
    <header style="text-align: center; padding: 1rem 0; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <h1 style="margin: 0; font-size: 1.75rem; color: #1f2937;">{{emoji}} {{title}}</h1>
      <p style="margin: 0.25rem 0 0 0; font-size: 0.875rem; color: #6b7280;">{{subtitle}}</p>
    </header>

    <!-- Main content -->
    <main>
      <div class="cheat-grid">
        <!-- Balanced sections go here -->
        {{sections}}
      </div>
    </main>

    <!-- Footer with PDF link -->
    <footer style="text-align: center; padding: 1rem; font-size: 0.75rem; color: #9ca3af;">
      <a href="https://surfing.salty.vip/" style="color: inherit; text-decoration: none;">Surfing Cheatsheets</a>
      {{#if pdfUrl}} | <a href="{{pdfUrl}}" style="color: inherit; text-decoration: none;">📄 PDF</a>
      {{/if}}
    </footer>
  </body>
</html>
```

---

## 🔧 **Step-by-Step Workflow**

### **Step 1: Load and Analyze**

1. Read the cached HTML file from `src/content/cheatsheets/en/<filename>.html`
2. Extract all content sections
3. Identify user custom styles (preserve with highest priority)
4. Analyze section sizes and content density

### **Step 2: Content Optimization**

1. Review and refine code examples for accuracy
2. Improve explanations for clarity and conciseness
3. Standardize formatting and terminology
4. Ensure code examples fit within column width (no horizontal scroll)

### **Step 3: Layout Balancing**

1. Calculate visual weight of each section
2. Apply column balancing algorithm to minimize height variance
3. Distribute sections across columns optimally
4. Verify responsive behavior (1-4 columns based on viewport)

### **Step 4: Generate Optimized HTML**

1. Apply the HTML structure template
2. Embed user custom styles with highest priority
3. Insert balanced sections into the grid
4. Remove all navigation elements (TOC, sidebar, etc.)

### **Step 5: Preview with Playwright**

1. Use MCP Playwright to open the refined HTML
2. Take a screenshot for visual verification
3. Wait for user approval before proceeding

---

## ✅ **Quality Checklist**

Before finishing, verify:

- [ ] **Tech Stack**: Primarily uses Tailwind CSS and built-in resources
- [ ] **External Dependencies**: ≤ 2 external CDN resources (if any)
- [ ] **Conversion**: Bootstrap/custom CSS converted to Tailwind where possible
- [ ] All content visible in single page view (no pagination)
- [ ] No horizontal scrolling in any code block
- [ ] Column heights are balanced (variance < 15%)
- [ ] User custom styles preserved and functional
- [ ] Navigation elements completely removed
- [ ] Code examples are syntactically correct
- [ ] Mobile responsive without content loss
- [ ] Minimal header with title and emoji
- [ ] Footer includes Surfing link (and PDF if available)

---

## 🎯 **Success Criteria**

**Essential Requirements**:

- ✓ Single page contains all content
- ✓ No horizontal scrolling
- ✓ Balanced columns (< 15% variance)
- ✓ User styles preserved
- ✓ Clean, professional appearance

**Performance Targets**:

- Information density: > 80% screen utilization
- Quick scan time: < 3 seconds to find any topic
- Print/PDF ready: Clean single-page output

---

## 📝 **Important Notes**

1. **DO NOT** execute external commands or scripts
2. **DO NOT** call html2pdf or postsurfing directly
3. **FOCUS** on content quality and layout optimization only
4. **PRESERVE** user custom CSS with absolute priority
5. **REMOVE** all navigation elements completely
6. **USE** Playwright MCP to preview the refined HTML for user approval

---

## 🚀 **Next Steps After Completion**

After you've optimized the HTML and received user approval:

1. User will manually call `html2pdf` if PDF is needed
2. User will run `./scripts/postprocess-cheatsheets.sh` to publish
3. No further action required from the AI assistant

---

This prompt focuses purely on content refinement and layout optimization, avoiding any external command executions that would require permissions.
