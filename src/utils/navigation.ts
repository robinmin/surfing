import { getPermalink, getAsset } from './permalinks';
import { getServerTranslation, DEFAULT_LANGUAGE, type SupportedLanguage } from '~/i18n';

export function getLocalizedHeaderData(lang: SupportedLanguage = DEFAULT_LANGUAGE) {
  const t = getServerTranslation(lang);

  return {
    links: [
      {
        text: t('nav.content'),
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
          {
            text: t('nav.cheatsheets'),
            href: getPermalink('/cheatsheets'),
          },
        ],
      },
      {
        text: t('nav.cheatsheets'),
        href: getPermalink('/cheatsheets'),
      },
      {
        text: t('nav.about'),
        href: getPermalink('/about'),
      },
    ],
    actions: [{ text: t('nav.explore'), href: '/browse', icon: 'tabler:compass' }],
  };
}

export function getLocalizedFooterData(lang: SupportedLanguage = DEFAULT_LANGUAGE) {
  const t = getServerTranslation(lang);

  return {
    links: [
      {
        title: t('footer.sections.content'),
        links: [
          { text: t('nav.browse'), href: '/browse' },
          { text: t('nav.articles'), href: '/articles' },
          { text: t('nav.showcase'), href: '/showcase' },
          { text: t('nav.documents'), href: '/documents' },
          { text: t('nav.cheatsheets'), href: '/cheatsheets' },
        ],
      },
      {
        title: t('footer.sections.platform'),
        links: [
          { text: t('footer.links.aiIntegration'), href: '#' },
          { text: t('footer.links.obsidianSupport'), href: '#' },
          { text: t('footer.links.rssFeeds'), href: '/rss.xml' },
        ],
      },
      {
        title: t('footer.sections.resources'),
        links: [
          { text: t('footer.links.documentation'), href: '#' },
          { text: t('footer.links.contentGuidelines'), href: '#' },
          { text: t('footer.links.apiReference'), href: '#' },
          { text: t('footer.links.status'), href: '#' },
        ],
      },
      {
        title: t('footer.sections.community'),
        links: [
          { text: t('nav.about'), href: '/about' },
          { text: t('footer.links.contributors'), href: '#' },
          { text: t('footer.links.github'), href: 'https://github.com/robin/surfing' },
          { text: t('footer.links.support'), href: '#' },
        ],
      },
    ],
    secondaryLinks: [
      { text: t('common.terms'), href: getPermalink('/terms') },
      { text: t('common.privacyPolicy'), href: getPermalink('/privacy') },
    ],
    socialLinks: [
      { ariaLabel: 'RSS All Content', icon: 'tabler:rss', href: getAsset('/rss.xml') },
      { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/robin/surfing' },
    ],
    footNote: t('footer.tagline'),
  };
}
