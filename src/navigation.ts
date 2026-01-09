import { getPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Content',
      links: [
        {
          text: 'Browse All',
          href: getPermalink('/browse'),
        },
        {
          text: 'Articles',
          href: getPermalink('/articles'),
        },
        {
          text: 'Showcase',
          href: getPermalink('/showcase'),
        },
        {
          text: 'Documents',
          href: getPermalink('/documents'),
        },
        {
          text: 'Cheatsheets',
          href: getPermalink('/cheatsheets'),
        },
      ],
    },
    {
      text: 'Cheatsheets',
      href: getPermalink('/cheatsheets'),
    },
    {
      text: 'Pricing',
      href: getPermalink('/pricing'),
    },
    {
      text: 'About',
      href: getPermalink('/about'),
    },
  ],
  actions: [{ text: 'Explore', href: '/browse', icon: 'tabler:compass' }],
};

export const footerData = {
  links: [
    {
      title: 'Content',
      links: [
        { text: 'Browse All', href: '/browse' },
        { text: 'Articles', href: '/articles' },
        { text: 'Showcase', href: '/showcase' },
        { text: 'Documents', href: '/documents' },
        { text: 'Cheatsheets', href: '/cheatsheets' },
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
        { text: 'About', href: '/about' },
        { text: 'Contributors', href: '#' },
        { text: 'GitHub', href: 'https://github.com/robinmin/surfing' },
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
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/robinmin/surfing' },
  ],
  footNote: `
  Surfing - AI-Powered Content Platform for Creators
  `,
};
