import { t } from '~/i18n';

function translateUI() {
  const elements = document.querySelectorAll('[data-i18n-key]');
  elements.forEach((element) => {
    const key = element.getAttribute('data-i18n-key');
    if (key) {
      element.innerHTML = t(key);
    }
  });
}

export function initializei18n() {
  if (typeof window === 'undefined') {
    return;
  }

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
