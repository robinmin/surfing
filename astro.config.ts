import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import cookieconsent from '@jop-software/astro-cookieconsent';
import sentry from '@sentry/astro';
import type { AstroIntegration } from 'astro';
import { defineConfig } from 'astro/config';
import compress from 'astro-compress';
import expressiveCode from 'astro-expressive-code';
import icon from 'astro-icon';
import pagefind from 'astro-pagefind';
import robotsTxt from 'astro-robots-txt';
import rehypeExternalLinks from 'rehype-external-links';
// import rehypeMermaid from 'rehype-mermaid'
import rehypeSlug from 'rehype-slug';
import remarkToc from 'remark-toc';
import {
    lazyImagesRehypePlugin,
    readingTimeRemarkPlugin,
    responsiveTablesRehypePlugin,
} from './src/utils/frontmatter';
import { surfingIntegration as surfing } from './vendor/integration';
import { loadConfig } from './vendor/integration/utils/loadConfig';

interface AppConfig {
    site: {
        site: string;
    };
    cookieConsent?: {
        enabled?: boolean;
    };
    build?: {
        incrementalContentCache?: boolean;
    };
    sentry: {
        project: string;
        org: string;
    };
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GENERATED_TURNSTILE_CONFIG_PATH = path.resolve(
    __dirname,
    './src/lib/turnstile-config/generated.config.ts'
);

// Load configuration to check if cookie consent is enabled
const config = (await loadConfig('./src/config.yaml')) as AppConfig;
const isCookieConsentEnabled = config?.cookieConsent?.enabled ?? true;
const isIncrementalContentCacheEnabled = config?.build?.incrementalContentCache ?? false;

// Extract domain from site URL for cookie configuration
const siteUrl = config?.site?.site || 'https://surfing.salty.vip';
const siteDomain = new URL(siteUrl).hostname;

// Set environment variables for client-side config access
process.env.PUBLIC_SENTRY_PROJECT = config?.sentry?.project || '4510129071783936';
process.env.PUBLIC_SENTRY_ORG = config?.sentry?.org || 'gobing-ai';

const hasExternalScripts = true; // Enable partytown for analytics
const whenExternalScripts = (items: (() => AstroIntegration) | (() => AstroIntegration)[] = []) =>
    hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

const whenCookieConsentEnabled = (
    items: (() => AstroIntegration) | (() => AstroIntegration)[] = []
) =>
    isCookieConsentEnabled ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

export default defineConfig({
    output: 'static',
    site: config.site.site,

    // Configure build cache for faster incremental builds
    // In Astro 5, content layer caching is built-in and automatic
    ...(isIncrementalContentCacheEnabled && {
        cacheDir: './.astro/cache',
    }),

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
        mdx({
            extendMarkdownConfig: true,
        }),
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
                // Note: dataLayer.push is intentionally NOT forwarded
                // GA4 runs in the main thread and needs direct access to dataLayer
                // Forwarding it to Partytown worker would prevent GA4 from seeing events
                config: { forward: [] },
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
                    analytics: {},
                    marketing: {},
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
                                                    description:
                                                        'Google Analytics cookie used to distinguish users.',
                                                    expiration: '2 years',
                                                },
                                                {
                                                    name: '_ga_*',
                                                    domain: siteDomain,
                                                    description:
                                                        'Google Analytics cookie used to persist session state.',
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
        // Only enable Sentry in production with proper auth token
        ...(process.env.NODE_ENV === 'production' && process.env.SENTRY_AUTH_TOKEN
            ? [
                  sentry({
                      sourceMapsUploadOptions: {
                          authToken: process.env.SENTRY_AUTH_TOKEN,
                          project: config.sentry.project,
                          org: config.sentry.org,
                          telemetry: false,
                      },
                  }),
              ]
            : []),
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
            // rehypetypeMermaid,
        ],
        syntaxHighlight: false, // Disabled because we use astro-expressive-code
    },

    vite: {
        plugins: [
            {
                name: 'fetch-turnstile-config',
                async buildStart() {
                    const cli = process.argv.join(' ');
                    const isAstroBuild = /\bbuild\b/.test(cli);
                    const isAstroCheck = /\bcheck\b/.test(cli);
                    const isExplicitFetch = process.env.FETCH_TURNSTILE_CONFIG === 'true';

                    // Skip during type checking or if module runner is closed
                    try {
                        // Fetch config for real builds by default, or when explicitly enabled.
                        // Skip for type checks and regular dev unless explicitly requested.
                        if ((!isAstroBuild && !isExplicitFetch) || isAstroCheck) {
                            console.log(
                                'ℹ️  Skipping Turnstile config fetch (not a build or explicit fetch)'
                            );
                            return;
                        }

                        console.log('🔄 Fetching Turnstile configuration...');
                        execFileSync(process.execPath, ['scripts/fetch-turnstile-config.mjs'], {
                            stdio: 'inherit',
                            cwd: process.cwd(),
                            env: process.env,
                        });
                    } catch (error: unknown) {
                        // Ignore module-runner shutdown only for non-production checks.
                        // In production builds we must fail hard so Turnstile config
                        // cannot be silently skipped.
                        const err = error as Error;
                        if (
                            err.message?.includes('module runner has been closed') &&
                            isAstroCheck
                        ) {
                            console.log(
                                'ℹ️  Skipping Turnstile config fetch (module runner closed during type check)'
                            );
                            return;
                        }
                        if (!isExplicitFetch && fs.existsSync(GENERATED_TURNSTILE_CONFIG_PATH)) {
                            console.warn(
                                '⚠️ Falling back to existing Turnstile configuration snapshot'
                            );
                            return;
                        }
                        console.error('❌ Failed to fetch Turnstile config:', error);
                        throw new Error(
                            'Build failed: Could not fetch application configuration from Turnstile API'
                        );
                    }
                },
            },
        ],
        resolve: {
            alias: {
                '~': path.resolve(__dirname, './src'),
                '@contents': path.resolve(__dirname, './contents'),
                '@assets': path.resolve(__dirname, './assets'),
                '@turnstile/client': path.resolve(__dirname, '../turnstile/packages/client/src'),
                '@turnstile/api-client-core': path.resolve(
                    __dirname,
                    '../turnstile/packages/api-client-core/src'
                ),
            },
        },
        server: {
            fs: {
                allow: [path.resolve(__dirname, '../turnstile')],
            },
        },
    },
});
