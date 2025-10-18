---
title: 'Advanced Color Gradient Generator & Palette Creator - Free Online Tool'
description: 'Professional color gradient generator and palette creator with RGB, HSL, HSV, CMYK support. Create stunning gradients, color harmonies, and data visualization palettes with instant CSS export. Perfect for designers and developers.'
image: '@assets/images/gradient-gen-logo-og.png'
publishDate: 2025-10-05
tags:
  [
    'color-generator',
    'gradient-tool',
    'palette-creator',
    'web-design',
    'css-tools',
    'color-theory',
    'ui-design',
    'frontend',
    'design-tools',
    'color-palettes',
  ]
readingTime: 3
wordCount: 485
draft: false
featured: true
metadata:
  title: 'Free Color Gradient Generator & Palette Creator | RGB HSL HSV CMYK'
  description: 'Create beautiful color gradients and palettes with our advanced generator. Supports RGB, HSL, HSV, CMYK, color harmonies, and data visualization palettes. Export to CSS instantly. Free online tool for web designers and developers.'
  keywords: 'color gradient generator, palette creator, RGB HSL HSV CMYK, color harmonies, data visualization palettes, CSS gradient generator, online color tool, web design colors, frontend color palette, color scheme generator'
  openGraph:
    siteName: 'Surfing'
    type: 'website'
    locale: 'en_US'
    url: 'https://surfing.dev/showcase/en/color-gradient-gen'
  twitter:
    cardType: 'summary_large_image'
    site: '@surfing_dev'
    creator: '@surfing_dev'
  robots:
    index: true
    follow: true
  canonical: 'https://surfing.dev/showcase/en/color-gradient-gen'
  author: 'Surfing Team'
  category: 'Design Tools'
  language: 'en'
  alternate:
    - hreflang: 'en'
      href: 'https://surfing.dev/showcase/en/color-gradient-gen'
  schema:
    '@context': 'https://schema.org'
    '@type': 'WebApplication'
    name: 'Advanced Color Gradient Generator'
    description: 'Professional color gradient generator and palette creator with multiple color modes'
    url: 'https://surfing.dev/showcase/en/color-gradient-gen'
    applicationCategory: 'DesignApplication'
    operatingSystem: 'Any'
    offers:
      '@type': 'Offer'
      price: '0'
      priceCurrency: 'USD'
    creator:
      '@type': 'Organization'
      name: 'Surfing'
    featureList:
      - 'RGB gradient generation'
      - 'HSL color palettes'
      - 'HSV color schemes'
      - 'CMYK print-ready colors'
      - 'Color harmonies (analogous, complementary, triadic, tetradic)'
      - 'Data visualization palettes (sequential, diverging, qualitative)'
      - 'Live preview'
      - 'CSS export'
      - 'Custom class prefixes'
      - 'Color blindness simulation'
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
      padding: 20px 15px;
  }

  .container {
      max-width: 1050px;
      margin: 0 auto;
  }

  .container h1 {
      text-align: center;
      color: #1f2937;
      margin-bottom: 24px;
      font-size: 28px;
      font-weight: 700;
  }

  @media (min-width: 768px) {
      body {
          padding: 40px 20px;
      }

      .container h1 {
          font-size: 42px;
          margin-bottom: 36px;
      }
  }

  .tab-container {
      padding: 24px 18px;
  }

  @media (min-width: 768px) {
      .tab-container {
          padding: 32px 26px;
      }
  }

  .tab-buttons {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 12px;
  }

  .prefix-control {
      display: flex;
      flex-direction: column;
      gap: 6px;
  }

  .prefix-control label {
      font-size: 12px;
      color: #374151;
      font-weight: 600;
  }

  .prefix-control .field-input {
      max-width: 220px;
      font-family: 'Courier New', monospace;
  }

  .tab-button {
      flex: 1;
      min-width: 140px;
      background: #f3f4f6;
      border: 1px solid transparent;
      border-radius: 12px;
      padding: 12px 18px;
      font-size: 15px;
      font-weight: 600;
      color: #374151;
      cursor: pointer;
      transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  }

  .tab-button:hover {
      background: #e5e7eb;
  }

  .tab-button.active {
      background: #f97316;
      color: #fff;
      border-color: #ea580c;
  }

  .tab-panel {
      display: none;
      animation: fadeIn 0.25s ease;
  }

  .tab-panel.active {
      display: block;
  }

  .controls.grid-auto {
       margin-bottom: 24px;
       display: flex !important;
       flex-wrap: wrap;
       gap: 18px;
       justify-content: flex-start;
       align-items: flex-end;
       align-content: flex-start;
       padding: 20px;
  }

  .controls.tone-controls .preview-control,
  .controls.tone-controls .slider-control,
  .controls.tone-controls .cmyk-control,
  .controls.tone-controls .select-control {
      display: flex;
      flex-direction: column;
      gap: 8px;
  }

  .color-input-group,
  .segments-control,
  .slider-control,
  .preview-control,
  .cmyk-control,
  .select-control {
      min-width: 240px;
      flex: 0 0 auto;
      align-items: flex-start;
  }

  @media (min-width: 768px) {
      .color-input-group,
      .segments-control,
      .slider-control,
      .preview-control,
      .cmyk-control,
      .select-control {
          flex: 0 0 auto;
      }
  }

  @media (max-width: 767px) {
      .color-input-group,
      .segments-control,
      .slider-control,
      .preview-control,
      .cmyk-control,
      .select-control {
          min-width: 100%;
          flex: 1 1 100%;
      }
  }

  .segments-control {
      display: flex;
      flex-direction: column;
      gap: 8px;
  }

  .prefix-control {
      display: flex;
      flex-direction: column;
      gap: 8px;
  }

  .prefix-control .field-input {
      width: 100%;
  }

  .color-input-group label,
  .segments-control label,
  .slider-control label,
  .preview-control label,
  .cmyk-control label,
  .select-control label {
      font-size: 13px;
      color: #374151;
      font-weight: 600;
      display: block;
      margin-bottom: 8px;
      text-align: left;
  }

  .color-picker-row,
  .slider-row {
      display: grid;
      gap: 12px;
      align-items: center;
  }

  .color-picker-row {
      grid-template-columns: auto 1fr;
  }

  .slider-row {
      grid-template-columns: 1fr auto;
      align-items: center;
  }

  .slider-control {
      display: flex;
      flex-direction: column;
      gap: 8px;
  }

  .slider-control .slider-row {
      display: grid;
      grid-template-columns: 1fr 65px;
      gap: 12px;
      align-items: center;
  }

  .preview-control .color-picker-row {
      display: grid;
      grid-template-columns: 40px 1fr;
      gap: 12px;
      align-items: center;
  }

  .preview-control .hex-input,
  .preview-control .rgb-input {
      display: block;
  }

  .cmyk-row {
      display: grid;
      grid-template-columns: minmax(150px, 1fr) auto;
      gap: 12px;
      align-items: center;
  }

  @media (min-width: 768px) {
      .controls {
          gap: 24px;
      }

      .color-picker-row {
          grid-template-columns: auto minmax(200px, 1fr);
      }

      .slider-row {
          grid-template-columns: minmax(200px, 1fr) auto;
      }

      .cmyk-row {
          grid-template-columns: minmax(200px, 1fr) auto;
      }
  }

  @media (min-width: 1024px) {
      .controls {
          gap: 30px;
      }
  }

  input[type="color"] {
      width: 40px;
      height: 40px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      cursor: pointer;
      background: transparent;
  }

  .hex-input {
      display: flex;
      justify-content: flex-start;
      align-items: center;
  }

  .hex-input .field-input {
      text-transform: uppercase;
      padding: 9px 12px;
  }

  .select-control select {
      width: 100%;
      padding: 10px 12px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      color: #1f2937;
      background: #fff;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .select-control select:focus {
      border-color: #4338ca;
      box-shadow: 0 0 0 2px rgba(67, 56, 202, 0.2);
  }

  .hsl-controls .field-range {
      max-width: none;
  }

  .preview-picker {
      position: relative;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      overflow: hidden;
      display: inline-flex;
      align-items: center;
      justify-content: center;
  }

  .preview-chip {
      width: 100%;
      height: 100%;
      border-radius: 8px;
      border: 2px solid rgba(15, 23, 42, 0.08);
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.25);
  }

  .preview-picker input[type="color"] {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
  }

  .results {
      margin-top: 30px;
  }

  .color-blocks {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 22px;
      justify-content: center;
  }

  @media (min-width: 768px) {
      .color-blocks {
          gap: 18px;
          justify-content: flex-start;
      }
  }

  .color-block-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      max-width: 140px;
      text-align: center;
  }

  .color-block {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.12);
      transition: transform 0.2s ease, box-shadow 0.2s ease, border 0.2s ease, color 0.2s ease;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: transparent;
      font-size: 20px;
      font-weight: 700;
  }

  .color-block:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 18px rgba(15, 23, 42, 0.22);
  }

  .color-block.copied {
      box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.45);
      color: #ffffff;
  }

  .color-label {
      font-size: 11px;
      font-weight: 600;
      color: #1f2937;
      font-family: 'Courier New', monospace;
      cursor: pointer;
  }

  .color-note {
      font-size: 11px;
      color: #4b5563;
      line-height: 1.4;
  }

  .css-output {
      background: #1e1e1e;
      color: #d4d4d4;
      padding: 18px;
      border-radius: 12px;
      overflow-x: auto;
      position: relative;
  }

  @media (min-width: 768px) {
      .css-output {
          padding: 22px;
      }
  }

  .css-output h3 {
      color: #fff;
      margin-bottom: 12px;
      padding-right: 45px;
      font-size: 14px;
  }

  @media (min-width: 768px) {
      .css-output h3 {
          margin-bottom: 16px;
          font-size: 16px;
      }
  }

  .css-output pre {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.6;
      white-space: pre;
      margin: 0;
  }

  .copy-btn {
      position: absolute;
      top: 15px;
      right: 15px;
      padding: 6px !important;
      background: rgba(0, 0, 0, 0.6);
      color: #8f8f8f;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.9;
  }

  @media (min-width: 768px) {
      .copy-btn {
          top: 20px;
          right: 20px;
          width: 34px;
          height: 34px;
      }
  }

  .copy-btn:hover {
      background: rgba(0, 0, 0, 0.8);
      border-color: rgba(255, 255, 255, 0.4);
      opacity: 1;
      transform: scale(1.05);
  }

  .copy-btn.copied {
      background: #22c55e;
      border-color: #22c55e;
      color: #fff;
  }

  .copy-btn svg {
      width: 16px;
      height: 16px;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      fill: none;
  }

  @media (min-width: 768px) {
      .copy-btn svg {
          width: 20px;
          height: 20px;
      }
  }

  .gamut-warning {
      display: none;
      padding: 12px 14px;
      border-radius: 10px;
      border: 1px solid rgba(251, 191, 36, 0.45);
      background: rgba(253, 230, 138, 0.45);
      color: #92400e;
      font-size: 13px;
      line-height: 1.4;
  }

  .harmony-columns {
      display: grid;
      gap: 20px;
  }

  @media (min-width: 768px) {
      .harmony-columns {
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      }
  }

  @media (min-width: 1200px) {
      .harmony-columns {
          grid-template-columns: repeat(5, minmax(180px, 1fr));
      }
  }

  .harmony-column {
      background: #f9fafb;
      border-radius: 14px;
      border: 1px solid #e5e7eb;
      padding: 18px 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
  }

  .harmony-column h3 {
      font-size: 16px;
      font-weight: 700;
      color: #1f2937;
  }

  .harmony-column h3.has-tooltip {
      position: relative;
      cursor: help;
  }

  .harmony-column h3.has-tooltip::after {
      content: attr(data-tooltip);
      position: absolute;
      top: 100%;
      left: 0;
      margin-top: 8px;
      background: #4b5563;
      color: #f9fafb;
      padding: 10px 12px;
      border-radius: 10px;
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.2);
      font-size: 12px;
      line-height: 1.4;
      width: 220px;
      white-space: pre-wrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
      z-index: 10;
  }

  .harmony-column h3.has-tooltip:hover::after,
  .harmony-column h3.has-tooltip:focus-visible::after {
      opacity: 1;
  }

  .data-viz-column h3.has-tooltip {
      position: relative;
      cursor: help;
  }

  .data-viz-column h3.has-tooltip::after {
      content: attr(data-tooltip);
      position: absolute;
      top: 100%;
      left: 0;
      margin-top: 8px;
      background: #4b5563;
      color: #f9fafb;
      padding: 10px 12px;
      border-radius: 10px;
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.2);
      font-size: 12px;
      line-height: 1.4;
      width: 220px;
      white-space: pre-wrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
      z-index: 10;
  }

  .data-viz-column h3.has-tooltip:hover::after,
  .data-viz-column h3.has-tooltip:focus-visible::after {
      opacity: 1;
  }

  .data-viz-columns {
      display: grid;
      gap: 20px;
  }

  @media (min-width: 768px) {
      .data-viz-columns {
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      }
  }

  @media (min-width: 1200px) {
      .data-viz-columns {
          grid-template-columns: repeat(3, minmax(240px, 1fr));
      }
  }

  .data-viz-column {
      background: #f9fafb;
      border-radius: 14px;
      border: 1px solid #e5e7eb;
      padding: 18px 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
  }

  .data-viz-column h3 {
      font-size: 16px;
      font-weight: 700;
      color: #1f2937;
  }

  .simulations {
      display: grid;
      gap: 14px;
      margin-bottom: 24px;
  }

  .simulation-row {
      border: 1px dashed #d1d5db;
      border-radius: 12px;
      background: #f9fafb;
      overflow: hidden;
  }

  .simulation-toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 12px 14px;
      background: transparent;
      border: none;
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
      cursor: pointer;
      gap: 12px;
  }

  .simulation-toggle span {
      flex: 1;
      text-align: left;
  }

  .simulation-toggle svg {
      width: 18px;
      height: 18px;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      fill: none;
      transition: transform 0.2s ease;
  }

  .simulation-content {
      padding: 0 14px 14px;
  }

  .simulation-row[data-collapsed="true"] .simulation-content {
      display: none;
  }

  .simulation-row[data-collapsed="true"] .simulation-toggle svg {
      transform: rotate(-90deg);
  }

  .simulation-blocks {
      justify-content: flex-start;
  }

  @media (max-width: 640px) {
      .tab-buttons {
          flex-direction: column;
          gap: 16px;
      }

      .tab-button {
          width: 100%;
          min-width: 0;
      }

      .controls {
          padding: 20px 18px;
          gap: 16px;
          flex-direction: column;
      }

      .controls.compact-grid,
      .controls.tone-controls {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
      }

      .color-input-group,
      .segments-control,
      .slider-control,
      .preview-control,
      .cmyk-control,
      .select-control {
          min-width: auto;
          flex: none;
      }

      .color-picker-row,
      .slider-row,
      .cmyk-row {
          grid-template-columns: 1fr;
          justify-items: stretch;
          row-gap: 14px;
          gap: 14px;
      }

      .color-picker-row input[type="color"] {
          justify-self: start;
      }

      .hex-input input,
      .rgb-input input,
      .slider-row input[type="number"],
      .segments-control input[type="number"],
      .cmyk-row input[type="number"] {
          max-width: 100%;
      }

      .color-blocks {
          justify-content: center;
      }

      .prefix-control input {
          max-width: 100%;
      }
  }

  @keyframes fadeIn {
      from {
          opacity: 0;
          transform: translateY(6px);
      }
      to {
          opacity: 1;
          transform: translateY(0);
      }
  }
  .surface-card {
      background: #ffffff;
      border-radius: 16px;
      border: 1px solid rgba(15, 23, 42, 0.08);
      box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12);
  }

  .stack {
      display: flex;
      flex-direction: column;
      gap: var(--stack-gap, 18px);
  }

  .grid-auto {
      display: grid;
      gap: var(--grid-gap, 18px);
      grid-template-columns: repeat(auto-fit, minmax(var(--grid-min, 220px), 1fr));
      align-items: var(--grid-align, start);
  }

  .field-input {
      width: 100%;
      padding: 10px 12px;
      border: 2px solid #e5e7eb;
      border-radius: 10px;
      font-size: 14px;
      font-family: inherit;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .field-input:focus {
      border-color: #4338ca;
      box-shadow: 0 0 0 2px rgba(67, 56, 202, 0.2);
      outline: none;
  }

  .field-input.is-error {
      border-color: #f87171;
      box-shadow: 0 0 0 2px rgba(248, 113, 113, 0.2);
  }

  .field-range {
      width: 100%;
      accent-color: #4338ca;
      height: 6px;
      border-radius: 999px;
      background: linear-gradient(90deg, rgba(67, 56, 202, 0.25), rgba(67, 56, 202, 0.65));
  }

  .hex-input .field-input,
  .rgb-input .field-input,
  .segments-control .field-input,
  .slider-row .field-input,
  .cmyk-row .field-input {
      min-width: 72px;
      width: 100%;
  }

  .slider-control input[type="range"] {
      width: 240px !important;
      max-width: none;
  }

  .cmyk-control input[type="range"] {
      width: 240px !important;
      max-width: none;
  }

  .slider-control input[type="number"] {
      width: 65px;
      flex-shrink: 0;
  }

  @media (min-width: 768px) {
      .hex-input .field-input,
      .rgb-input .field-input,
      .segments-control .field-input,
      .slider-row .field-input,
      .cmyk-row .field-input {
          max-width: 160px;
      }

      .slider-control input[type="range"] {
          width: 240px !important;
      }

      .cmyk-control input[type="range"] {
          width: 240px !important;
      }
  }

  @media (max-width: 767px) {
      .slider-control input[type="range"] {
          width: 220px !important;
      }

      .cmyk-control input[type="range"] {
          width: 220px !important;
      }
  }

  .hex-input .field-input,
  .rgb-input .field-input,
  .prefix-control .field-input {
      font-family: 'Courier New', monospace;
  }

  .slider-row .field-input,
  .segments-control .field-input,
  .cmyk-row .field-input {
      font-family: inherit;
      justify-self: end;
  }

  .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 20px;
      font-size: 15px;
      font-weight: 600;
      border-radius: 10px;
      border: 1px solid transparent;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease;
  }

  .button:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.35);
  }

  .button--primary {
      background: #4338ca;
      color: #ffffff;
      box-shadow: 0 10px 18px rgba(67, 56, 202, 0.25);
      padding-left: 30px;
      padding-right: 30px;
  }

  .button--primary:hover {
      background: #3730a3;
      transform: translateY(-1px);
  }

  .button--ghost {
      background: transparent;
      color: #4338ca;
      border-color: rgba(67, 56, 202, 0.35);
  }

  .button--ghost:hover {
      background: rgba(67, 56, 202, 0.08);
      border-color: rgba(67, 56, 202, 0.55);
  }
customJS: |
  const clipboardSvg = '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>';
  const checkSvg = '<polyline points="20 6 9 17 4 12"></polyline>';

  // Define ColorUtilities, UiHelpers, and PaletteLogic BEFORE they're used
  const ColorUtilities = (() => {
      const clampValue = (value, min, max) => {
          if (!Number.isFinite(value)) {
              return Number.isFinite(min) ? min : 0;
          }
          const lower = Number.isFinite(min) ? min : value;
          const upper = Number.isFinite(max) ? max : value;
          return Math.min(upper, Math.max(lower, value));
      };

      const normalizeHex = (hex, fallback = '#000000') => {
          if (typeof hex !== 'string' || !hex.trim()) {
              return fallback.toUpperCase();
          }
          const trimmed = hex.trim();
          const prefixed = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
          const upper = prefixed.toUpperCase();
          return /^#?[0-9A-F]{6}$/i.test(upper) ? upper : fallback.toUpperCase();
      };

      const isValidHex = (hex) => /^#?[0-9A-Fa-f]{6}$/.test(hex || '');

      const hexToRgb = (hex) => {
          if (!isValidHex(hex)) {
              return null;
          }
          const normalised = normalizeHex(hex).replace('#', '');
          const r = parseInt(normalised.slice(0, 2), 16);
          const g = parseInt(normalised.slice(2, 4), 16);
          const b = parseInt(normalised.slice(4, 6), 16);
          return { r, g, b };
      };

      const rgbToHex = (r, g, b) => {
          const toChannel = (channel) => {
              const value = clampValue(Math.round(channel), 0, 255);
              return value.toString(16).padStart(2, '0');
          };
          return `#${toChannel(r)}${toChannel(g)}${toChannel(b)}`.toUpperCase();
      };

      const rgbToHsl = (r, g, b) => {
          const red = r / 255;
          const green = g / 255;
          const blue = b / 255;
          const max = Math.max(red, green, blue);
          const min = Math.min(red, green, blue);
          const delta = max - min;
          let hue = 0;
          let saturation = 0;
          const lightness = (max + min) / 2;

          if (delta !== 0) {
              saturation = delta / (1 - Math.abs(2 * lightness - 1));
              switch (max) {
                  case red:
                      hue = ((green - blue) / delta) % 6;
                      break;
                  case green:
                      hue = (blue - red) / delta + 2;
                      break;
                  default:
                      hue = (red - green) / delta + 4;
              }
              hue *= 60;
              if (hue < 0) {
                  hue += 360;
              }
          }

          return {
              h: Math.round(hue),
              s: Math.round((saturation || 0) * 100),
              l: Math.round(lightness * 100)
          };
      };

      const rgbToHsv = (r, g, b) => {
          const red = r / 255;
          const green = g / 255;
          const blue = b / 255;
          const max = Math.max(red, green, blue);
          const min = Math.min(red, green, blue);
          const delta = max - min;
          let hue = 0;
          let saturation = max === 0 ? 0 : delta / max;

          if (delta !== 0) {
              switch (max) {
                  case red:
                      hue = ((green - blue) / delta) % 6;
                      break;
                  case green:
                      hue = (blue - red) / delta + 2;
                      break;
                  default:
                      hue = (red - green) / delta + 4;
              }
              hue *= 60;
              if (hue < 0) {
                  hue += 360;
              }
          }

          return {
              h: Math.round(hue),
              s: Math.round((saturation || 0) * 100),
              v: Math.round(max * 100)
          };
      };

      const rgbToCmyk = (r, g, b) => {
          const red = r / 255;
          const green = g / 255;
          const blue = b / 255;
          const k = 1 - Math.max(red, green, blue);
          if (k === 1) {
              return { c: 0, m: 0, y: 0, k: 100 };
          }
          return {
              c: Math.round(((1 - red - k) / (1 - k)) * 100),
              m: Math.round(((1 - green - k) / (1 - k)) * 100),
              y: Math.round(((1 - blue - k) / (1 - k)) * 100),
              k: Math.round(k * 100)
          };
      };

      const hslToRgb = (h, s, l) => {
          const sat = s / 100;
          const light = l / 100;
          const chroma = (1 - Math.abs(2 * light - 1)) * sat;
          const huePrime = h / 60;
          const x = chroma * (1 - Math.abs((huePrime % 2) - 1));
          let r1 = 0;
          let g1 = 0;
          let b1 = 0;

          if (Number.isNaN(huePrime)) {
              r1 = g1 = b1 = 0;
          } else if (huePrime >= 0 && huePrime < 1) {
              r1 = chroma;
              g1 = x;
          } else if (huePrime < 2) {
              r1 = x;
              g1 = chroma;
          } else if (huePrime < 3) {
              g1 = chroma;
              b1 = x;
          } else if (huePrime < 4) {
              g1 = x;
              b1 = chroma;
          } else if (huePrime < 5) {
              r1 = x;
              b1 = chroma;
          } else {
              r1 = chroma;
              b1 = x;
          }

          const m = light - chroma / 2;
          return {
              r: Math.round((r1 + m) * 255),
              g: Math.round((g1 + m) * 255),
              b: Math.round((b1 + m) * 255)
          };
      };

      const hsvToRgb = (h, s, v) => {
          const sat = s / 100;
          const val = v / 100;
          const chroma = val * sat;
          const huePrime = h / 60;
          const x = chroma * (1 - Math.abs((huePrime % 2) - 1));
          let r1 = 0;
          let g1 = 0;
          let b1 = 0;

          if (Number.isNaN(huePrime)) {
              r1 = g1 = b1 = 0;
          } else if (huePrime >= 0 && huePrime < 1) {
              r1 = chroma;
              g1 = x;
          } else if (huePrime < 2) {
              r1 = x;
              g1 = chroma;
          } else if (huePrime < 3) {
              g1 = chroma;
              b1 = x;
          } else if (huePrime < 4) {
              g1 = x;
              b1 = chroma;
          } else if (huePrime < 5) {
              r1 = x;
              b1 = chroma;
          } else {
              r1 = chroma;
              b1 = x;
          }

          const m = val - chroma;
          return {
              r: Math.round((r1 + m) * 255),
              g: Math.round((g1 + m) * 255),
              b: Math.round((b1 + m) * 255)
          };
      };

      const cmykToRgb = (c, m, y, k) => {
          const cyan = c / 100;
          const magenta = m / 100;
          const yellow = y / 100;
          const key = k / 100;
          return {
              r: Math.round(255 * (1 - cyan) * (1 - key)),
              g: Math.round(255 * (1 - magenta) * (1 - key)),
              b: Math.round(255 * (1 - yellow) * (1 - key))
          };
      };

      const rotateHue = (hue, delta) => {
          const value = (hue + delta) % 360;
          return value < 0 ? value + 360 : value;
      };

      const mixHexColors = (firstHex, secondHex, amount) => {
          const start = hexToRgb(firstHex);
          const end = hexToRgb(secondHex);
          if (!start || !end) {
              return normalizeHex(firstHex);
          }
          const mix = {
              r: start.r + (end.r - start.r) * amount,
              g: start.g + (end.g - start.g) * amount,
              b: start.b + (end.b - start.b) * amount
          };
          return rgbToHex(mix.r, mix.g, mix.b);
      };

      const relativeLuminance = (r, g, b) => {
          const linearise = (value) => {
              const channel = value / 255;
              return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
          };
          return (
              0.2126 * linearise(r)
              + 0.7152 * linearise(g)
              + 0.0722 * linearise(b)
          );
      };

      const calculateContrastRatio = (firstHex, secondHex) => {
          const first = hexToRgb(firstHex);
          const second = hexToRgb(secondHex);
          if (!first || !second) {
              return 1;
          }
          const luminanceA = relativeLuminance(first.r, first.g, first.b);
          const luminanceB = relativeLuminance(second.r, second.g, second.b);
          const lighter = Math.max(luminanceA, luminanceB);
          const darker = Math.min(luminanceA, luminanceB);
          return (lighter + 0.05) / (darker + 0.05);
      };

      const simulateColorBlindness = (hex, type) => {
          const rgb = hexToRgb(hex);
          if (!rgb) {
              return normalizeHex(hex);
          }
          const matrices = {
              deuteranopia: [
                  [0.625, 0.375, 0],
                  [0.7, 0.3, 0],
                  [0, 0.3, 0.7]
              ],
              protanopia: [
                  [0.56667, 0.43333, 0],
                  [0.55833, 0.44167, 0],
                  [0, 0.24167, 0.75833]
              ],
              tritanopia: [
                  [0.95, 0.05, 0],
                  [0, 0.43333, 0.56667],
                  [0, 0.475, 0.525]
              ]
          };
          const matrix = matrices[type];
          if (!matrix) {
              return rgbToHex(rgb.r, rgb.g, rgb.b);
          }
          const r = clampValue(matrix[0][0] * rgb.r + matrix[0][1] * rgb.g + matrix[0][2] * rgb.b, 0, 255);
          const g = clampValue(matrix[1][0] * rgb.r + matrix[1][1] * rgb.g + matrix[1][2] * rgb.b, 0, 255);
          const b = clampValue(matrix[2][0] * rgb.r + matrix[2][1] * rgb.g + matrix[2][2] * rgb.b, 0, 255);
          return rgbToHex(r, g, b);
      };

      const roundTripRgbDelta = (source, reproduced) => (
          Math.abs(source.r - reproduced.r)
          + Math.abs(source.g - reproduced.g)
          + Math.abs(source.b - reproduced.b)
      );

      const isOutOfPrintGamut = (hex) => {
          const rgb = hexToRgb(hex);
          if (!rgb) {
              return false;
          }
          const converted = rgbToCmyk(rgb.r, rgb.g, rgb.b);
          const roundTripped = cmykToRgb(converted.c, converted.m, converted.y, converted.k);
          return roundTripRgbDelta(rgb, roundTripped) > 24;
      };

      const sanitizeClassPrefix = (value, fallback = 'palette') => {
          const safeFallback = fallback && fallback.trim() ? fallback.trim() : 'palette';
          if (typeof value !== 'string') {
              return safeFallback;
          }
          const trimmed = value.trim();
          if (!trimmed) {
              return safeFallback;
          }
          const normalised = trimmed
              .replace(/\s+/g, '-')
              .replace(/[^a-zA-Z0-9_-]/g, '')
              .replace(/-+/g, '-')
              .replace(/^-+/, '')
              .replace(/-+$/, '')
              .toLowerCase();
          return normalised || safeFallback;
      };

      const parseNumericTuple = (value, size, { clampRange } = {}) => {
          if (typeof value !== 'string') {
              return null;
          }
          const parts = value.split(/[\s,]+/).filter(Boolean);
          if (parts.length !== size) {
              return null;
          }
          const numbers = parts.map((part) => Number(part));
          if (numbers.some((num) => !Number.isFinite(num))) {
              return null;
          }
          if (clampRange && Array.isArray(clampRange)) {
              const [min, max] = clampRange;
              return numbers.map((num) => clampValue(Math.round(num), min, max));
          }
          return numbers;
      };

      const copyTextToClipboard = (text) => {
          if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
              return navigator.clipboard.writeText(text);
          }
          return new Promise((resolve, reject) => {
              const textarea = document.createElement('textarea');
              textarea.value = text;
              textarea.setAttribute('readonly', '');
              textarea.style.position = 'absolute';
              textarea.style.opacity = '0';
              textarea.style.pointerEvents = 'none';
              document.body.appendChild(textarea);
              textarea.select();
              textarea.setSelectionRange(0, textarea.value.length);
              try {
                  const successful = document.execCommand('copy');
                  document.body.removeChild(textarea);
                  if (successful) {
                      resolve();
                  } else {
                      reject(new Error('Copy command unsuccessful.'));
                  }
              } catch (error) {
                  document.body.removeChild(textarea);
                  reject(error);
              }
          });
      };

      return {
          clampValue,
          normalizeHex,
          isValidHex,
          hexToRgb,
          rgbToHex,
          rgbToHsl,
          rgbToHsv,
          rgbToCmyk,
          hslToRgb,
          hsvToRgb,
          cmykToRgb,
          rotateHue,
          mixHexColors,
          relativeLuminance,
          calculateContrastRatio,
          simulateColorBlindness,
          isOutOfPrintGamut,
          sanitizeClassPrefix,
          parseNumericTuple,
          copyTextToClipboard
      };
  })();

  const UiHelpers = (() => {
      const initTabs = (root, {
          buttonSelector = '[data-tab]',
          panelSelector = '[data-tab-panel]',
          activeClass = 'active'
      } = {}) => {
          if (!root) {
              return;
          }
          const buttons = Array.from(root.querySelectorAll(buttonSelector));
          const panels = Array.from(root.querySelectorAll(panelSelector));
          const activate = (id) => {
              buttons.forEach((button) => {
                  const matches = button.getAttribute('data-tab') === id;
                  button.classList.toggle(activeClass, matches);
                  button.setAttribute('aria-selected', matches ? 'true' : 'false');
                  button.setAttribute('tabindex', matches ? '0' : '-1');
              });
              panels.forEach((panel) => {
                  const matches = panel.id === id;
                  panel.classList.toggle(activeClass, matches);
                  panel.hidden = !matches;
              });
          };
          buttons.forEach((button) => {
              button.addEventListener('click', () => {
                  const target = button.getAttribute('data-tab');
                  if (target) {
                      activate(target);
                  }
              });
          });
          const initial = buttons.find((button) => button.classList.contains(activeClass))
              || buttons[0];
          if (initial) {
              activate(initial.getAttribute('data-tab'));
          }
      };

      const bindColorInputGroup = ({ picker, hexInput, preview, onChange }) => {
          if (!picker || !hexInput) {
              return;
          }
          const emitChange = (hex) => {
              if (preview) {
                  preview.style.backgroundColor = hex;
              }
              if (typeof onChange === 'function') {
                  onChange(hex);
              }
          };

          picker.addEventListener('input', (event) => {
              const value = ColorUtilities.normalizeHex(event.target.value);
              hexInput.value = value;
              emitChange(value);
          });

          hexInput.addEventListener('input', (event) => {
              const raw = event.target.value;
              if (ColorUtilities.isValidHex(raw)) {
                  const normalised = ColorUtilities.normalizeHex(raw);
                  picker.value = normalised;
                  hexInput.classList.remove('is-error');
                  emitChange(normalised);
              } else {
                  hexInput.classList.add('is-error');
              }
          });

          hexInput.addEventListener('blur', () => {
              const normalised = ColorUtilities.normalizeHex(hexInput.value);
              hexInput.value = normalised;
              picker.value = normalised;
              hexInput.classList.remove('is-error');
              emitChange(normalised);
          });
      };

      const bindSliderWithInput = ({ slider, input, min = 0, max = 100, step = 1, onChange }) => {
          if (!slider || !input) {
              return;
          }
          const sync = (value) => {
              const clamped = ColorUtilities.clampValue(value, min, max);
              slider.value = clamped;
              input.value = clamped;
              if (typeof onChange === 'function') {
                  onChange(clamped);
              }
          };
          slider.min = min;
          slider.max = max;
          slider.step = step;
          input.min = min;
          input.max = max;
          input.step = step;

          slider.addEventListener('input', () => {
              sync(Number(slider.value));
          });

          input.addEventListener('input', () => {
              const numeric = Number(input.value);
              if (Number.isFinite(numeric)) {
                  sync(numeric);
              }
          });

          input.addEventListener('blur', () => {
              const numeric = Number(input.value);
              sync(Number.isFinite(numeric) ? numeric : min);
          });
      };

      const renderColorSwatches = (container, swatches = []) => {
          if (!container) {
              return [];
          }
          container.innerHTML = '';
          return swatches.map((swatch) => {
              const wrapper = document.createElement('div');
              wrapper.className = 'color-block-wrapper';

              const block = document.createElement('div');
              block.className = 'color-block';
              block.style.backgroundColor = swatch.bg;
              block.title = swatch.title || `Copy ${swatch.copyValue || swatch.label}`;
              block.dataset.copyValue = swatch.copyValue || swatch.label;

              const label = document.createElement('div');
              label.className = 'color-label';
              label.textContent = swatch.label;
              label.dataset.copyValue = swatch.copyValue || swatch.label;

              wrapper.appendChild(block);
              wrapper.appendChild(label);

              if (swatch.note) {
                  const note = document.createElement('div');
                  note.className = 'color-note';
                  note.textContent = swatch.note;
                  wrapper.appendChild(note);
              }

              container.appendChild(wrapper);

              return { wrapper, block, label };
          });
      };

      const attachCopyInteraction = ({ target, getText, onSuccess, onError }) => {
          if (!target || typeof getText !== 'function') {
              return;
          }
          target.addEventListener('click', () => {
              const value = getText();
              if (!value) {
                  if (typeof onError === 'function') {
                      onError(new Error('Nothing to copy.'));
                  }
                  return;
              }
              ColorUtilities.copyTextToClipboard(value)
                  .then(() => {
                      if (typeof onSuccess === 'function') {
                          onSuccess(target, value);
                      }
                  })
                  .catch((error) => {
                      if (typeof onError === 'function') {
                          onError(error);
                      }
                  });
          });
      };

      const renderAccordionSection = ({
          container,
          id,
          header,
          content
      }) => {
          if (!container) {
              return null;
          }
          const section = document.createElement('div');
          section.className = 'simulation-row';
          section.dataset.collapsed = 'true';
          const toggle = document.createElement('button');
          toggle.type = 'button';
          toggle.className = 'simulation-toggle';
          toggle.setAttribute('aria-controls', `${id}-content`);
          toggle.setAttribute('aria-expanded', 'false');
          toggle.innerHTML = `<span>${header}</span><svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
          const body = document.createElement('div');
          body.className = 'simulation-content';
          body.id = `${id}-content`;
          if (content instanceof Node) {
              body.appendChild(content);
          } else if (typeof content === 'string') {
              body.innerHTML = content;
          }
          toggle.addEventListener('click', () => {
              const collapsed = section.dataset.collapsed === 'true';
              section.dataset.collapsed = collapsed ? 'false' : 'true';
              toggle.setAttribute('aria-expanded', collapsed ? 'true' : 'false');
          });
          section.appendChild(toggle);
          section.appendChild(body);
          container.appendChild(section);
          return section;
      };

      const handleCopyFeedback = (target, {
          successClass = 'copied',
          duration = 1600
      } = {}) => {
          if (!target) {
              return;
          }
          target.classList.add(successClass);
          window.setTimeout(() => {
              target.classList.remove(successClass);
          }, duration);
      };

      return {
          initTabs,
          bindColorInputGroup,
          bindSliderWithInput,
          renderColorSwatches,
          attachCopyInteraction,
          renderAccordionSection,
          handleCopyFeedback
      };
  })();

  const PaletteLogic = (() => {
      const getClassPrefix = (prefixInputs, key, fallback = 'palette') => {
          const entry = prefixInputs[key];
          if (!entry) {
              return fallback;
          }
          if (entry.element) {
              entry.element.value = ColorUtilities.sanitizeClassPrefix(entry.element.value || entry.fallback || fallback, entry.fallback || fallback);
              return entry.element.value;
          }
          return ColorUtilities.sanitizeClassPrefix(entry.fallback || fallback, fallback);
      };

      const buildClassSelector = (prefix, token) => `.${prefix}-${token}`;

      const createRgbGradientPalette = ({ fromHex, toHex, count }) => {
          const start = ColorUtilities.hexToRgb(fromHex);
          const end = ColorUtilities.hexToRgb(toHex);
          const length = ColorUtilities.clampValue(count, 2, 64);
          if (!start || !end) {
              return [];
          }
          const swatches = [];
          for (let index = 0; index < length; index += 1) {
              const t = length === 1 ? 0 : index / (length - 1);
              const r = start.r + (end.r - start.r) * t;
              const g = start.g + (end.g - start.g) * t;
              const b = start.b + (end.b - start.b) * t;
              const hex = ColorUtilities.rgbToHex(r, g, b);
              swatches.push({
                  hex,
                  declaration: `background-color: ${hex};`
              });
          }
          return swatches;
      };

      const createHslGradientPalette = ({
          baseHex,
          hue,
          saturation,
          lightness,
          count
      }) => {
          const base = ColorUtilities.hexToRgb(baseHex);
          if (!base) {
              return [];
          }
          const length = ColorUtilities.clampValue(count, 1, 36);
          const step = length === 1 ? 0 : 360 / length;
          const swatches = [];
          for (let index = 0; index < length; index += 1) {
              const hueValue = (hue + step * index) % 360;
              const rgb = ColorUtilities.hslToRgb(hueValue, saturation, lightness);
              const hex = ColorUtilities.rgbToHex(rgb.r, rgb.g, rgb.b);
              swatches.push({
                  hex,
                  hsl: `hsl(${Math.round(hueValue)}, ${Math.round(saturation)}%, ${Math.round(lightness)}%)`,
                  declaration: `background-color: hsl(${Math.round(hueValue)}, ${Math.round(saturation)}%, ${Math.round(lightness)}%);`
              });
          }
          return swatches;
      };

      const createHsvGradientPalette = ({ baseHex, hue, saturation, value, count }) => {
          const base = ColorUtilities.hexToRgb(baseHex);
          if (!base) {
              return [];
          }
          const length = ColorUtilities.clampValue(count, 1, 36);
          const step = length === 1 ? 0 : 360 / length;
          const swatches = [];
          for (let index = 0; index < length; index += 1) {
              const hueValue = (hue + step * index) % 360;
              const rgb = ColorUtilities.hsvToRgb(hueValue, saturation, value);
              const hex = ColorUtilities.rgbToHex(rgb.r, rgb.g, rgb.b);
              swatches.push({
                  hex,
                  declaration: `background-color: ${hex};`
              });
          }
          return swatches;
      };

      const createCmykGradientPalette = ({ c, m, y, k, count }) => {
          const length = ColorUtilities.clampValue(count, 1, 36);
          const keyRangeStart = ColorUtilities.clampValue(k - 40, 0, 100);
          const keyRangeEnd = ColorUtilities.clampValue(k + 40, 0, 100);
          const range = keyRangeEnd === keyRangeStart
              ? { start: ColorUtilities.clampValue(k - 10, 0, 100), end: ColorUtilities.clampValue(k + 10, 0, 100) }
              : { start: keyRangeStart, end: keyRangeEnd };
          const step = length === 1 ? 0 : (range.end - range.start) / (length - 1 || 1);
          const swatches = [];
          for (let index = 0; index < length; index += 1) {
              const keyValue = ColorUtilities.clampValue(Math.round(range.start + step * index), 0, 100);
              const rgb = ColorUtilities.cmykToRgb(c, m, y, keyValue);
              const hex = ColorUtilities.rgbToHex(rgb.r, rgb.g, rgb.b);
              swatches.push({ hex, declaration: `background-color: ${hex};`, key: keyValue });
          }
          return swatches;
      };

      const createHarmonyPalettes = ({ baseHex, spread, variance, schemes }) => {
          const baseRgb = ColorUtilities.hexToRgb(baseHex);
          if (!baseRgb) {
              return {};
          }
          const baseHsl = ColorUtilities.rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
          const entries = {};
          const configFactory = {
              analogous: () => [
                  { offset: -spread * 1.5, note: `Analogous −${Math.round(spread * 1.5)}°`, lightness: -variance },
                  { offset: -spread, note: `Analogous −${spread}°`, lightness: -variance / 2 },
                  { offset: 0, note: 'Base', lightness: 0 },
                  { offset: spread, note: `Analogous +${spread}°`, lightness: variance / 2 },
                  { offset: spread * 1.5, note: `Analogous +${Math.round(spread * 1.5)}°`, lightness: variance }
              ],
              complementary: () => [
                  { offset: 0, note: 'Base (shade)', lightness: -variance / 1.2 },
                  { offset: 0, note: 'Base', lightness: 0 },
                  { offset: 180, note: 'Complement', lightness: 0 },
                  { offset: 180, note: 'Complement (highlight)', lightness: variance / 1.2 }
              ],
              'split-complementary': () => [
                  { offset: -spread, note: `Split −${spread}°`, lightness: -variance / 2 },
                  { offset: 0, note: 'Base', lightness: 0 },
                  { offset: spread, note: `Split +${spread}°`, lightness: variance / 2 },
                  { offset: 180, note: 'Anchor complement', lightness: 0 }
              ],
              triadic: () => [
                  { offset: -120, note: '−120° accent', lightness: -variance / 2 },
                  { offset: 0, note: 'Base', lightness: 0 },
                  { offset: 120, note: '+120° accent', lightness: variance / 2 }
              ],
              tetradic: () => [
                  { offset: -90, note: '−90°', lightness: -variance / 2 },
                  { offset: 0, note: 'Base', lightness: 0 },
                  { offset: 90, note: '+90°', lightness: variance / 2 },
                  { offset: 180, note: 'Opposite', lightness: 0 }
              ]
          };

          Object.keys(schemes || configFactory).forEach((scheme) => {
              const factory = configFactory[scheme] || configFactory.analogous;
              const config = factory();
              const colors = config.map((entry) => {
                  const hue = ColorUtilities.rotateHue(baseHsl.h, entry.offset);
                  const saturation = ColorUtilities.clampValue(baseHsl.s, 5, 100);
                  const lightness = ColorUtilities.clampValue(baseHsl.l + entry.lightness, 5, 95);
                  const rgb = ColorUtilities.hslToRgb(hue, saturation, lightness);
                  const hex = ColorUtilities.rgbToHex(rgb.r, rgb.g, rgb.b);
                  return { hex, note: entry.note, offset: entry.offset };
              });
              entries[scheme] = colors;
          });
          return entries;
      };

      const createDataVizPalettes = ({ baseHex, count }) => {
          const baseRgb = ColorUtilities.hexToRgb(baseHex);
          if (!baseRgb) {
              return { sequential: [], diverging: [], qualitative: [] };
          }
          const baseHsl = ColorUtilities.rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
          const size = ColorUtilities.clampValue(count, 3, 12);

          const sequential = Array.from({ length: size }, (_, index) => {
              const t = size === 1 ? 0 : index / (size - 1);
              const startLight = ColorUtilities.clampValue(baseHsl.l + 40, 30, 96);
              const endLight = ColorUtilities.clampValue(baseHsl.l - 30, 10, 70);
              const lightness = startLight - (startLight - endLight) * t;
              const saturation = ColorUtilities.clampValue(baseHsl.s * (0.9 - t * 0.2), 25, 100);
              const rgb = ColorUtilities.hslToRgb(baseHsl.h, saturation, lightness);
              return ColorUtilities.rgbToHex(rgb.r, rgb.g, rgb.b);
          });

          const complementHex = (() => {
              const hue = ColorUtilities.rotateHue(baseHsl.h, 180);
              const rgb = ColorUtilities.hslToRgb(hue, baseHsl.s, baseHsl.l);
              return ColorUtilities.rgbToHex(rgb.r, rgb.g, rgb.b);
          })();

          const neutralHex = (() => {
              const rgb = ColorUtilities.hslToRgb(baseHsl.h, ColorUtilities.clampValue(baseHsl.s * 0.25, 5, 35), 52);
              return ColorUtilities.rgbToHex(rgb.r, rgb.g, rgb.b);
          })();

          const diverging = Array.from({ length: size }, (_, index) => {
              const t = size <= 1 ? 0 : index / (size - 1);
              const signed = t * 2 - 1;
              if (signed < 0) {
                  return ColorUtilities.mixHexColors(complementHex, neutralHex, 1 - Math.abs(signed));
              }
              return ColorUtilities.mixHexColors(neutralHex, ColorUtilities.rgbToHex(baseRgb.r, baseRgb.g, baseRgb.b), signed);
          });

          const qualitative = Array.from({ length: size }, (_, index) => {
              const hue = ColorUtilities.rotateHue(baseHsl.h, (360 / size) * index);
              const saturation = ColorUtilities.clampValue(baseHsl.s, 50, 90);
              const lightness = ColorUtilities.clampValue(baseHsl.l, 35, 65);
              const rgb = ColorUtilities.hslToRgb(hue, saturation, lightness);
              return ColorUtilities.rgbToHex(rgb.r, rgb.g, rgb.b);
          });

          return { sequential, diverging, qualitative };
      };

      const createColorblindSimulations = (colors, types = ['deuteranopia', 'protanopia']) => {
          return types.reduce((acc, type) => {
              acc[type] = colors.map((hex) => ColorUtilities.simulateColorBlindness(hex, type));
              return acc;
          }, {});
      };

      const evaluateCmykWarning = ({ baseHex, paletteHexes }) => {
          const warnings = [];
          if (baseHex && ColorUtilities.isOutOfPrintGamut(baseHex)) {
              warnings.push('Base selection may print duller than preview.');
          }
          if (Array.isArray(paletteHexes) && paletteHexes.some((hex) => ColorUtilities.isOutOfPrintGamut(hex))) {
              warnings.push('Generated swatches include tones outside common CMYK press gamut.');
          }
          return warnings.join(' ');
      };

      return {
          getClassPrefix,
          buildClassSelector,
          createRgbGradientPalette,
          createHslGradientPalette,
          createHsvGradientPalette,
          createCmykGradientPalette,
          createHarmonyPalettes,
          createDataVizPalettes,
          createColorblindSimulations,
          evaluateCmykWarning
      };
  })();

  const classPrefixInputs = {
      rgb: { element: document.getElementById('rgbClassPrefix'), fallback: 'palette-rgb' },
      hsl: { element: document.getElementById('hslClassPrefix'), fallback: 'palette-hsl' },
      hsv: { element: document.getElementById('hsvClassPrefix'), fallback: 'palette-hsv' },
      cmyk: { element: document.getElementById('cmykClassPrefix'), fallback: 'palette-cmyk' },
      harmony: { element: document.getElementById('harmonyClassPrefix'), fallback: 'palette-harmony' },
      dataViz: { element: document.getElementById('dataVizClassPrefix'), fallback: 'palette-dataviz' }
  };

  function initClassPrefixInputs() {
      Object.values(classPrefixInputs).forEach((entry) => {
          if (!entry.element) {
              return;
          }
          entry.element.value = sanitiseClassPrefix(entry.element.value || entry.fallback, entry.fallback);
          entry.element.addEventListener('blur', () => {
              entry.element.value = sanitiseClassPrefix(entry.element.value, entry.fallback);
          });
      });
  }

  const hexElements = {
      fromPicker: document.getElementById('fromColorPicker'),
      toPicker: document.getElementById('toColorPicker'),
      fromHex: document.getElementById('fromHex'),
      toHex: document.getElementById('toHex'),
      fromPreview: document.getElementById('fromPreview'),
      toPreview: document.getElementById('toPreview'),
      segments: document.getElementById('segments'),
      results: document.getElementById('hexResults'),
      colorBlocks: document.getElementById('hexColorBlocks'),
      cssOutput: document.getElementById('hexCssOutput'),
      copyBtn: document.getElementById('hexCopyBtn'),
      copyIcon: document.getElementById('hexCopyIcon')
  };

  const hslElements = {
      colorPicker: document.getElementById('hslColorPicker'),
      hexDisplay: document.getElementById('hslHexDisplay'),
      hueSlider: document.getElementById('hslHueSlider'),
      hueInput: document.getElementById('hslHueInput'),
      saturationSlider: document.getElementById('hslSaturationSlider'),
      saturationInput: document.getElementById('hslSaturationInput'),
      lightnessSlider: document.getElementById('hslLightnessSlider'),
      lightnessInput: document.getElementById('hslLightnessInput'),
      countSlider: document.getElementById('hslCountSlider'),
      countInput: document.getElementById('hslCount'),
      results: document.getElementById('hslResults'),
      colorBlocks: document.getElementById('hslColorBlocks'),
      cssOutput: document.getElementById('hslCssOutput'),
      copyBtn: document.getElementById('hslCopyBtn'),
      copyIcon: document.getElementById('hslCopyIcon'),
      preview: document.getElementById('hslPreview')
  };

  const hsvElements = {
      colorPicker: document.getElementById('hsvColorPicker'),
      hexDisplay: document.getElementById('hsvHexDisplay'),
      hueSlider: document.getElementById('hsvHueSlider'),
      hueInput: document.getElementById('hsvHueInput'),
      saturationSlider: document.getElementById('hsvSaturationSlider'),
      saturationInput: document.getElementById('hsvSaturationInput'),
      valueSlider: document.getElementById('hsvValueSlider'),
      valueInput: document.getElementById('hsvValueInput'),
      countSlider: document.getElementById('hsvCountSlider'),
      countInput: document.getElementById('hsvCount'),
      results: document.getElementById('hsvResults'),
      colorBlocks: document.getElementById('hsvColorBlocks'),
      cssOutput: document.getElementById('hsvCssOutput'),
      copyBtn: document.getElementById('hsvCopyBtn'),
      copyIcon: document.getElementById('hsvCopyIcon'),
      preview: document.getElementById('hsvPreview')
  };

  const cmykElements = {
      colorPicker: document.getElementById('cmykColorPicker'),
      hexDisplay: document.getElementById('cmykHexDisplay'),
      cyanSlider: document.getElementById('cmykCyanSlider'),
      cyanInput: document.getElementById('cmykCyanInput'),
      magentaSlider: document.getElementById('cmykMagentaSlider'),
      magentaInput: document.getElementById('cmykMagentaInput'),
      yellowSlider: document.getElementById('cmykYellowSlider'),
      yellowInput: document.getElementById('cmykYellowInput'),
      keySlider: document.getElementById('cmykKeySlider'),
      keyInput: document.getElementById('cmykKeyInput'),
      countSlider: document.getElementById('cmykCountSlider'),
      countInput: document.getElementById('cmykCount'),
      results: document.getElementById('cmykResults'),
      colorBlocks: document.getElementById('cmykColorBlocks'),
      cssOutput: document.getElementById('cmykCssOutput'),
      copyBtn: document.getElementById('cmykCopyBtn'),
      copyIcon: document.getElementById('cmykCopyIcon'),
      preview: document.getElementById('cmykPreview'),
      warning: document.getElementById('cmykGamutWarning')
  };

  const harmonyElements = {
      colorPicker: document.getElementById('harmonyColorPicker'),
      hexInput: document.getElementById('harmonyHex'),
      hexDisplay: document.getElementById('harmonyHexDisplay'),
      spreadSlider: document.getElementById('harmonySpreadSlider'),
      spreadInput: document.getElementById('harmonySpread'),
      lightnessSlider: document.getElementById('harmonyLightnessSlider'),
      lightnessInput: document.getElementById('harmonyLightness'),
      preview: document.getElementById('harmonyPreview'),
      columns: {
          analogous: {
              heading: document.querySelector('[data-scheme="analogous"] h3'),
              blocks: document.getElementById('harmonyAnalogousBlocks'),
              cssContainer: document.getElementById('harmonyAnalogousCssContainer'),
              cssOutput: document.getElementById('harmonyAnalogousCss'),
              copyBtn: document.getElementById('harmonyAnalogousCopyBtn'),
              copyIcon: document.getElementById('harmonyAnalogousCopyIcon')
          },
          complementary: {
              heading: document.querySelector('[data-scheme="complementary"] h3'),
              blocks: document.getElementById('harmonyComplementaryBlocks'),
              cssContainer: document.getElementById('harmonyComplementaryCssContainer'),
              cssOutput: document.getElementById('harmonyComplementaryCss'),
              copyBtn: document.getElementById('harmonyComplementaryCopyBtn'),
              copyIcon: document.getElementById('harmonyComplementaryCopyIcon')
          },
          'split-complementary': {
              heading: document.querySelector('[data-scheme="split-complementary"] h3'),
              blocks: document.getElementById('harmonySplitComplementaryBlocks'),
              cssContainer: document.getElementById('harmonySplitComplementaryCssContainer'),
              cssOutput: document.getElementById('harmonySplitComplementaryCss'),
              copyBtn: document.getElementById('harmonySplitComplementaryCopyBtn'),
              copyIcon: document.getElementById('harmonySplitComplementaryCopyIcon')
          },
          triadic: {
              heading: document.querySelector('[data-scheme="triadic"] h3'),
              blocks: document.getElementById('harmonyTriadicBlocks'),
              cssContainer: document.getElementById('harmonyTriadicCssContainer'),
              cssOutput: document.getElementById('harmonyTriadicCss'),
              copyBtn: document.getElementById('harmonyTriadicCopyBtn'),
              copyIcon: document.getElementById('harmonyTriadicCopyIcon')
          },
          tetradic: {
              heading: document.querySelector('[data-scheme="tetradic"] h3'),
              blocks: document.getElementById('harmonyTetradicBlocks'),
              cssContainer: document.getElementById('harmonyTetradicCssContainer'),
              cssOutput: document.getElementById('harmonyTetradicCss'),
              copyBtn: document.getElementById('harmonyTetradicCopyBtn'),
              copyIcon: document.getElementById('harmonyTetradicCopyIcon')
          }
      }
  };

  const dataVizElements = {
      colorPicker: document.getElementById('dataVizColorPicker'),
      hexInput: document.getElementById('dataVizHex'),
      hexDisplay: document.getElementById('dataVizHexDisplay'),
      countSlider: document.getElementById('dataVizCountSlider'),
      countInput: document.getElementById('dataVizCount'),
      preview: document.getElementById('dataVizPreview'),
      columns: {
          sequential: {
              heading: document.querySelector('[data-type="sequential"] h3'),
              blocks: document.getElementById('dataVizSequentialBlocks'),
              simulations: document.getElementById('dataVizSequentialSimulations'),
              cssContainer: document.getElementById('dataVizSequentialCssContainer'),
              cssOutput: document.getElementById('dataVizSequentialCss'),
              copyBtn: document.getElementById('dataVizSequentialCopyBtn'),
              copyIcon: document.getElementById('dataVizSequentialCopyIcon')
          },
          diverging: {
              heading: document.querySelector('[data-type="diverging"] h3'),
              blocks: document.getElementById('dataVizDivergingBlocks'),
              simulations: document.getElementById('dataVizDivergingSimulations'),
              cssContainer: document.getElementById('dataVizDivergingCssContainer'),
              cssOutput: document.getElementById('dataVizDivergingCss'),
              copyBtn: document.getElementById('dataVizDivergingCopyBtn'),
              copyIcon: document.getElementById('dataVizDivergingCopyIcon')
          },
          qualitative: {
              heading: document.querySelector('[data-type="qualitative"] h3'),
              blocks: document.getElementById('dataVizQualitativeBlocks'),
              simulations: document.getElementById('dataVizQualitativeSimulations'),
              cssContainer: document.getElementById('dataVizQualitativeCssContainer'),
              cssOutput: document.getElementById('dataVizQualitativeCss'),
              copyBtn: document.getElementById('dataVizQualitativeCopyBtn'),
              copyIcon: document.getElementById('dataVizQualitativeCopyIcon')
          }
      }
  };

  const hexToRgb = (...args) => ColorUtilities.hexToRgb(...args);

  const rgbToHex = (...args) => ColorUtilities.rgbToHex(...args);

  const hslToRgb = (...args) => ColorUtilities.hslToRgb(...args);

  const hsvToRgb = (...args) => ColorUtilities.hsvToRgb(...args);

  const cmykToRgb = (...args) => ColorUtilities.cmykToRgb(...args);

  const rgbToHsl = (...args) => ColorUtilities.rgbToHsl(...args);

  const rgbToHsv = (...args) => ColorUtilities.rgbToHsv(...args);

  const rgbToCmyk = (...args) => ColorUtilities.rgbToCmyk(...args);

  function roundTripRgbDelta(source, reproduced) {
      return (
          Math.abs(source.r - reproduced.r)
          + Math.abs(source.g - reproduced.g)
          + Math.abs(source.b - reproduced.b)
      );
  }

  function isRgbOutOfPrintGamut(rgb) {
      const converted = rgbToCmyk(rgb.r, rgb.g, rgb.b);
      const roundTripped = cmykToRgb(converted.c, converted.m, converted.y, converted.k);
      return roundTripRgbDelta(rgb, roundTripped) > 24;
  }

  function isHexOutOfPrintGamut(hex) {
      const rgb = hexToRgb(hex);
      if (!rgb) {
          return false;
      }
      return isRgbOutOfPrintGamut(rgb);
  }

  const isValidHex = (...args) => ColorUtilities.isValidHex(...args);

  const normalizeHex = (...args) => ColorUtilities.normalizeHex(...args);

  const clamp = (...args) => ColorUtilities.clampValue(...args);

  const sanitiseClassPrefix = (value, fallback = 'palette') => (
      ColorUtilities.sanitizeClassPrefix(value, fallback)
  );

  const getClassPrefix = (key) => (
      PaletteLogic.getClassPrefix(classPrefixInputs, key, classPrefixInputs[key]?.fallback || 'palette')
  );

  const buildClassSelector = (...args) => PaletteLogic.buildClassSelector(...args);

  function formatRgbValue(rgb) {
      if (!rgb) {
          return '';
      }
      return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
  }

  function parseRgbValue(value) {
      if (!value) {
          return null;
      }
      const parts = value.split(/[,\s]+/).filter(Boolean);
      if (parts.length !== 3) {
          return null;
      }
      const numbers = parts.map((part) => Number(part));
      if (numbers.some((num) => !Number.isInteger(num) || num < 0 || num > 255)) {
          return null;
      }
      return { r: numbers[0], g: numbers[1], b: numbers[2] };
  }

  function updateRgbInputValue(input, hex) {
      if (!input) {
          return;
      }
      const rgb = hexToRgb(hex);
      if (!rgb) {
          return;
      }
      input.value = formatRgbValue(rgb);
      input.style.borderColor = '#e5e7eb';
  }

  function updateHexDisplayValue(display, hex) {
      if (!display) {
          return;
      }
      const normalized = normalizeHex(hex, '').toUpperCase();
      if (!isValidHex(normalized)) {
          display.value = '';
          display.style.borderColor = '#f87171';
          return;
      }
      display.value = normalized;
      display.style.borderColor = '#e5e7eb';
  }

  function formatCmykValues(c, m, y, k) {
      const values = [c, m, y, k].map((value) => {
          const numeric = Number(value);
          return clamp(Number.isFinite(numeric) ? Math.round(numeric) : 0, 0, 100);
      });
      return `${values[0]}, ${values[1]}, ${values[2]}, ${values[3]}`;
  }

  function parseCmykValues(value) {
      if (!value) {
          return null;
      }
      const parts = value.split(/[\s,]+/).filter((part) => part.length > 0);
      if (parts.length !== 4) {
          return null;
      }
      const numbers = parts.map((part) => Number(part));
      if (numbers.some((num) => !Number.isFinite(num))) {
          return null;
      }
      const [c, m, y, k] = numbers.map((num) => clamp(Math.round(num), 0, 100));
      return { c, m, y, k };
  }

  function updateCmykValuesInput(c, m, y, k) {
      if (!cmykElements.valuesInput) {
          return;
      }
      cmykElements.valuesInput.value = formatCmykValues(c, m, y, k);
      cmykElements.valuesInput.style.borderColor = '#e5e7eb';
  }

  function setCmykComponentValues(c, m, y, k) {
      const normalized = [c, m, y, k].map((value) => {
          const numeric = Number(value);
          return clamp(Number.isFinite(numeric) ? Math.round(numeric) : 0, 0, 100);
      });

      cmykElements.cyanInput.value = normalized[0];
      cmykElements.cyanSlider.value = normalized[0];
      cmykElements.magentaInput.value = normalized[1];
      cmykElements.magentaSlider.value = normalized[1];
      cmykElements.yellowInput.value = normalized[2];
      cmykElements.yellowSlider.value = normalized[2];
      cmykElements.keyInput.value = normalized[3];
      cmykElements.keySlider.value = normalized[3];

      return {
          c: normalized[0],
          m: normalized[1],
          y: normalized[2],
          k: normalized[3]
      };
  }

  function syncRgbToPicker(rgbInput, picker, hexInput, callback) {
      if (!rgbInput || !picker) {
          return;
      }

      const applyRgb = (raw) => {
          const parsed = parseRgbValue(raw);
          if (!parsed) {
              rgbInput.style.borderColor = '#f87171';
              return;
          }
          rgbInput.style.borderColor = '#e5e7eb';
          const hex = rgbToHex(parsed.r, parsed.g, parsed.b);
          picker.value = hex;
          if (hexInput) {
              hexInput.value = hex;
              hexInput.style.borderColor = '#e5e7eb';
          }
          rgbInput.value = formatRgbValue(parsed);
          if (typeof callback === 'function') {
              callback(hex);
          }
      };

      rgbInput.addEventListener('input', (event) => {
          applyRgb(event.target.value);
      });

      rgbInput.addEventListener('blur', (event) => {
          applyRgb(event.target.value);
      });
  }

  function rotateHue(hue, delta) {
    const result = (hue + delta) % 360;
    return result < 0 ? result + 360 : result;
  }

  function mixHexColors(firstHex, secondHex, amount) {
    const start = hexToRgb(firstHex);
    const end = hexToRgb(secondHex);
    if (!start || !end) {
        return firstHex;
    }

    const mix = {
        r: start.r + (end.r - start.r) * amount,
        g: start.g + (end.g - start.g) * amount,
        b: start.b + (end.b - start.b) * amount
    };

    return rgbToHex(mix.r, mix.g, mix.b);
  }

  function relativeLuminanceFromRgb(r, g, b) {
    const linearise = (value) => {
        const channel = value / 255;
        return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    };

    const red = linearise(r);
    const green = linearise(g);
    const blue = linearise(b);

    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  }

  function contrastRatio(firstHex, secondHex) {
    const first = hexToRgb(firstHex);
    const second = hexToRgb(secondHex);
    if (!first || !second) {
        return 1;
    }

    const luminanceA = relativeLuminanceFromRgb(first.r, first.g, first.b);
    const luminanceB = relativeLuminanceFromRgb(second.r, second.g, second.b);
    const lighter = Math.max(luminanceA, luminanceB);
    const darker = Math.min(luminanceA, luminanceB);

    return (lighter + 0.05) / (darker + 0.05);
  }

  function simulateColorBlindness(hex, type) {
    const rgb = hexToRgb(hex);
    if (!rgb) {
        return hex;
    }

    let matrix;

    if (type === 'deuteranopia') {
        matrix = [
            [0.625, 0.375, 0],
            [0.7, 0.3, 0],
            [0, 0.3, 0.7]
        ];
    } else if (type === 'protanopia') {
        matrix = [
            [0.56667, 0.43333, 0],
            [0.55833, 0.44167, 0],
            [0, 0.24167, 0.75833]
        ];
    } else if (type === 'tritanopia') {
        matrix = [
            [0.95, 0.05, 0],
            [0, 0.43333, 0.56667],
            [0, 0.475, 0.525]
        ];
    } else {
        return hex;
    }

    const r = clamp(matrix[0][0] * rgb.r + matrix[0][1] * rgb.g + matrix[0][2] * rgb.b, 0, 255);
    const g = clamp(matrix[1][0] * rgb.r + matrix[1][1] * rgb.g + matrix[1][2] * rgb.b, 0, 255);
    const b = clamp(matrix[2][0] * rgb.r + matrix[2][1] * rgb.g + matrix[2][2] * rgb.b, 0, 255);

    return rgbToHex(r, g, b);
  }

  function isOutOfPrintGamut(c, m, y, k) {
      const rgb = cmykToRgb(c, m, y, k);
      return isRgbOutOfPrintGamut(rgb);
  }

  function syncPickerToHex(picker, hexInput, callback) {
    picker.addEventListener('input', (event) => {
        const value = event.target.value.toUpperCase();
        hexInput.value = value;
        if (typeof callback === 'function') {
            callback(value);
        }
    });
  }

  function syncHexToPicker(hexInput, picker, callback) {
    hexInput.addEventListener('input', (event) => {
        const value = normalizeHex(event.target.value);
        if (isValidHex(value)) {
            picker.value = value;
            event.target.style.borderColor = '#e5e7eb';
            if (typeof callback === 'function') {
                callback(value);
            }
        } else {
            event.target.style.borderColor = '#f87171';
        }
    });

    hexInput.addEventListener('blur', (event) => {
        const normalized = normalizeHex(event.target.value || '#000000');
        if (!isValidHex(normalized)) {
            event.target.value = '#000000';
            picker.value = '#000000';
            event.target.style.borderColor = '#e5e7eb';
            if (typeof callback === 'function') {
                callback('#000000');
            }
        } else {
            event.target.value = normalized;
            picker.value = normalized;
            event.target.style.borderColor = '#e5e7eb';
            if (typeof callback === 'function') {
                callback(normalized);
            }
        }
    });
  }

  syncPickerToHex(hexElements.fromPicker, hexElements.fromHex, (value) => {
      if (hexElements.fromPreview) {
          hexElements.fromPreview.style.backgroundColor = value;
      }
  });
  syncPickerToHex(hexElements.toPicker, hexElements.toHex, (value) => {
      if (hexElements.toPreview) {
          hexElements.toPreview.style.backgroundColor = value;
      }
  });
  syncHexToPicker(hexElements.fromHex, hexElements.fromPicker, (value) => {
      if (hexElements.fromPreview) {
          hexElements.fromPreview.style.backgroundColor = value;
      }
  });
  syncHexToPicker(hexElements.toHex, hexElements.toPicker, (value) => {
      if (hexElements.toPreview) {
          hexElements.toPreview.style.backgroundColor = value;
      }
  });

  // Initialize preview chips with current values
  if (hexElements.fromPreview) {
      hexElements.fromPreview.style.backgroundColor = hexElements.fromPicker.value;
  }
  if (hexElements.toPreview) {
      hexElements.toPreview.style.backgroundColor = hexElements.toPicker.value;
  }

  syncPickerToHex(harmonyElements.colorPicker, harmonyElements.hexInput, (value) => {
      updateHarmonyPreview();
      updateRgbInputValue(harmonyElements.rgbInput, value);
      updateHexDisplayValue(harmonyElements.hexDisplay, value);
  });
  syncHexToPicker(harmonyElements.hexInput, harmonyElements.colorPicker, (value) => {
      updateHarmonyPreview();
      updateRgbInputValue(harmonyElements.rgbInput, value);
      updateHexDisplayValue(harmonyElements.hexDisplay, value);
  });
  syncRgbToPicker(harmonyElements.rgbInput, harmonyElements.colorPicker, harmonyElements.hexInput, () => {
      updateHarmonyPreview();
  });
  syncPickerToHex(dataVizElements.colorPicker, dataVizElements.hexInput, (value) => {
      updateDataVizPreview();
      updateRgbInputValue(dataVizElements.rgbInput, value);
      updateHexDisplayValue(dataVizElements.hexDisplay, value);
  });
  syncHexToPicker(dataVizElements.hexInput, dataVizElements.colorPicker, (value) => {
      updateDataVizPreview();
      updateRgbInputValue(dataVizElements.rgbInput, value);
      updateHexDisplayValue(dataVizElements.hexDisplay, value);
  });
  syncRgbToPicker(dataVizElements.rgbInput, dataVizElements.colorPicker, dataVizElements.hexInput, () => {
      updateDataVizPreview();
  });

  updateHslPreview();
  updateHsvPreview();
  updateCmykPreview();
  updateHarmonyPreview();
  updateDataVizPreview();
  evaluateCmykWarning();

  function setupSliderPair(slider, input, { min, max, onChange }) {
      slider.addEventListener('input', () => {
          input.value = slider.value;
          if (onChange) {
              onChange(parseFloat(slider.value));
          }
      });

      input.addEventListener('input', () => {
          const numeric = Number(input.value);
          if (!Number.isFinite(numeric)) {
              return;
          }
          const clamped = clamp(numeric, min, max);
          slider.value = clamped;
          if (input.value !== String(clamped)) {
              input.value = clamped;
          }
          if (onChange) {
              onChange(clamped);
          }
      });

      input.addEventListener('blur', () => {
          let numeric = Number(input.value);
          if (!Number.isFinite(numeric)) {
              numeric = min;
          }
          const clamped = clamp(numeric, min, max);
          slider.value = clamped;
          input.value = clamped;
          if (onChange) {
              onChange(clamped);
          }
      });
  }

  function applyHslFromHex(hex) {
      const normalized = normalizeHex(hex || '#000000');
      if (!isValidHex(normalized)) {
          return;
      }
      const rgb = hexToRgb(normalized);
      if (!rgb) {
          return;
      }
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      hslElements.hueInput.value = hsl.h;
      hslElements.hueSlider.value = hsl.h;
      hslElements.saturationInput.value = hsl.s;
      hslElements.saturationSlider.value = hsl.s;
      hslElements.lightnessInput.value = hsl.l;
      hslElements.lightnessSlider.value = hsl.l;
      updateRgbInputValue(hslElements.rgbInput, normalized);
      updateHexDisplayValue(hslElements.hexDisplay, normalized);
      hslElements.colorPicker.value = normalized;
      updateHslPreview();
  }

  function applyHsvFromHex(hex) {
      const normalized = normalizeHex(hex || '#000000');
      if (!isValidHex(normalized)) {
          return;
      }
      const rgb = hexToRgb(normalized);
      if (!rgb) {
          return;
      }
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      hsvElements.hueInput.value = hsv.h;
      hsvElements.hueSlider.value = hsv.h;
      hsvElements.saturationInput.value = hsv.s;
      hsvElements.saturationSlider.value = hsv.s;
      hsvElements.valueInput.value = hsv.v;
      hsvElements.valueSlider.value = hsv.v;
      updateRgbInputValue(hsvElements.rgbInput, normalized);
      updateHexDisplayValue(hsvElements.hexDisplay, normalized);
      hsvElements.colorPicker.value = normalized;
      updateHsvPreview();
  }

  function applyCmykFromHex(hex) {
      const normalized = normalizeHex(hex || '#000000');
      if (!isValidHex(normalized)) {
          return;
      }
      const rgb = hexToRgb(normalized);
      if (!rgb) {
          return;
      }
      const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
      setCmykComponentValues(cmyk.c, cmyk.m, cmyk.y, cmyk.k);
      updateHexDisplayValue(cmykElements.hexDisplay, normalized);
      cmykElements.colorPicker.value = normalized;
      updateCmykPreview();
  }

  function updateHslPreview() {
      const hue = Number(hslElements.hueInput.value);
      const saturation = Number(hslElements.saturationInput.value);
      const lightness = Number(hslElements.lightnessInput.value);

      if (
          Number.isFinite(hue)
          && Number.isFinite(saturation)
          && Number.isFinite(lightness)
      ) {
          hslElements.preview.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
          const rgb = hslToRgb(hue, saturation, lightness);
          const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
          hslElements.colorPicker.value = hex;
          if (hslElements.rgbInput) {
              updateRgbInputValue(hslElements.rgbInput, hex);
          }
          updateHexDisplayValue(hslElements.hexDisplay, hex);
      }
  }

  function updateHsvPreview() {
      const hue = Number(hsvElements.hueInput.value);
      const saturation = Number(hsvElements.saturationInput.value);
      const value = Number(hsvElements.valueInput.value);

      if (
          Number.isFinite(hue)
          && Number.isFinite(saturation)
          && Number.isFinite(value)
      ) {
          const rgb = hsvToRgb(hue, saturation, value);
          hsvElements.preview.style.backgroundColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
          const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
          hsvElements.colorPicker.value = hex;
          if (hsvElements.rgbInput) {
              updateRgbInputValue(hsvElements.rgbInput, hex);
          }
          updateHexDisplayValue(hsvElements.hexDisplay, hex);
      }
  }

  function updateCmykPreview() {
      const cyan = Number(cmykElements.cyanInput.value);
      const magenta = Number(cmykElements.magentaInput.value);
      const yellow = Number(cmykElements.yellowInput.value);
      const key = Number(cmykElements.keyInput.value);

      if (
          Number.isFinite(cyan)
          && Number.isFinite(magenta)
          && Number.isFinite(yellow)
          && Number.isFinite(key)
      ) {
          const rgb = cmykToRgb(cyan, magenta, yellow, key);
          const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
          cmykElements.preview.style.backgroundColor = hex;
          cmykElements.colorPicker.value = hex;
          updateHexDisplayValue(cmykElements.hexDisplay, hex);
          updateCmykValuesInput(cyan, magenta, yellow, key);
          evaluateCmykWarning();
      }
  }

  function updateHarmonyPreview() {
    if (!harmonyElements.preview || !harmonyElements.hexInput) {
        return;
    }
    const value = normalizeHex(harmonyElements.hexInput.value || '#000000');
    if (!isValidHex(value)) {
        return;
    }
    harmonyElements.hexInput.value = value;
    harmonyElements.preview.style.backgroundColor = value;
    harmonyElements.colorPicker.value = value;
    if (harmonyElements.rgbInput) {
        updateRgbInputValue(harmonyElements.rgbInput, value);
    }
    updateHexDisplayValue(harmonyElements.hexDisplay, value);
  }

  function updateDataVizPreview() {
    if (!dataVizElements.preview || !dataVizElements.hexInput) {
        return;
    }
    const value = normalizeHex(dataVizElements.hexInput.value || '#000000');
    if (!isValidHex(value)) {
        return;
    }
    dataVizElements.hexInput.value = value;
    dataVizElements.preview.style.backgroundColor = value;
    dataVizElements.colorPicker.value = value;
    if (dataVizElements.rgbInput) {
        updateRgbInputValue(dataVizElements.rgbInput, value);
    }
    updateHexDisplayValue(dataVizElements.hexDisplay, value);
  }

  function evaluateCmykWarning(generatedHexes = []) {
    if (!cmykElements.warning) {
        return;
    }

    const warningText = PaletteLogic.evaluateCmykWarning({
        baseHex: normalizeHex(cmykElements.colorPicker.value || '#000000'),
        paletteHexes: generatedHexes
    });

    if (warningText) {
        cmykElements.warning.style.display = 'block';
        cmykElements.warning.textContent = `⚠️ ${warningText}`;
        cmykElements.warning.setAttribute('data-active', 'true');
    } else {
        cmykElements.warning.style.display = 'none';
        cmykElements.warning.removeAttribute('data-active');
        cmykElements.warning.textContent = '';
    }
  }

  setupSliderPair(hslElements.hueSlider, hslElements.hueInput, {
      min: 0,
      max: 360,
      onChange: updateHslPreview
  });
  setupSliderPair(hslElements.saturationSlider, hslElements.saturationInput, {
      min: 0,
      max: 100,
      onChange: updateHslPreview
  });
  setupSliderPair(hslElements.lightnessSlider, hslElements.lightnessInput, {
      min: 0,
      max: 100,
      onChange: updateHslPreview
  });
  setupSliderPair(hslElements.countSlider, hslElements.countInput, {
      min: 1,
      max: 36,
      onChange: undefined
  });

  setupSliderPair(hsvElements.hueSlider, hsvElements.hueInput, {
      min: 0,
      max: 360,
      onChange: updateHsvPreview
  });
  setupSliderPair(hsvElements.saturationSlider, hsvElements.saturationInput, {
      min: 0,
      max: 100,
      onChange: updateHsvPreview
  });
  setupSliderPair(hsvElements.valueSlider, hsvElements.valueInput, {
      min: 0,
      max: 100,
      onChange: updateHsvPreview
  });
  setupSliderPair(hsvElements.countSlider, hsvElements.countInput, {
      min: 1,
      max: 36,
      onChange: undefined
  });

  setupSliderPair(cmykElements.cyanSlider, cmykElements.cyanInput, {
      min: 0,
      max: 100,
      onChange: updateCmykPreview
  });
  setupSliderPair(cmykElements.magentaSlider, cmykElements.magentaInput, {
      min: 0,
      max: 100,
      onChange: updateCmykPreview
  });
  setupSliderPair(cmykElements.yellowSlider, cmykElements.yellowInput, {
      min: 0,
      max: 100,
      onChange: updateCmykPreview
  });
  setupSliderPair(cmykElements.keySlider, cmykElements.keyInput, {
      min: 0,
      max: 100,
      onChange: updateCmykPreview
  });
  setupSliderPair(cmykElements.countSlider, cmykElements.countInput, {
      min: 1,
      max: 36,
      onChange: undefined
  });

  setupSliderPair(harmonyElements.spreadSlider, harmonyElements.spreadInput, {
    min: 10,
    max: 90,
    onChange: () => updateHarmonyPreview()
  });
  setupSliderPair(harmonyElements.lightnessSlider, harmonyElements.lightnessInput, {
    min: 0,
    max: 30,
    onChange: undefined
  });

  setupSliderPair(dataVizElements.countSlider, dataVizElements.countInput, {
    min: 3,
    max: 12,
    onChange: undefined
  });

  hslElements.colorPicker.addEventListener('input', (event) => {
      applyHslFromHex(event.target.value);
  });
  syncRgbToPicker(hslElements.rgbInput, hslElements.colorPicker, null, applyHslFromHex);

  hsvElements.colorPicker.addEventListener('input', (event) => {
      applyHsvFromHex(event.target.value);
  });
  syncRgbToPicker(hsvElements.rgbInput, hsvElements.colorPicker, null, applyHsvFromHex);

  if (hslElements.hexDisplay) {
      syncHexToPicker(hslElements.hexDisplay, hslElements.colorPicker, applyHslFromHex);
  }
  if (hsvElements.hexDisplay) {
      syncHexToPicker(hsvElements.hexDisplay, hsvElements.colorPicker, applyHsvFromHex);
  }
  if (cmykElements.hexDisplay) {
      syncHexToPicker(cmykElements.hexDisplay, cmykElements.colorPicker, applyCmykFromHex);
  }
  if (harmonyElements.hexDisplay) {
      syncHexToPicker(harmonyElements.hexDisplay, harmonyElements.colorPicker, (value) => {
          harmonyElements.hexInput.value = value;
          updateHarmonyPreview();
      });
  }
  if (dataVizElements.hexDisplay) {
      syncHexToPicker(dataVizElements.hexDisplay, dataVizElements.colorPicker, (value) => {
          dataVizElements.hexInput.value = value;
          updateDataVizPreview();
      });
  }

  cmykElements.colorPicker.addEventListener('input', (event) => {
      applyCmykFromHex(event.target.value);
  });

  if (cmykElements.valuesInput) {
      const commitCmykValues = (values) => {
          setCmykComponentValues(values.c, values.m, values.y, values.k);
          updateCmykPreview();
      };

      cmykElements.valuesInput.addEventListener('input', (event) => {
          const parsed = parseCmykValues(event.target.value);
          if (!parsed) {
              cmykElements.valuesInput.style.borderColor = '#f87171';
              return;
          }
          cmykElements.valuesInput.style.borderColor = '#e5e7eb';
          commitCmykValues(parsed);
      });

      cmykElements.valuesInput.addEventListener('blur', () => {
          const parsed = parseCmykValues(cmykElements.valuesInput.value);
          if (!parsed) {
              updateCmykPreview();
              return;
          }
          cmykElements.valuesInput.style.borderColor = '#e5e7eb';
          commitCmykValues(parsed);
      });
  }

  function copyTextToClipboard(text) {
      return navigator.clipboard.writeText(text).catch(() => {
          alert('Unable to copy value. Please copy it manually.');
          return Promise.reject();
      });
  }

  function copyCss(text, button, icon) {
      const trimmed = text.trim();
      if (!trimmed) {
          alert('Generate a palette before copying the CSS classes.');
          return;
      }

      copyTextToClipboard(trimmed)
          .then(() => {
              button.classList.add('copied');
              icon.innerHTML = checkSvg;

              setTimeout(() => {
                  button.classList.remove('copied');
                  icon.innerHTML = clipboardSvg;
              }, 2000);
          });
  }

  function attachColorCopy(element, hex, { showTick = false } = {}) {
      element.addEventListener('click', () => {
          copyTextToClipboard(hex)
              .then(() => {
                  if (showTick) {
                      const originalText = element.dataset.originalText ?? '';
                      element.dataset.originalText = originalText;
                      element.textContent = '✔';
                      element.classList.add('copied');
                      setTimeout(() => {
                          element.textContent = element.dataset.originalText || '';
                          element.classList.remove('copied');
                          delete element.dataset.originalText;
                      }, 1200);
                  } else {
                      element.classList.add('copied');
                      setTimeout(() => element.classList.remove('copied'), 1200);
                  }
              });
      });
  }

  function renderBlocks(container, colors) {
      if (!container) {
          return;
      }
      const nodes = UiHelpers.renderColorSwatches(container, colors);
      nodes.forEach((node, index) => {
          const source = colors[index];
          const copyValue = source.copyValue ?? source.label;
          if (node && node.block) {
              attachColorCopy(node.block, copyValue, { showTick: true });
          }
          if (node && node.label) {
              attachColorCopy(node.label, copyValue, { showTick: false });
          }
      });
  }

  function generateRgbGradient() {
      const classPrefix = getClassPrefix('rgb');
      const startHex = normalizeHex(hexElements.fromHex.value);
      const endHex = normalizeHex(hexElements.toHex.value);

      if (!isValidHex(startHex) || !isValidHex(endHex)) {
          alert('Please enter valid hex color codes (e.g., #FF0000 or FF0000).');
          return;
      }

      const requested = parseInt(hexElements.segments.value, 10);
      const count = clamp(Number.isFinite(requested) ? requested : 12, 2, 64);
      hexElements.segments.value = count;
      const palette = PaletteLogic.createRgbGradientPalette({ fromHex: startHex, toHex: endHex, count });
      const colors = palette.map((entry, index) => ({
          bg: entry.hex,
          label: entry.hex,
          copyValue: entry.hex,
          selector: buildClassSelector(classPrefix, `gradient-color-${index + 1}`),
          declaration: entry.declaration
      }));

      hexElements.results.style.display = 'block';
      renderBlocks(hexElements.colorBlocks, colors);

      const cssText = colors
          .map((color) => `${color.selector} { ${color.declaration} }`)
          .join('\n');

      hexElements.cssOutput.textContent = cssText;
  }

  function copyRgbCss() {
      copyCss(hexElements.cssOutput.textContent, hexElements.copyBtn, hexElements.copyIcon);
  }

  function generateHslGradient() {
      const classPrefix = getClassPrefix('hsl');
      const hue = clamp(Number(hslElements.hueInput.value), 0, 360);
      const saturation = clamp(Number(hslElements.saturationInput.value), 0, 100);
      const lightness = clamp(Number(hslElements.lightnessInput.value), 0, 100);
      let count = parseInt(hslElements.countInput.value, 10);
      count = clamp(Number.isFinite(count) ? count : 12, 1, 36);
      hslElements.hueInput.value = hue;
      hslElements.hueSlider.value = hue;
      hslElements.saturationInput.value = saturation;
      hslElements.saturationSlider.value = saturation;
      hslElements.lightnessInput.value = lightness;
      hslElements.lightnessSlider.value = lightness;
      hslElements.countInput.value = count;
      hslElements.countSlider.value = count;

      if ([hue, saturation, lightness].some((value) => !Number.isFinite(value))) {
          alert('Please provide numeric values for hue, saturation, and lightness.');
          return;
      }

      const baseHex = normalizeHex(hslElements.colorPicker.value);
      const palette = PaletteLogic.createHslGradientPalette({
          baseHex,
          hue,
          saturation,
          lightness,
          count
      });

      const colors = palette.map((entry, index) => ({
          bg: entry.hsl || entry.hex,
          label: entry.hex,
          copyValue: entry.hex,
          selector: buildClassSelector(classPrefix, `hsl-gradient-color-${index + 1}`),
          declaration: entry.declaration
      }));

      hslElements.results.style.display = 'block';
      renderBlocks(hslElements.colorBlocks, colors);
      updateHslPreview();

      const cssText = colors
          .map((color) => `${color.selector} { ${color.declaration} }`)
          .join('\n');

      hslElements.cssOutput.textContent = cssText;
  }

  function copyHslCss() {
      copyCss(hslElements.cssOutput.textContent, hslElements.copyBtn, hslElements.copyIcon);
  }

  function generateHsvGradient() {
      const classPrefix = getClassPrefix('hsv');
      const hue = clamp(Number(hsvElements.hueInput.value), 0, 360);
      const saturation = clamp(Number(hsvElements.saturationInput.value), 0, 100);
      const value = clamp(Number(hsvElements.valueInput.value), 0, 100);
      let count = parseInt(hsvElements.countInput.value, 10);
      count = clamp(Number.isFinite(count) ? count : 12, 1, 36);
      hsvElements.hueInput.value = hue;
      hsvElements.hueSlider.value = hue;
      hsvElements.saturationInput.value = saturation;
      hsvElements.saturationSlider.value = saturation;
      hsvElements.valueInput.value = value;
      hsvElements.valueSlider.value = value;
      hsvElements.countInput.value = count;
      hsvElements.countSlider.value = count;

      if ([hue, saturation, value].some((entry) => !Number.isFinite(entry))) {
          alert('Please provide numeric values for hue, saturation, and value.');
          return;
      }

      const baseHex = normalizeHex(hsvElements.colorPicker.value);
      const palette = PaletteLogic.createHsvGradientPalette({
          baseHex,
          hue,
          saturation,
          value,
          count
      });

      const colors = palette.map((entry, index) => ({
          bg: entry.hex,
          label: entry.hex,
          copyValue: entry.hex,
          selector: buildClassSelector(classPrefix, `hsv-gradient-color-${index + 1}`),
          declaration: entry.declaration
      }));

      hsvElements.results.style.display = 'block';
      renderBlocks(hsvElements.colorBlocks, colors);
      updateHsvPreview();

      const cssText = colors
          .map((color) => `${color.selector} { ${color.declaration} }`)
          .join('\n');

      hsvElements.cssOutput.textContent = cssText;
  }

  function copyHsvCss() {
      copyCss(hsvElements.cssOutput.textContent, hsvElements.copyBtn, hsvElements.copyIcon);
  }

  function generateCmykGradient() {
      const classPrefix = getClassPrefix('cmyk');
      const cyan = clamp(Number(cmykElements.cyanInput.value), 0, 100);
      const magenta = clamp(Number(cmykElements.magentaInput.value), 0, 100);
      const yellow = clamp(Number(cmykElements.yellowInput.value), 0, 100);
      const key = clamp(Number(cmykElements.keyInput.value), 0, 100);
      let count = parseInt(cmykElements.countInput.value, 10);
      count = clamp(Number.isFinite(count) ? count : 12, 1, 36);

      setCmykComponentValues(cyan, magenta, yellow, key);
      cmykElements.countInput.value = count;
      cmykElements.countSlider.value = count;

      if ([cyan, magenta, yellow, key].some((entry) => !Number.isFinite(entry))) {
          alert('Please provide numeric values for CMYK.');
          return;
      }

      const palette = PaletteLogic.createCmykGradientPalette({
          c: cyan,
          m: magenta,
          y: yellow,
          k: key,
          count
      });

      const colors = palette.map((entry, index) => ({
          bg: entry.hex,
          label: entry.hex,
          copyValue: entry.hex,
          selector: buildClassSelector(classPrefix, `cmyk-gradient-color-${index + 1}`),
          declaration: entry.declaration
      }));

      cmykElements.results.style.display = 'block';
      renderBlocks(cmykElements.colorBlocks, colors);
      updateCmykPreview();
      evaluateCmykWarning(colors.map((color) => color.copyValue ?? color.label));

      const cssText = colors
          .map((color) => `${color.selector} { ${color.declaration} }`)
          .join('\n');

      cmykElements.cssOutput.textContent = cssText;
  }

  function copyCmykCss() {
      copyCss(cmykElements.cssOutput.textContent, cmykElements.copyBtn, cmykElements.copyIcon);
  }


  const harmonySchemeOrder = [
    { key: 'analogous', label: 'Analogous' },
    { key: 'complementary', label: 'Complementary' },
    { key: 'split-complementary', label: 'Split Complementary' },
    { key: 'triadic', label: 'Triadic' },
    { key: 'tetradic', label: 'Tetradic' }
  ];

  const dataVizTooltipContent = {
      sequential: 'Sequential palettes progress from low to high intensity, ideal for indicating ordered or magnitude-driven data.',
      diverging: 'Diverging palettes highlight deviations on either side of a midpoint, useful for visualizing change around a neutral value.',
      qualitative: 'Qualitative palettes assign distinct hues to categories without implying order, keeping each series equally weighted.'
  };

  function applyHarmonyTooltip(target, colors, baseHex, schemeLabel) {
    if (!target) {
        return;
    }

    if (!colors.length) {
        target.classList.remove('has-tooltip');
        target.removeAttribute('data-tooltip');
        target.removeAttribute('tabindex');
        return;
    }

    const items = colors.map((entry, index) => {
        if (index === 0) {
            return `${schemeLabel} overview based on base tone.`;
        }
        const contrast = contrastRatio(baseHex, entry.hex);
        let guidance = 'Provides strong contrast for text.';
        if (contrast < 3) {
            guidance = 'Low contrast – reserve for surfaces or accent outlines.';
        } else if (contrast < 4.5) {
            guidance = 'Works for large text/icons; adjust for body copy.';
        }
        return `${entry.note}: ${contrast.toFixed(2)}:1 vs base. ${guidance}`;
    });

    target.classList.add('has-tooltip');
    target.setAttribute('data-tooltip', items.join('\n'));
    target.setAttribute('tabindex', '0');
  }

  function applyDataVizTooltip(target, description) {
    if (!target) {
        return;
    }
    if (!description) {
        target.classList.remove('has-tooltip');
        target.removeAttribute('data-tooltip');
        target.removeAttribute('tabindex');
        return;
    }

    target.classList.add('has-tooltip');
    target.setAttribute('data-tooltip', description);
    if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '0');
    }
  }

  let simulationIdCounter = 0;

  function renderSimulations(container, colors) {
    if (!container) {
        return;
    }

    container.innerHTML = '';

    if (!colors.length) {
        container.style.display = 'none';
        return;
    }

    const scenarios = [
        { type: 'deuteranopia', label: 'Deuteranopia simulation', transform: (hex) => simulateColorBlindness(hex, 'deuteranopia') },
        { type: 'protanopia', label: 'Protanopia simulation', transform: (hex) => simulateColorBlindness(hex, 'protanopia') }
    ];

    container.style.display = 'grid';

    scenarios.forEach((scenario) => {
        const row = document.createElement('div');
        row.className = 'simulation-row';
        row.dataset.collapsed = 'true';

        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'simulation-toggle';
        const contentId = `${container.id || 'simulation'}-${scenario.type}-${simulationIdCounter += 1}`;
        toggle.setAttribute('aria-controls', contentId);
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = `<span>${scenario.label}</span><svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>`;

        const content = document.createElement('div');
        content.className = 'simulation-content';
        content.id = contentId;

        const blocksWrapper = document.createElement('div');
        blocksWrapper.className = 'color-blocks simulation-blocks';

        const simulated = colors.map((color, index) => {
            const hex = scenario.transform(color.copyValue ?? color.label);
            return {
                hex,
                declaration: `background-color: ${hex};`
            };
        });

        renderBlocks(blocksWrapper, simulated);
        content.appendChild(blocksWrapper);
        row.appendChild(toggle);
        row.appendChild(content);

        toggle.addEventListener('click', () => {
            const collapsed = row.dataset.collapsed === 'true';
            row.dataset.collapsed = collapsed ? 'false' : 'true';
            toggle.setAttribute('aria-expanded', collapsed ? 'true' : 'false');
        });

        container.appendChild(row);
    });
  }

  function generateHarmonyPalette() {
    const classPrefix = getClassPrefix('harmony');
    const baseHex = normalizeHex(harmonyElements.hexInput.value || '#5B21B6');
    if (!isValidHex(baseHex)) {
        alert('Please provide a valid hex color for the harmony base.');
        return;
    }

    const spread = clamp(Number(harmonyElements.spreadInput.value), 10, 90);
    const variance = clamp(Number(harmonyElements.lightnessInput.value), 0, 30);

    harmonyElements.spreadInput.value = spread;
    harmonyElements.spreadSlider.value = spread;
    harmonyElements.lightnessInput.value = variance;
    harmonyElements.lightnessSlider.value = variance;

    const palette = PaletteLogic.createHarmonyPalettes({
        baseHex,
        spread,
        variance
    });

    harmonySchemeOrder.forEach(({ key, label }) => {
        const column = harmonyElements.columns[key];
        if (!column) {
            return;
        }
        const source = palette[key] || [];

        const colors = source.map((entry, index) => ({
            bg: entry.hex,
            label: entry.hex,
            copyValue: entry.hex,
            note: entry.note,
            offset: entry.offset ?? 0,
            sortAngle: entry.offset ?? 0,
            originalIndex: index,
            selector: buildClassSelector(classPrefix, `harmony-${key}-color-${index + 1}`),
            declaration: `background-color: ${entry.hex};`
        }));

        const sortedColors = colors
            .slice()
            .sort((a, b) => {
                const diff = (a.sortAngle ?? 0) - (b.sortAngle ?? 0);
                if (Math.abs(diff) < 1e-6) {
                    return a.originalIndex - b.originalIndex;
                }
                return diff;
            });

        let baseIndex = sortedColors.findIndex((color) => color.note === 'Base');
        if (baseIndex < 0) {
            baseIndex = sortedColors.findIndex((color) => color.offset === 0);
        }

        if (baseIndex >= 0 && sortedColors.length > 1) {
            const [baseColor] = sortedColors.splice(baseIndex, 1);
            const insertPosition = Math.floor(sortedColors.length / 2);
            sortedColors.splice(insertPosition, 0, baseColor);
        }

        sortedColors.forEach((color, index) => {
            color.selector = buildClassSelector(classPrefix, `harmony-${key}-color-${index + 1}`);
            color.declaration = `background-color: ${color.bg};`;
        });

        renderBlocks(column.blocks, sortedColors);
        applyHarmonyTooltip(
            column.heading,
            sortedColors.map((color) => ({ hex: color.copyValue ?? color.label, note: color.note })),
            baseHex,
            label
        );

        const cssText = sortedColors
            .map((color) => `${color.selector} { ${color.declaration} }`)
            .join('\n');
        if (column.cssContainer) {
            column.cssContainer.style.display = sortedColors.length ? 'block' : 'none';
        }
        column.cssOutput.textContent = cssText;
    });
  }

  function copyHarmonyCss(scheme) {
    const column = harmonyElements.columns[scheme];
    if (!column) {
        return;
    }
    copyCss(column.cssOutput.textContent, column.copyBtn, column.copyIcon);
  }
  function generateDataVizPalette() {
    const classPrefix = getClassPrefix('dataViz');
    const baseHex = normalizeHex(dataVizElements.hexInput.value || '#2563EB');
    if (!isValidHex(baseHex)) {
        alert('Please enter a valid hex color for the base brand tone.');
        return;
    }

    let count = clamp(Number(dataVizElements.countInput.value), 3, 12);
    dataVizElements.countInput.value = count;
    dataVizElements.countSlider.value = count;

    const palette = PaletteLogic.createDataVizPalettes({ baseHex, count });

    Object.entries(palette).forEach(([type, hexes]) => {
        const column = dataVizElements.columns[type];
        if (!column) {
            return;
        }
        applyDataVizTooltip(column.heading, dataVizTooltipContent[type]);

        const colors = hexes.map((hex, index) => ({
            bg: hex,
            label: hex,
            copyValue: hex,
            selector: buildClassSelector(classPrefix, `dataviz-${type}-color-${index + 1}`),
            declaration: `background-color: ${hex};`
        }));

        renderBlocks(column.blocks, colors);
        renderSimulations(column.simulations, colors);

        const cssText = colors
            .map((color) => `${color.selector} { ${color.declaration} }`)
            .join('\n');
        if (column.cssContainer) {
            column.cssContainer.style.display = colors.length ? 'block' : 'none';
        }
        column.cssOutput.textContent = cssText;
    });
  }

  function copyDataVizCss(type) {
    const column = dataVizElements.columns[type];
    if (!column) {
        return;
    }
    copyCss(column.cssOutput.textContent, column.copyBtn, column.copyIcon);
  }

  // Bridge legacy helpers to shared modular utilities
  if (typeof window !== 'undefined') {
      window.clamp = ColorUtilities.clampValue;
      window.normalizeHex = ColorUtilities.normalizeHex;
      window.isValidHex = ColorUtilities.isValidHex;
      window.sanitiseClassPrefix = (value, fallback = 'palette') => (
          ColorUtilities.sanitizeClassPrefix(value, fallback)
      );
      window.hexToRgb = ColorUtilities.hexToRgb;
      window.rgbToHex = ColorUtilities.rgbToHex;
      window.hslToRgb = ColorUtilities.hslToRgb;
      window.hsvToRgb = ColorUtilities.hsvToRgb;
      window.cmykToRgb = ColorUtilities.cmykToRgb;
      window.rgbToHsl = ColorUtilities.rgbToHsl;
      window.rgbToHsv = ColorUtilities.rgbToHsv;
      window.rgbToCmyk = ColorUtilities.rgbToCmyk;
      window.mixHexColors = ColorUtilities.mixHexColors;
      window.simulateColorBlindness = ColorUtilities.simulateColorBlindness;
      window.copyTextToClipboard = ColorUtilities.copyTextToClipboard;
  }

  initClassPrefixInputs();

  UiHelpers.initTabs(document.querySelector('.tab-container'), {
      buttonSelector: '.tab-button',
      panelSelector: '.tab-panel',
      activeClass: 'active'
  });

  const generatorHandlers = {
      rgb: generateRgbGradient,
      hsl: generateHslGradient,
      hsv: generateHsvGradient,
      cmyk: generateCmykGradient,
      harmony: generateHarmonyPalette,
      dataviz: generateDataVizPalette
  };

  document.querySelectorAll('[data-generator]').forEach((button) => {
      const key = button.getAttribute('data-generator');
      const handler = generatorHandlers[key];
      if (typeof handler === 'function') {
          button.addEventListener('click', handler);
      }
  });

  const copyHandlers = {
      rgb: copyRgbCss,
      hsl: copyHslCss,
      hsv: copyHsvCss,
      cmyk: copyCmykCss,
      'harmony-analogous': () => copyHarmonyCss('analogous'),
      'harmony-complementary': () => copyHarmonyCss('complementary'),
      'harmony-split-complementary': () => copyHarmonyCss('split-complementary'),
      'harmony-triadic': () => copyHarmonyCss('triadic'),
      'harmony-tetradic': () => copyHarmonyCss('tetradic'),
      'dataviz-sequential': () => copyDataVizCss('sequential'),
      'dataviz-diverging': () => copyDataVizCss('diverging'),
      'dataviz-qualitative': () => copyDataVizCss('qualitative')
  };

  document.querySelectorAll('[data-copy]').forEach((button) => {
      const key = button.getAttribute('data-copy');
      const handler = copyHandlers[key];
      if (typeof handler === 'function') {
          button.addEventListener('click', handler);
      }
  });

  // Main execution context
  (function() {
      // Initialize tabs
      const tabContainer = document.querySelector('.tab-container');
      if (tabContainer) {
          UiHelpers.initTabs(tabContainer);
      }

      // Initialize other components
      initClassPrefixInputs();
  })();
---

<div class="container">
    <h1>🎨 Super Color Generator</h1>

    <div class="tab-container surface-card stack" style="--stack-gap: 24px;">
        <div class="tab-buttons">
            <button class="tab-button active" data-tab="rgbGenerator" type="button">RGB</button>
            <button class="tab-button" data-tab="hslGenerator" type="button">HSL</button>
            <button class="tab-button" data-tab="hsvGenerator" type="button">HSV</button>
            <button class="tab-button" data-tab="cmykGenerator" type="button">CMYK</button>
            <button class="tab-button" data-tab="harmonyGenerator" type="button">Advanced Harmonies</button>
            <button class="tab-button" data-tab="dataVizGenerator" type="button">Data Visualization</button>
        </div>

        <div class="tab-panel active" id="rgbGenerator">
            <div class="controls surface-card grid-auto rgb-controls" style="--grid-min: 220px;">
                <div class="preview-control stack" style="--stack-gap: 10px;">
                    <label for="fromColorPicker">From Color</label>
                    <div class="color-picker-row with-hex">
                        <div class="preview-picker" title="Pick from color">
                            <div class="preview-chip" id="fromPreview"></div>
                            <input type="color" id="fromColorPicker" value="#000000" aria-label="From color picker">
                        </div>
                        <div class="hex-input">
                            <input
                                type="text"
                                id="fromHex"
                                class="field-input"
                                value="#000000"
                                placeholder="#000000"
                                maxlength="7"
                                minlength="6"
                                required
                                spellcheck="false"
                                inputmode="text"
                                pattern="#?[0-9A-Fa-f]{6}"
                                aria-label="From color hex value"
                            >
                        </div>
                    </div>
                </div>

                <div class="preview-control stack" style="--stack-gap: 10px;">
                    <label for="toColorPicker">To Color</label>
                    <div class="color-picker-row with-hex">
                        <div class="preview-picker" title="Pick to color">
                            <div class="preview-chip" id="toPreview"></div>
                            <input type="color" id="toColorPicker" value="#ffffff" aria-label="To color picker">
                        </div>
                        <div class="hex-input">
                            <input
                                type="text"
                                id="toHex"
                                class="field-input"
                                value="#FFFFFF"
                                placeholder="#FFFFFF"
                                maxlength="7"
                                minlength="6"
                                required
                                spellcheck="false"
                                inputmode="text"
                                pattern="#?[0-9A-Fa-f]{6}"
                                aria-label="To color hex value"
                            >
                        </div>
                    </div>
                </div>

                <div class="segments-control">
                    <label for="segments">Colors in Gradient (2 – 64)</label>
                    <input type="number" id="segments" class="field-input" min="2" max="64" step="1" value="12" required>
                </div>

                <div class="prefix-control">
                    <label for="rgbClassPrefix">CSS Class Prefix</label>
                    <input
                        type="text"
                        id="rgbClassPrefix"
                        class="field-input"
                        value="palette-rgb"
                        placeholder="palette-rgb"
                        maxlength="24"
                        aria-label="RGB CSS class prefix"
                        spellcheck="false"
                    >
                </div>

                <button class="button button--primary" type="button" data-generator="rgb">Generate</button>
            </div>

            <div class="results" id="hexResults" style="display:none;">
                <div class="color-blocks" id="hexColorBlocks"></div>

                <div class="css-output">
                    <h3>CSS Classes</h3>
                    <button class="button copy-btn" id="hexCopyBtn" type="button" data-copy="rgb" title="Copy CSS">
                        <svg id="hexCopyIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    </button>
                    <pre id="hexCssOutput"></pre>
                </div>
            </div>
        </div>

        <div class="tab-panel" id="hslGenerator">
             <div class="controls surface-card tone-controls hsl-controls grid-auto" style="--grid-min: 220px;">
                 <div class="preview-control stack" style="--stack-gap: 10px;">
                     <label for="hslColorPicker">Color Picker</label>
                     <div class="color-picker-row with-rgb">
                         <div class="preview-picker" title="Pick a base color">
                             <div class="preview-chip" id="hslPreview"></div>
                             <input type="color" id="hslColorPicker" value="#1F7BEA" aria-label="Pick base color for HSL palette">
                         </div>
                         <div class="hex-input">
                            <input
                                type="text"
                                id="hslHexDisplay"
                                class="field-input"
                                value="#1F7BEA"
                                placeholder="#1F7BEA"
                                maxlength="7"
                                minlength="6"
                                spellcheck="false"
                                inputmode="text"
                                pattern="#?[0-9A-Fa-f]{6}"
                                aria-label="HSL hex value"
                            >
                        </div>
                     </div>
                 </div>

                 <div class="slider-control">
                     <label for="hslHueSlider">Starting Hue (0 – 360)</label>
                     <div class="slider-row">
                         <input type="range" id="hslHueSlider" class="field-range" min="0" max="360" step="1" value="200">
                         <input type="number" id="hslHueInput" class="field-input" min="0" max="360" step="1" value="200" aria-label="Hue value">
                     </div>
                 </div>

                 <div class="slider-control">
                     <label for="hslSaturationSlider">Saturation (%)</label>
                     <div class="slider-row">
                         <input type="range" id="hslSaturationSlider" class="field-range" min="0" max="100" step="1" value="80">
                         <input type="number" id="hslSaturationInput" class="field-input" min="0" max="100" step="1" value="80" aria-label="Saturation value">
                     </div>
                 </div>

                 <div class="slider-control">
                     <label for="hslLightnessSlider">Lightness (%)</label>
                     <div class="slider-row">
                         <input type="range" id="hslLightnessSlider" class="field-range" min="0" max="100" step="1" value="50">
                         <input type="number" id="hslLightnessInput" class="field-input" min="0" max="100" step="1" value="50" aria-label="Lightness value">
                     </div>
                 </div>

                 <div class="slider-control">
                     <label for="hslCountSlider">Colors in Palette (1 – 36)</label>
                     <div class="slider-row">
                         <input type="range" id="hslCountSlider" class="field-range" min="1" max="36" step="1" value="12">
                         <input type="number" id="hslCount" class="field-input" min="1" max="36" step="1" value="12" required aria-label="HSL colors count">
                     </div>
                 </div>

                 <div class="prefix-control">
                     <label for="hslClassPrefix">CSS Class Prefix</label>
                     <input
                         type="text"
                         id="hslClassPrefix"
                         class="field-input"
                         value="palette-hsl"
                         placeholder="palette-hsl"
                         maxlength="24"
                         aria-label="HSL CSS class prefix"
                         spellcheck="false"
                     >
                 </div>

                 <button class="button button--primary" type="button" data-generator="hsl">Generate</button>
             </div>

             <div class="results" id="hslResults" style="display:none;">
                 <div class="color-blocks" id="hslColorBlocks"></div>

                 <div class="css-output">
                     <h3>CSS Classes</h3>
                     <button class="button copy-btn" id="hslCopyBtn" type="button" data-copy="hsl" title="Copy CSS">
                         <svg id="hslCopyIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                             <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                             <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                         </svg>
                     </button>
                     <pre id="hslCssOutput"></pre>
                 </div>
             </div>
         </div>

         <div class="tab-panel" id="hsvGenerator">
             <div class="controls surface-card tone-controls hsv-controls grid-auto" style="--grid-min: 220px;">
                 <div class="preview-control stack" style="--stack-gap: 10px;">
                     <label for="hsvColorPicker">Color Picker</label>
                     <div class="color-picker-row with-rgb">
                         <div class="preview-picker" title="Pick a base color">
                             <div class="preview-chip" id="hsvPreview"></div>
                             <input type="color" id="hsvColorPicker" value="#33A0FF" aria-label="Pick base color for HSV palette">
                         </div>
                         <div class="hex-input">
                            <input
                                type="text"
                                id="hsvHexDisplay"
                                class="field-input"
                                value="#33A0FF"
                                placeholder="#33A0FF"
                                maxlength="7"
                                minlength="6"
                                spellcheck="false"
                                inputmode="text"
                                pattern="#?[0-9A-Fa-f]{6}"
                                aria-label="HSV hex value"
                            >
                        </div>
                     </div>
                 </div>

                 <div class="slider-control">
                     <label for="hsvHueSlider">Starting Hue (0 – 360)</label>
                     <div class="slider-row">
                         <input type="range" id="hsvHueSlider" class="field-range" min="0" max="360" step="1" value="200">
                         <input type="number" id="hsvHueInput" class="field-input" min="0" max="360" step="1" value="200" aria-label="Hue value">
                     </div>
                 </div>

                 <div class="slider-control">
                     <label for="hsvSaturationSlider">Saturation (%)</label>
                     <div class="slider-row">
                         <input type="range" id="hsvSaturationSlider" class="field-range" min="0" max="100" step="1" value="80">
                         <input type="number" id="hsvSaturationInput" class="field-input" min="0" max="100" step="1" value="80" aria-label="Saturation value">
                     </div>
                 </div>

                 <div class="slider-control">
                     <label for="hsvValueSlider">Value (Brightness %)</label>
                     <div class="slider-row">
                         <input type="range" id="hsvValueSlider" class="field-range" min="0" max="100" step="1" value="75">
                         <input type="number" id="hsvValueInput" class="field-input" min="0" max="100" step="1" value="75" aria-label="Value brightness">
                     </div>
                 </div>

                 <div class="slider-control">
                     <label for="hsvCountSlider">Colors in Palette (1 – 36)</label>
                     <div class="slider-row">
                         <input type="range" id="hsvCountSlider" class="field-range" min="1" max="36" step="1" value="12">
                         <input type="number" id="hsvCount" class="field-input" min="1" max="36" step="1" value="12" required aria-label="HSV colors count">
                     </div>
                 </div>

                 <div class="prefix-control">
                     <label for="hsvClassPrefix">CSS Class Prefix</label>
                     <input
                         type="text"
                         id="hsvClassPrefix"
                         class="field-input"
                         value="palette-hsv"
                         placeholder="palette-hsv"
                         maxlength="24"
                         aria-label="HSV CSS class prefix"
                         spellcheck="false"
                     >
                 </div>

                 <button class="button button--primary" type="button" data-generator="hsv">Generate</button>
             </div>

             <div class="results" id="hsvResults" style="display:none;">
                 <div class="color-blocks" id="hsvColorBlocks"></div>

                 <div class="css-output">
                     <h3>CSS Classes</h3>
                     <button class="button copy-btn" id="hsvCopyBtn" type="button" data-copy="hsv" title="Copy CSS">
                         <svg id="hsvCopyIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                             <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                             <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                         </svg>
                     </button>
                     <pre id="hsvCssOutput"></pre>
                 </div>
             </div>
         </div>

         <div class="tab-panel" id="cmykGenerator">
             <div class="controls surface-card tone-controls cmyk-controls grid-auto" style="--grid-min: 220px;">
                 <div class="preview-control stack" style="--stack-gap: 10px;">
                     <label for="cmykColorPicker">Color Picker</label>
                     <div class="color-picker-row with-rgb">
                         <div class="preview-picker" title="Pick a base color">
                             <div class="preview-chip" id="cmykPreview"></div>
                             <input type="color" id="cmykColorPicker" value="#4B7CF5" aria-label="Pick base color for CMYK palette">
                         </div>
                         <div class="hex-input">
                            <input
                                type="text"
                                id="cmykHexDisplay"
                                class="field-input"
                                value="#4B7CF5"
                                placeholder="#4B7CF5"
                                maxlength="7"
                                minlength="6"
                                spellcheck="false"
                                inputmode="text"
                                pattern="#?[0-9A-Fa-f]{6}"
                                aria-label="CMYK hex value"
                            >
                        </div>
                     </div>
                 </div>

                 <div class="cmyk-control">
                     <label for="cmykCyanSlider">Cyan (%)</label>
                     <div class="cmyk-row">
                         <input type="range" id="cmykCyanSlider" class="field-range" min="0" max="100" step="1" value="60">
                         <input type="number" id="cmykCyanInput" class="field-input" min="0" max="100" step="1" value="60" aria-label="Cyan value">
                     </div>
                 </div>

                 <div class="cmyk-control">
                     <label for="cmykMagentaSlider">Magenta (%)</label>
                     <div class="cmyk-row">
                         <input type="range" id="cmykMagentaSlider" class="field-range" min="0" max="100" step="1" value="30">
                         <input type="number" id="cmykMagentaInput" class="field-input" min="0" max="100" step="1" value="30" aria-label="Magenta value">
                     </div>
                 </div>

                 <div class="cmyk-control">
                     <label for="cmykYellowSlider">Yellow (%)</label>
                     <div class="cmyk-row">
                         <input type="range" id="cmykYellowSlider" class="field-range" min="0" max="100" step="1" value="0">
                         <input type="number" id="cmykYellowInput" class="field-input" min="0" max="100" step="1" value="0" aria-label="Yellow value">
                     </div>
                 </div>

                 <div class="cmyk-control">
                     <label for="cmykKeySlider">Key (Black %)</label>
                     <div class="cmyk-row">
                         <input type="range" id="cmykKeySlider" class="field-range" min="0" max="100" step="1" value="10">
                         <input type="number" id="cmykKeyInput" class="field-input" min="0" max="100" step="1" value="10" aria-label="Black value">
                     </div>
                 </div>

                 <div class="cmyk-control">
                     <label for="cmykCountSlider">Colors in Palette (1 – 36)</label>
                     <div class="cmyk-row">
                         <input type="range" id="cmykCountSlider" class="field-range" min="1" max="36" step="1" value="12">
                         <input type="number" id="cmykCount" class="field-input" min="1" max="36" step="1" value="12" required aria-label="CMYK colors count">
                     </div>
                 </div>

                 <div class="prefix-control">
                     <label for="cmykClassPrefix">CSS Class Prefix</label>
                     <input
                         type="text"
                         id="cmykClassPrefix"
                         class="field-input"
                         value="palette-cmyk"
                         placeholder="palette-cmyk"
                         maxlength="24"
                         aria-label="CMYK CSS class prefix"
                         spellcheck="false"
                     >
                 </div>

                 <button class="button button--primary" type="button" data-generator="cmyk">Generate</button>
             </div>

             <div class="gamut-warning" id="cmykGamutWarning" role="alert" aria-live="polite"></div>

             <div class="results" id="cmykResults" style="display:none;">
                 <div class="color-blocks" id="cmykColorBlocks"></div>

                 <div class="css-output">
                     <h3>CSS Classes</h3>
                     <button class="button copy-btn" id="cmykCopyBtn" type="button" data-copy="cmyk" title="Copy CSS">
                         <svg id="cmykCopyIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                             <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                             <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                         </svg>
                     </button>
                     <pre id="cmykCssOutput"></pre>
                 </div>
             </div>
         </div>

         <div class="tab-panel" id="harmonyGenerator">
             <div class="controls surface-card tone-controls harmony-controls grid-auto" style="--grid-min: 220px;">
                 <div class="preview-control stack" style="--stack-gap: 10px;">
                     <label for="harmonyColorPicker">Base Color</label>
                     <div class="color-picker-row with-rgb">
                         <div class="preview-picker" title="Pick a harmony base color">
                             <div class="preview-chip" id="harmonyPreview"></div>
                             <input type="color" id="harmonyColorPicker" value="#5B21B6" aria-label="Pick base color for harmony palette">
                         </div>
                         <div class="hex-input">
                            <input
                                type="text"
                                id="harmonyHexDisplay"
                                class="field-input"
                                value="#5B21B6"
                                placeholder="#5B21B6"
                                maxlength="7"
                                minlength="6"
                                spellcheck="false"
                                inputmode="text"
                                pattern="#?[0-9A-Fa-f]{6}"
                                aria-label="Harmony hex value"
                            >
                        </div>
                     </div>
                     <input type="hidden" id="harmonyHex" value="#5B21B6">
                 </div>

                 <div class="slider-control">
                     <label for="harmonySpreadSlider">Hue Spread (10 – 90°)</label>
                     <div class="slider-row">
                         <input type="range" id="harmonySpreadSlider" class="field-range" min="10" max="90" step="1" value="30">
                         <input type="number" id="harmonySpread" class="field-input" min="10" max="90" step="1" value="30" aria-label="Hue spread degrees">
                     </div>
                 </div>

                 <div class="slider-control">
                     <label for="harmonyLightnessSlider">Lightness Variance (0 – 30)</label>
                     <div class="slider-row">
                         <input type="range" id="harmonyLightnessSlider" class="field-range" min="0" max="30" step="1" value="8">
                         <input type="number" id="harmonyLightness" class="field-input" min="0" max="30" step="1" value="8" aria-label="Lightness variance">
                     </div>
                 </div>

                 <div class="prefix-control">
                     <label for="harmonyClassPrefix">CSS Class Prefix</label>
                     <input
                         type="text"
                         id="harmonyClassPrefix"
                         class="field-input"
                         value="palette-harmony"
                         placeholder="palette-harmony"
                         maxlength="24"
                         aria-label="Harmony CSS class prefix"
                         spellcheck="false"
                     >
                 </div>

                 <button class="button button--primary" type="button" data-generator="harmony">Generate</button>
             </div>

             <div class="harmony-columns" id="harmonyColumns">
                 <div class="harmony-column" data-scheme="analogous">
                     <h3>Analogous</h3>
                     <div class="color-blocks" id="harmonyAnalogousBlocks"></div>
                     <div class="css-output" id="harmonyAnalogousCssContainer" style="display:none;">
                         <h3>CSS Classes</h3>
                         <button class="button copy-btn" id="harmonyAnalogousCopyBtn" type="button" data-copy="harmony-analogous" title="Copy CSS">
                             <svg id="harmonyAnalogousCopyIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                 <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                 <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                             </svg>
                         </button>
                         <pre id="harmonyAnalogousCss"></pre>
                     </div>
                 </div>

                 <div class="harmony-column" data-scheme="complementary">
                     <h3>Complementary</h3>
                     <div class="color-blocks" id="harmonyComplementaryBlocks"></div>
                     <div class="css-output" id="harmonyComplementaryCssContainer" style="display:none;">
                         <h3>CSS Classes</h3>
                         <button class="button copy-btn" id="harmonyComplementaryCopyBtn" type="button" data-copy="harmony-complementary" title="Copy CSS">
                             <svg id="harmonyComplementaryCopyIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                 <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                 <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                             </svg>
                         </button>
                         <pre id="harmonyComplementaryCss"></pre>
                     </div>
                 </div>

                 <div class="harmony-column" data-scheme="split-complementary">
                     <h3>Split Complementary</h3>
                     <div class="color-blocks" id="harmonySplitComplementaryBlocks"></div>
                     <div class="css-output" id="harmonySplitComplementaryCssContainer" style="display:none;">
                         <h3>CSS Classes</h3>
                         <button class="button copy-btn" id="harmonySplitComplementaryCopyBtn" type="button" data-copy="harmony-split-complementary" title="Copy CSS">
                             <svg id="harmonySplitComplementaryCopyIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                 <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                 <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                             </svg>
                         </button>
                         <pre id="harmonySplitComplementaryCss"></pre>
                     </div>
                 </div>

                 <div class="harmony-column" data-scheme="triadic">
                     <h3>Triadic</h3>
                     <div class="color-blocks" id="harmonyTriadicBlocks"></div>
                     <div class="css-output" id="harmonyTriadicCssContainer" style="display:none;">
                         <h3>CSS Classes</h3>
                         <button class="button copy-btn" id="harmonyTriadicCopyBtn" type="button" data-copy="harmony-triadic" title="Copy CSS">
                             <svg id="harmonyTriadicCopyIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                 <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                 <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                             </svg>
                         </button>
                         <pre id="harmonyTriadicCss"></pre>
                     </div>
                 </div>

                 <div class="harmony-column" data-scheme="tetradic">
                     <h3>Tetradic</h3>
                     <div class="color-blocks" id="harmonyTetradicBlocks"></div>
                     <div class="css-output" id="harmonyTetradicCssContainer" style="display:none;">
                         <h3>CSS Classes</h3>
                         <button class="button copy-btn" id="harmonyTetradicCopyBtn" type="button" data-copy="harmony-tetradic" title="Copy CSS">
                             <svg id="harmonyTetradicCopyIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                 <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                 <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                             </svg>
                         </button>
                         <pre id="harmonyTetradicCss"></pre>
                     </div>
                 </div>
             </div>
         </div>

         <div class="tab-panel" id="dataVizGenerator">
             <div class="controls surface-card tone-controls data-viz-controls grid-auto" style="--grid-min: 220px;">
                 <div class="preview-control stack" style="--stack-gap: 10px;">
                     <label for="dataVizColorPicker">Brand Base Color</label>
                     <div class="color-picker-row with-rgb">
                         <div class="preview-picker" title="Pick a brand base color">
                             <div class="preview-chip" id="dataVizPreview"></div>
                             <input type="color" id="dataVizColorPicker" value="#2563EB" aria-label="Pick brand base color">
                         </div>
                         <div class="hex-input">
                            <input
                                type="text"
                                id="dataVizHexDisplay"
                                class="field-input"
                                value="#2563EB"
                                placeholder="#2563EB"
                                maxlength="7"
                                minlength="6"
                                spellcheck="false"
                                inputmode="text"
                                pattern="#?[0-9A-Fa-f]{6}"
                                aria-label="Brand hex value"
                            >
                        </div>
                     </div>
                     <input type="hidden" id="dataVizHex" value="#2563EB">
                 </div>
                 <div class="slider-control">
                     <label for="dataVizCountSlider">Series Size (3 – 12)</label>
                     <div class="slider-row">
                         <input type="range" id="dataVizCountSlider" class="field-range" min="3" max="12" step="1" value="6">
                         <input type="number" id="dataVizCount" class="field-input" min="3" max="12" step="1" value="6" aria-label="Palette size">
                     </div>
                 </div>

                 <div class="prefix-control">
                     <label for="dataVizClassPrefix">CSS Class Prefix</label>
                     <input
                         type="text"
                         id="dataVizClassPrefix"
                         class="field-input"
                         value="palette-dataviz"
                         placeholder="palette-dataviz"
                         maxlength="24"
                         aria-label="Data visualization CSS class prefix"
                         spellcheck="false"
                     >
                 </div>

                 <button class="button button--primary" type="button" data-generator="dataviz">Generate</button>
             </div>

             <div class="data-viz-columns" id="dataVizColumns">
                 <div class="data-viz-column" data-type="sequential">
                     <h3 class="has-tooltip" data-tooltip="Sequential palettes progress from light to dark, ideal for communicating ordered or magnitude data." tabindex="0">Sequential</h3>
                     <div class="color-blocks" id="dataVizSequentialBlocks"></div>
                     <div class="simulations" id="dataVizSequentialSimulations" style="display:none;"></div>
                     <div class="css-output" id="dataVizSequentialCssContainer" style="display:none;">
                         <h3>CSS Classes</h3>
                         <button class="button copy-btn" id="dataVizSequentialCopyBtn" type="button" data-copy="dataviz-sequential" title="Copy CSS">
                             <svg id="dataVizSequentialCopyIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                 <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                 <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                             </svg>
                         </button>
                         <pre id="dataVizSequentialCss"></pre>
                     </div>
                 </div>

                 <div class="data-viz-column" data-type="diverging">
                     <h3 class="has-tooltip" data-tooltip="Diverging palettes emphasize deviations on either side of a critical midpoint, such as gain versus loss." tabindex="0">Diverging</h3>
                     <div class="color-blocks" id="dataVizDivergingBlocks"></div>
                     <div class="simulations" id="dataVizDivergingSimulations" style="display:none;"></div>
                     <div class="css-output" id="dataVizDivergingCssContainer" style="display:none;">
                         <h3>CSS Classes</h3>
                         <button class="button copy-btn" id="dataVizDivergingCopyBtn" type="button" data-copy="dataviz-diverging" title="Copy CSS">
                             <svg id="dataVizDivergingCopyIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                 <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                 <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                             </svg>
                         </button>
                         <pre id="dataVizDivergingCss"></pre>
                     </div>
                 </div>

                 <div class="data-viz-column" data-type="qualitative">
                     <h3 class="has-tooltip" data-tooltip="Qualitative palettes assign distinct hues to categories without implying order, keeping each series equally weighted." tabindex="0">Qualitative</h3>
                     <div class="color-blocks" id="dataVizQualitativeBlocks"></div>
                     <div class="simulations" id="dataVizQualitativeSimulations" style="display:none;"></div>
                     <div class="css-output" id="dataVizQualitativeCssContainer" style="display:none;">
                         <h3>CSS Classes</h3>
                         <button class="button copy-btn" id="dataVizQualitativeCopyBtn" type="button" data-copy="dataviz-qualitative" title="Copy CSS">
                             <svg id="dataVizQualitativeCopyIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                 <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                 <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                             </svg>
                         </button>
                         <pre id="dataVizQualitativeCss"></pre>
                     </div>
                 </div>
             </div>
         </div>
     </div>

 </div>
