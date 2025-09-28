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
      ],
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
