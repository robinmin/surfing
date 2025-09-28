---
title: "Example Full HTML Document"
description: "A demonstration of how to include full HTML content with custom CSS and JavaScript in Surfing"
slug: "example-full-html"
publishDate: 2024-01-15
tags: ["example", "html", "css", "javascript", "demo"]
category: "documentation"
author: "Surfing Team"
contentType: "page"
featured: true
preserveStyles: true
customCSS: |
  .custom-banner {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem;
    border-radius: 12px;
    margin: 2rem 0;
    text-align: center;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  }
  
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin: 2rem 0;
  }
  
  .feature-card {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 1.5rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .feature-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  
  .code-snippet {
    background: #2d3748;
    color: #e2e8f0;
    padding: 1rem;
    border-radius: 6px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    overflow-x: auto;
    margin: 1rem 0;
  }
  
  .highlight {
    background: #fef3cd;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    border-left: 4px solid #ffc107;
  }
  
  @media (prefers-color-scheme: dark) {
    .feature-card {
      background: #374151;
      border-color: #4b5563;
      color: #f9fafb;
    }
    
    .highlight {
      background: #451a03;
      color: #fbbf24;
      border-left-color: #f59e0b;
    }
  }
customJS: |
  // Interactive demo functionality
  document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers to feature cards
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach(card => {
      card.addEventListener('click', function() {
        this.style.background = this.style.background === 'rgb(59, 130, 246)' ? '' : '#3b82f6';
        this.style.color = this.style.color === 'white' ? '' : 'white';
      });
    });
    
    // Add a dynamic timestamp
    const timestampEl = document.getElementById('dynamic-timestamp');
    if (timestampEl) {
      timestampEl.textContent = new Date().toLocaleString();
    }
    
    // Simple animation for the banner
    const banner = document.querySelector('.custom-banner');
    if (banner) {
      banner.style.opacity = '0';
      banner.style.transform = 'translateY(20px)';
      setTimeout(() => {
        banner.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        banner.style.opacity = '1';
        banner.style.transform = 'translateY(0)';
      }, 100);
    }
  });
---

<div class="custom-banner">
  <h2>🎉 Welcome to Full HTML Support!</h2>
  <p>This document demonstrates how to include complete HTML content with custom CSS and JavaScript in your Surfing site.</p>
</div>

<div class="content-section">
  <h3>What This Demonstrates</h3>
  <p>This example shows how you can migrate existing HTML content that relies on:</p>
  
  <ul>
    <li><span class="highlight">Custom CSS styling</span> - Preserved exactly as written</li>
    <li><span class="highlight">JavaScript functionality</span> - Interactive elements work perfectly</li>
    <li><span class="highlight">Complex layouts</span> - Grid systems and responsive design</li>
    <li><span class="highlight">Legacy content</span> - Existing HTML from other systems</li>
  </ul>
</div>

<div class="feature-grid">
  <div class="feature-card">
    <h4>🎨 Custom Styling</h4>
    <p>Your existing CSS is preserved and scoped properly. Click this card to see interactive styling!</p>
  </div>
  
  <div class="feature-card">
    <h4>⚡ JavaScript Support</h4>
    <p>Custom JavaScript runs safely within the Astro framework. Try clicking the cards!</p>
  </div>
  
  <div class="feature-card">
    <h4>📱 Responsive Design</h4>
    <p>Your responsive layouts continue to work, including dark mode compatibility.</p>
  </div>
  
  <div class="feature-card">
    <h4>🔗 Integration</h4>
    <p>HTML documents integrate seamlessly with Surfing's content management and discovery systems.</p>
  </div>
</div>

<div class="content-section">
  <h3>Code Example</h3>
  <p>Here's how the frontmatter for this document looks:</p>
  
  <div class="code-snippet">---
title: "Example Full HTML Document"
description: "A demonstration of how to include full HTML content..."
publishDate: 2024-01-15
tags: ["example", "html", "css", "javascript"]
preserveStyles: true
customCSS: |
  .custom-banner {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    /* ... more CSS ... */
  }
customJS: |
  document.addEventListener('DOMContentLoaded', function() {
    // Your JavaScript here
  });
---

&lt;div class="custom-banner"&gt;
  &lt;h2&gt;Your HTML content here&lt;/h2&gt;
&lt;/div&gt;</div>
</div>

<div class="content-section">
  <h3>Dynamic Content</h3>
  <p>JavaScript can create dynamic content. Current timestamp: <strong id="dynamic-timestamp">Loading...</strong></p>
  
  <p>This demonstrates that your existing HTML applications, widgets, and interactive content can be preserved exactly as they were, while benefiting from Surfing's:</p>
  
  <ul>
    <li>Content management and organization</li>
    <li>Search and discovery features</li>
    <li>RSS feeds and syndication</li>
    <li>SEO optimization</li>
    <li>Modern deployment pipeline</li>
  </ul>
</div>

<div class="content-section">
  <h3>Migration Tips</h3>
  
  <div class="highlight">
    <strong>Pro Tip:</strong> When migrating existing HTML content, you can:
  </div>
  
  <ol>
    <li>Copy your existing HTML file to <code>src/content/documents/</code></li>
    <li>Add frontmatter at the top with title, description, and metadata</li>
    <li>Move CSS from <code>&lt;style&gt;</code> tags to the <code>customCSS</code> frontmatter field</li>
    <li>Move JavaScript from <code>&lt;script&gt;</code> tags to the <code>customJS</code> frontmatter field</li>
    <li>Set <code>preserveStyles: true</code> to maintain your original styling</li>
    <li>Use <code>.md</code> extension for better Astro compatibility</li>
  </ol>
</div>
