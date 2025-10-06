import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from 'astro-compress';
import type { AstroIntegration } from 'astro';

import expressiveCode from 'astro-expressive-code';
import pagefind from 'astro-pagefind';
import robotsTxt from 'astro-robots-txt';

import surfing from './vendor/integration';
import cookieconsent from '@jop-software/astro-cookieconsent';

import { readingTimeRemarkPlugin, responsiveTablesRehypePlugin, lazyImagesRehypePlugin } from './src/utils/frontmatter';
import loadConfig from './vendor/integration/utils/loadConfig';
import rehypeMermaid from 'rehype-mermaid';
import remarkToc from 'remark-toc';
import rehypeSlug from 'rehype-slug';
import rehypeExternalLinks from 'rehype-external-links';

import sentry from '@sentry/astro';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load configuration to check if cookie consent is enabled
const config = (await loadConfig('./src/config.yaml')) as any;
const isCookieConsentEnabled = config?.cookieConsent?.enabled ?? true;

// Extract domain from site URL for cookie configuration
const siteUrl = config?.site?.site || 'https://surfing.salty.vip';
const siteDomain = new URL(siteUrl).hostname;

// Set environment variables for client-side config access
process.env.PUBLIC_SENTRY_PROJECT = config?.sentry?.project || '4510129071783936';
process.env.PUBLIC_SENTRY_ORG = config?.sentry?.org || '40fintech';

const hasExternalScripts = true; // Enable partytown for analytics
const whenExternalScripts = (items: (() => AstroIntegration) | (() => AstroIntegration)[] = []) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

const whenCookieConsentEnabled = (items: (() => AstroIntegration) | (() => AstroIntegration)[] = []) =>
  isCookieConsentEnabled ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

export default defineConfig({
  output: 'static',
  site: config.site.site,

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh', 'ja'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    expressiveCode({
      themes: ['github-dark'],
      styleOverrides: {
        borderRadius: '0.5rem',
      },
    }),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
        'flat-color-icons': [
          'template',
          'gallery',
          'approval',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
      },
    }),
    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),
    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),
    surfing({
      config: './src/config.yaml',
    }),
    pagefind(),
    robotsTxt({
      sitemap: true,
    }),
    ...whenCookieConsentEnabled(() =>
      cookieconsent({
        guiOptions: {
          consentModal: {
            layout: 'box',
            position: 'bottom right',
            equalWeightButtons: true,
            flipButtons: false,
          },
          preferencesModal: {
            layout: 'box',
            position: 'right',
            equalWeightButtons: true,
            flipButtons: false,
          },
        },
        categories: {
          necessary: {
            readOnly: true,
          },
          analytics: {
            services: {
              ga4: {
                label: 'Google Analytics 4',
                onAccept: () => {
                  console.log('Google Analytics 4 accepted');
                  // Trigger consent update for Google Analytics
                  if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('consent', 'update', {
                      analytics_storage: 'granted',
                    });
                  }
                },
                onReject: () => {
                  console.log('Google Analytics 4 rejected');
                  // Ensure analytics storage remains denied
                  if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('consent', 'update', {
                      analytics_storage: 'denied',
                    });
                  }
                },
              },
            },
          },
          marketing: {
            services: {
              google_ads: {
                label: 'Google Ads',
                onAccept: () => {
                  console.log('Google Ads accepted');
                  // Trigger consent update for marketing/ads
                  if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('consent', 'update', {
                      ad_storage: 'granted',
                      ad_user_data: 'granted',
                      ad_personalization: 'granted',
                    });
                  }
                },
                onReject: () => {
                  console.log('Google Ads rejected');
                  // Ensure marketing storage remains denied
                  if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('consent', 'update', {
                      ad_storage: 'denied',
                      ad_user_data: 'denied',
                      ad_personalization: 'denied',
                    });
                  }
                },
              },
            },
          },
        },
        language: {
          default: 'en',
          translations: {
            en: {
              consentModal: {
                title: 'We value your privacy',
                description:
                  'We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.',
                acceptAllBtn: 'Accept All',
                acceptNecessaryBtn: 'Reject All',
                showPreferencesBtn: 'Manage Individual Preferences',
                footer: '<a href="/privacy">Privacy Policy</a>\n<a href="/terms">Terms of Service</a>',
              },
              preferencesModal: {
                title: 'Cookie Preferences',
                acceptAllBtn: 'Accept All',
                acceptNecessaryBtn: 'Reject All',
                savePreferencesBtn: 'Save Preferences',
                closeIconLabel: 'Close modal',
                serviceCounterLabel: 'Service|Services',
                sections: [
                  {
                    title: 'Cookie Usage',
                    description:
                      'We use cookies to ensure the basic functionalities of the website and to enhance your online experience. You can choose for each category to opt-in/out whenever you want.',
                  },
                  {
                    title: 'Strictly Necessary Cookies',
                    description:
                      'These cookies are essential for the proper functioning of the website. Without these cookies, the website would not work properly.',
                    linkedCategory: 'necessary',
                  },
                  {
                    title: 'Analytics Cookies',
                    description:
                      'These cookies collect information about how you use the website, which pages you visited and which links you clicked on. All of the data is anonymized and cannot be used to identify you.',
                    linkedCategory: 'analytics',
                    cookieTable: {
                      headers: {
                        name: 'Name',
                        domain: 'Domain',
                        description: 'Description',
                        expiration: 'Expiration',
                      },
                      body: [
                        {
                          name: '_ga',
                          domain: siteDomain,
                          description: 'Google Analytics cookie used to distinguish users.',
                          expiration: '2 years',
                        },
                        {
                          name: '_ga_*',
                          domain: siteDomain,
                          description: 'Google Analytics cookie used to persist session state.',
                          expiration: '2 years',
                        },
                      ],
                    },
                  },
                  {
                    title: 'Marketing Cookies',
                    description:
                      'These cookies track your onlines activity to help advertisers deliver more relevant advertising or to limit how many times you see an ad.',
                    linkedCategory: 'marketing',
                  },
                ],
              },
            },
          },
        },
      })
    ),
    sentry({
      sourceMapsUploadOptions: {
        authToken: process.env.SENTRY_AUTH_TOKEN,
        project: config.sentry.project,
        org: config.sentry.org,
      },
    }),
  ],

  image: {
    domains: ['cdn.pixabay.com'],
  },

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin, [remarkToc, { heading: 'contents', maxDepth: 3 }]],
    rehypePlugins: [
      responsiveTablesRehypePlugin,
      lazyImagesRehypePlugin,
      rehypeSlug,
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: ['noopener', 'noreferrer'],
        },
      ],
      rehypeMermaid,
    ],
    syntaxHighlight: false, // Disabled because we use astro-expressive-code
  },

  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
        '@contents': path.resolve(__dirname, './contents'),
        '@assets': path.resolve(__dirname, './assets'),
      },
    },
  },
});
