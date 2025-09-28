import { getPermalink, getAsset } from './permalinks';
import { getServerTranslation, DEFAULT_LANGUAGE, type SupportedLanguage } from '~/i18n';

export function getLocalizedHeaderData(lang: SupportedLanguage = DEFAULT_LANGUAGE) {
  const t = getServerTranslation(lang);

  return {
    links: [
      {
        text: 'Content',
        links: [
          {
            text: t('nav.browse'),
            href: getPermalink('/browse'),
          },
          {
            text: t('nav.articles'),
            href: getPermalink('/articles'),
          },
          {
            text: t('nav.showcase'),
            href: getPermalink('/showcase'),
          },
          {
            text: t('nav.documents'),
            href: getPermalink('/documents'),
          },
        ],
      },
      {
        text: t('nav.about'),
        href: getPermalink('/about'),
      },
    ],
    actions: [{ text: 'Explore', href: '/browse', icon: 'tabler:compass' }],
  };
}

export function getLocalizedFooterData(lang: SupportedLanguage = DEFAULT_LANGUAGE) {
  const t = getServerTranslation(lang);

  return {
    links: [
      {
        title: 'Content',
        links: [
          { text: t('nav.browse'), href: '/browse' },
          { text: t('nav.articles'), href: '/articles' },
          { text: t('nav.showcase'), href: '/showcase' },
          { text: t('nav.documents'), href: '/documents' },
        ],
      },
      {
        title: 'Platform',
        links: [
          { text: 'AI Integration', href: '#' },
          { text: 'Obsidian Support', href: '#' },
          { text: 'RSS Feeds', href: '/rss.xml' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { text: 'Documentation', href: '#' },
          { text: 'Content Guidelines', href: '#' },
          { text: 'API Reference', href: '#' },
          { text: 'Status', href: '#' },
        ],
      },
      {
        title: 'Community',
        links: [
          { text: t('nav.about'), href: '/about' },
          { text: 'Contributors', href: '#' },
          { text: 'GitHub', href: 'https://github.com/robin/surfing' },
          { text: 'Support', href: '#' },
        ],
      },
    ],
    secondaryLinks: [
      { text: 'Terms', href: getPermalink('/terms') },
      { text: 'Privacy Policy', href: getPermalink('/privacy') },
    ],
    socialLinks: [
      { ariaLabel: 'RSS All Content', icon: 'tabler:rss', href: getAsset('/rss.xml') },
      { ariaLabel: 'RSS Articles', icon: 'tabler:rss', href: getAsset('/articles/rss.xml') },
      { ariaLabel: 'RSS Showcase', icon: 'tabler:rss', href: getAsset('/showcase/rss.xml') },
      { ariaLabel: 'RSS Documents', icon: 'tabler:rss', href: getAsset('/documents/rss.xml') },
      { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/robin/surfing' },
    ],
    footNote: `
      AI-Powered Content Platform · Built for Creators
    `,
  };
}