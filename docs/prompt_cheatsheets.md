# 📚 Cheatsheet Content Optimization Prompt

## 🎯 **Mission**

Refine and optimize HTML cheatsheet content for high-quality display, **while preserving the original layout structure and CSS**.

---

## ⚠️ **CRITICAL: Layout Preservation**

**DO NOT modify the HTML structure or CSS layout if the original is already well-designed:**

- ✅ **PRESERVE** original grid layouts (`grid-template-columns`, container structure)
- ✅ **PRESERVE** original class names (`.container`, `.column`, `.code-section`, etc.)
- ✅ **PRESERVE** original CSS styles that define the layout
- ✅ **PRESERVE** the number of columns as defined in the original
- ❌ **DO NOT** convert to responsive grids if original uses fixed columns
- ❌ **DO NOT** rename classes or restructure HTML
- ❌ **DO NOT** change grid column counts

**Why**: The original HTML was carefully designed for optimal print/PDF layout. Changing the structure breaks the visual balance.

---

## 📋 **What You Should Optimize**

### 1. **Content Quality** ✅

- Fix typos and syntax errors in code examples
- Improve clarity of explanations
- Standardize terminology and formatting
- Ensure code examples are correct and follow best practices

### 2. **Code Readability** ✅

- Adjust line breaks in code for better readability
- Ensure no horizontal scrolling needed
- Format code consistently

### 3. **Visual Polish** ✅

- Remove any navigation elements (`<nav>`, `.toc`, `.menu`, etc.)
- Ensure consistent spacing and alignment
- Polish typography and colors

### 4. **Column Balancing** (Optional, only if needed)

- **Only** redistribute sections if columns are severely unbalanced (>30% difference)
- Keep the same number of columns as original
- Use the same class names as original

---

## 🔧 **Step-by-Step Workflow**

### **Step 1: Load and Analyze**

1. Read the HTML file from the provided path
2. **Identify the original layout structure**:
   - What grid system? (`.container` with 4 columns? `.cheat-grid`?)
   - What class names are used?
   - How many columns?
   - Is it fixed or responsive?
3. **Preserve this structure exactly**

### **Step 2: Content Refinement Only**

1. Review code examples for correctness
2. Fix any typos or formatting issues
3. Improve explanations for clarity
4. **DO NOT touch HTML structure or CSS layout**

### **Step 3: Light Visual Polish**

1. Remove navigation elements if present
2. Ensure consistent spacing
3. **DO NOT modify grid/layout CSS**

### **Step 4: Write Refined HTML**

1. **Use the exact same HTML structure as input**
2. **Use the exact same class names as input**
3. **Use the exact same CSS grid definition as input**
4. Only modify:
   - Content text
   - Code examples
   - Minor styling (colors, fonts)

### **Step 5: Preview with Playwright**

1. Use MCP Playwright to open: `file:///tmp/cheatsheets-working/<filename>`
2. Take a screenshot
3. Wait for user approval

---

## ✅ **Quality Checklist**

Before finishing:

- [ ] HTML structure matches original (same container classes)
- [ ] CSS grid definition matches original (same column count)
- [ ] Class names match original exactly
- [ ] Content is refined and error-free
- [ ] No navigation elements remain
- [ ] No horizontal scrolling in code blocks
- [ ] Screenshot shows proper 4-column layout (if original had 4)

---

## 🚨 **Common Mistakes to Avoid**

1. ❌ Converting `.container` to `.cheat-grid`
2. ❌ Changing `grid-template-columns: repeat(4, 1fr)` to `repeat(3, 1fr)`
3. ❌ Renaming `.column` to `.space-y-3`
4. ❌ Adding responsive media queries when original used fixed layout
5. ❌ Completely rewriting the CSS structure

**Remember**: You are **refining content**, not **redesigning the layout**.

---

## 📝 **Example: What to Preserve**

If the original has:

```html
<style>
  .container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 10px;
  }
  .column {
    background: white;
    padding: 6px;
  }
</style>

<body>
  <div class="container">
    <div class="column"><!-- content --></div>
    <div class="column"><!-- content --></div>
    <div class="column"><!-- content --></div>
    <div class="column"><!-- content --></div>
  </div>
</body>
```

**✅ CORRECT**: Keep this structure exactly
**❌ WRONG**: Change to `.cheat-grid` with 3 columns

---

## 🎯 **Your Primary Focus**

1. **Content quality** (fix code, improve text)
2. **Visual polish** (remove nav, fix spacing)
3. **Layout preservation** (don't touch structure)

That's it! Keep it simple. Don't redesign what's already working.
