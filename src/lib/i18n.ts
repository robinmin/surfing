import { t } from '~/i18n';

function translateUI() {
  // Translate element content (innerHTML)
  const elements = document.querySelectorAll('[data-i18n-key]');
  elements.forEach((element) => {
    const key = element.getAttribute('data-i18n-key');
    if (key) {
      element.innerHTML = t(key);
    }
  });

  // Translate title attributes (tooltips)
  const titleElements = document.querySelectorAll('[data-i18n-title]');
  titleElements.forEach((element) => {
    const key = element.getAttribute('data-i18n-title');
    if (key) {
      element.setAttribute('title', t(key));
    }
  });

  // Translate aria-label attributes
  const ariaElements = document.querySelectorAll('[data-i18n-aria]');
  ariaElements.forEach((element) => {
    const key = element.getAttribute('data-i18n-aria');
    if (key) {
      element.setAttribute('aria-label', t(key));
    }
  });
}

export function initializei18n() {
  if (typeof window === 'undefined') {
    return;
  }

  // Make translation function globally available
  (window as any).t = t;

  // Initial translation
  translateUI();

  // Listen for language changes
  window.addEventListener('languageChange', () => {
    translateUI();
  });

  // Handle language changes from other tabs
  window.addEventListener('storage', (event) => {
    if (event.key === 'surfing-language') {
      translateUI();
    }
  });
}
