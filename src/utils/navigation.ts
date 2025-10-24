import { getPermalink, getAsset } from './permalinks';

export function getLocalizedHeaderData() {
  return {
    links: [
      {
        textKey: 'nav.content',
        links: [
          {
            textKey: 'nav.browse',
            href: getPermalink('/browse'),
          },
          {
            textKey: 'nav.articles',
            href: getPermalink('/articles'),
          },
          {
            textKey: 'nav.showcase',
            href: getPermalink('/showcase'),
          },
          {
            textKey: 'nav.documents',
            href: getPermalink('/documents'),
          },
          {
            textKey: 'nav.cheatsheets',
            href: getPermalink('/cheatsheets'),
          },
        ],
      },
      {
        textKey: 'nav.cheatsheets',
        href: getPermalink('/cheatsheets'),
      },
      {
        textKey: 'nav.about',
        href: getPermalink('/about'),
      },
    ],
    actions: [{ textKey: 'nav.explore', href: '/browse', icon: 'tabler:compass' }],
  };
}

export function getLocalizedFooterData() {
  return {
    links: [
      {
        titleKey: 'footer.sections.content',
        links: [
          { textKey: 'nav.browse', href: '/browse' },
          { textKey: 'nav.articles', href: '/articles' },
          { textKey: 'nav.showcase', href: '/showcase' },
          { textKey: 'nav.documents', href: '/documents' },
          { textKey: 'nav.cheatsheets', href: '/cheatsheets' },
        ],
      },
      {
        titleKey: 'footer.sections.platform',
        links: [
          { textKey: 'footer.links.aiIntegration', href: '#' },
          { textKey: 'footer.links.obsidianSupport', href: '#' },
          { textKey: 'footer.links.rssFeeds', href: '/rss.xml' },
        ],
      },
      {
        titleKey: 'footer.sections.resources',
        links: [
          { textKey: 'footer.links.documentation', href: '#' },
          { textKey: 'footer.links.contentGuidelines', href: '#' },
          { textKey: 'footer.links.apiReference', href: '#' },
          { textKey: 'footer.links.status', href: '#' },
        ],
      },
      {
        titleKey: 'footer.sections.community',
        links: [
          { textKey: 'nav.about', href: '/about' },
          { textKey: 'footer.links.contributors', href: '#' },
          { textKey: 'footer.links.github', href: 'https://github.com/robinmin/surfing' },
          { textKey: 'footer.links.support', href: '#' },
        ],
      },
    ],
    secondaryLinks: [
      { textKey: 'common.terms', href: getPermalink('/terms') },
      { textKey: 'common.privacyPolicy', href: getPermalink('/privacy') },
    ],
    socialLinks: [
      { ariaLabel: 'RSS All Content', icon: 'tabler:rss', href: getAsset('/rss.xml') },
      { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/robinmin/surfing' },
    ],
    footNoteKey: 'footer.tagline',
  };
}
