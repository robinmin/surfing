---
title: 'Color Gradient Generator'
description: 'Interactive color gradient generator with live preview and CSS export. Create smooth color transitions with customizable segments.'
image: '@assets/images/gradient-gen-logo.png'
publishDate: 2025-10-05
tags: ['showcase', 'tools', 'web', 'programming']
readingTime: 1
wordCount: 16
draft: false
featured: false
customCSS: |
  * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }
          
          body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              background: #ffffff;
              min-height: 100vh;
              padding: 40px 20px;
          }
          
          .container {
              max-width: 900px;
              margin: 0 auto;
          }

          .container h1 {
              text-align: center;
              color: #333;
              margin-bottom: 30px;
              font-size: 42px;
              font-weight: bold;
          }
          
          .controls {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 12px;
              margin-bottom: 30px;
              display: flex;
              gap: 15px;
              align-items: flex-end;
          }
          
          .color-input-group {
              flex: 1;
          }
          
          .color-input-group label {
              display: block;
              font-size: 13px;
              color: #333;
              margin-bottom: 6px;
              font-weight: bold;
          }
          
          .color-picker-row {
              display: flex;
              align-items: center;
              gap: 8px;
          }
          
          input[type="color"] {
              width: 50px;
              height: 38px;
              border: 2px solid #ddd;
              border-radius: 6px;
              cursor: pointer;
          }
          
          .hex-input {
              flex: 1;
          }
          
          .hex-input input {
              width: 100%;
              padding: 8px 10px;
              border: 2px solid #ddd;
              border-radius: 6px;
              font-size: 14px;
              font-family: 'Courier New', monospace;
              text-transform: uppercase;
          }
          
          .segments-control {
              width: 140px;
          }
          
          .segments-control label {
              display: block;
              margin-bottom: 6px;
              color: #333;
              font-size: 13px;
              font-weight: bold;
          }
          
          .segments-control input {
              width: 100%;
              padding: 8px 10px;
              border: 2px solid #ddd;
              border-radius: 6px;
              font-size: 14px;
              text-align: right;
          }
          
          .generate-btn {
              padding: 8px 24px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border: none;
              border-radius: 6px;
              font-size: 14px;
              font-weight: 600;
              cursor: pointer;
              transition: transform 0.2s;
              white-space: nowrap;
              height: 38px;
          }
          
          .generate-btn:hover {
              transform: translateY(-2px);
          }
          
          .results {
              margin-top: 30px;
          }
          
          .color-blocks {
              display: flex;
              flex-wrap: wrap;
              gap: 20px;
              margin-bottom: 30px;
          }
          
          .color-block-wrapper {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 8px;
          }
          
          .color-block {
              width: 50px;
              height: 38px;
              border-radius: 6px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              transition: transform 0.2s;
          }
          
          .color-block:hover {
              transform: scale(1.05);
          }
          
          .color-label {
              font-size: 14px;
              font-weight: 600;
              color: #333;
              font-family: 'Courier New', monospace;
          }
          
          .css-output {
              background: #1e1e1e;
              color: #d4d4d4;
              padding: 20px;
              border-radius: 12px;
              overflow-x: auto;
              position: relative;
          }
          
          .css-output h3 {
              color: #fff;
              margin-bottom: 15px;
              padding-right: 40px;
              font-size: 16px;
          }
          
          .css-output pre {
              font-family: 'Courier New', monospace;
              font-size: 13px;
              line-height: 1.6;
              white-space: pre-wrap;
              margin: 0;
          }
          
          .copy-btn {
              position: absolute;
              top: 20px;
              right: 20px;
              padding: 6px;
              background: transparent;
              color: #d4d4d4;
              border: 1px solid #555;
              border-radius: 6px;
              cursor: pointer;
              transition: all 0.2s;
              width: 32px;
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
          }
          
          .copy-btn:hover {
              background: #2d2d2d;
              border-color: #777;
          }
          
          .copy-btn.copied {
              background: #4CAF50;
              border-color: #4CAF50;
          }
          
          .copy-btn svg {
              width: 20px;
              height: 20px;
              stroke: currentColor;
              stroke-width: 2;
              stroke-linecap: round;
              stroke-linejoin: round;
              fill: none;
          }
customJS: |
  const elements = {
              fromPicker: document.getElementById('fromColorPicker'),
              toPicker: document.getElementById('toColorPicker'),
              fromHex: document.getElementById('fromHex'),
              toHex: document.getElementById('toHex'),
              segments: document.getElementById('segments'),
              results: document.getElementById('results'),
              colorBlocks: document.getElementById('colorBlocks'),
              cssOutput: document.getElementById('cssOutput'),
              copyBtn: document.querySelector('.copy-btn'),
              copyIcon: document.getElementById('copyIcon')
          };
          
          function hexToRgb(hex) {
              const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
              return result ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16)
              } : null;
          }
          
          function rgbToHex(r, g, b) {
              return "#" + [r, g, b].map(x => {
                  const hex = parseInt(x).toString(16);
                  return hex.length === 1 ? "0" + hex : hex;
              }).join('');
          }
          
          function isValidHex(hex) {
              return /^#?[0-9A-Fa-f]{6}$/.test(hex);
          }
          
          function normalizeHex(hex) {
              hex = hex.trim().toUpperCase();
              if (!hex.startsWith('#')) {
                  hex = '#' + hex;
              }
              return hex;
          }
          
          function getBrightness(color) {
              return (color.r * 299 + color.g * 587 + color.b * 114) / 1000;
          }
          
          function syncPickerToHex(picker, hexInput) {
              picker.addEventListener('input', (e) => {
                  hexInput.value = e.target.value.toUpperCase();
              });
          }
          
          function syncHexToPicker(hexInput, picker) {
              hexInput.addEventListener('input', (e) => {
                  const val = normalizeHex(e.target.value);
                  if (isValidHex(val)) {
                      picker.value = val;
                      e.target.style.borderColor = '#ddd';
                  } else {
                      e.target.style.borderColor = '#ff4444';
                  }
              });
          }
          
          syncPickerToHex(elements.fromPicker, elements.fromHex);
          syncPickerToHex(elements.toPicker, elements.toHex);
          syncHexToPicker(elements.fromHex, elements.fromPicker);
          syncHexToPicker(elements.toHex, elements.toPicker);
          
          function generateGradient() {
              const hex1 = normalizeHex(elements.fromHex.value);
              const hex2 = normalizeHex(elements.toHex.value);
              
              if (!isValidHex(hex1) || !isValidHex(hex2)) {
                  alert('Please enter valid hex color codes (e.g., #FF0000 or FF0000)');
                  return;
              }
              
              const rgb1 = hexToRgb(hex1);
              const rgb2 = hexToRgb(hex2);
              const segments = parseInt(elements.segments.value);
              
              const colors = [];
              for (let i = 0; i < segments; i++) {
                  const t = segments === 1 ? 0 : i / (segments - 1);
                  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * t);
                  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * t);
                  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * t);
                  const hex = rgbToHex(r, g, b).toUpperCase();
                  colors.push({ r, g, b, hex });
              }
              
              displayResults(colors);
          }
          
          function displayResults(colors) {
              elements.results.style.display = 'block';
              elements.colorBlocks.innerHTML = '';
              
              let cssText = '';
              
              colors.forEach((color, i) => {
                  const wrapper = document.createElement('div');
                  wrapper.className = 'color-block-wrapper';
                  
                  const block = document.createElement('div');
                  block.className = 'color-block';
                  block.style.backgroundColor = color.hex;
                  
                  const label = document.createElement('div');
                  label.className = 'color-label';
                  label.textContent = color.hex;
                  
                  wrapper.appendChild(block);
                  wrapper.appendChild(label);
                  elements.colorBlocks.appendChild(wrapper);
                  
                  cssText += `.gradient-color-${i + 1} { background-color: ${color.hex}; }\n`;
              });

              elements.cssOutput.innerHTML = cssText.replace(/(\.[a-z-]+)|(\{)|(\})|([#A-F0-9]{7})/g, (m, sel, open, close, hex) =>
                  sel ? `<span style="color:#569cd6">${sel}</span>` :
                  hex ? `<span style="color:#ce9178">${hex}</span>` :
                  open || close ? `<span style="color:#ffd700">${m}</span>` : m);
          }
          
          function copyCss() {
              const cssText = elements.cssOutput.textContent;
              
              navigator.clipboard.writeText(cssText).then(() => {
                  elements.copyBtn.classList.add('copied');
                  elements.copyIcon.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
                  
                  setTimeout(() => {
                      elements.copyBtn.classList.remove('copied');
                      elements.copyIcon.innerHTML = '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>';
                  }, 2000);
              });
          }
---

<div class="container">
    <h1>🎨 Color Gradient Generator</h1>
    
    <div class="controls">
        <div class="color-input-group">
            <label>From Color</label>
            <div class="color-picker-row">
                <input type="color" id="fromColorPicker" value="#000000">
                <div class="hex-input">
                    <input type="text" id="fromHex" value="#000000" placeholder="#000000" maxlength="7">
                </div>
            </div>
        </div>

        <div class="color-input-group">
            <label>To Color</label>
            <div class="color-picker-row">
                <input type="color" id="toColorPicker" value="#ffffff">
                <div class="hex-input">
                    <input type="text" id="toHex" value="#FFFFFF" placeholder="#FFFFFF" maxlength="7">
                </div>
            </div>
        </div>

        <div class="segments-control">
            <label>Transition Colors</label>
            <input type="number" id="segments" min="1" max="99999" value="12" maxlength="5">
        </div>

        <button class="generate-btn" onclick="generateGradient()">Generate</button>
    </div>

    <div class="results" id="results" style="display:none;">
        <div class="color-blocks" id="colorBlocks"></div>

        <div class="css-output">
            <h3>CSS Classes</h3>
            <button class="copy-btn" onclick="copyCss()" title="Copy CSS">
                <svg id="copyIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
            </button>
            <pre id="cssOutput"></pre>
        </div>
    </div>

</div>
