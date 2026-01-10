import typographyPlugin from '@tailwindcss/typography';
import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';

export default {
    content: ['./src/**/*.{astro,html,js,jsx,json,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                primary: 'var(--aw-color-primary)',
                secondary: 'var(--aw-color-secondary)',
                accent: 'var(--aw-color-accent)',
                default: 'var(--aw-color-text-default)',
                muted: 'var(--aw-color-text-muted)',
            },
            fontFamily: {
                sans: ['var(--aw-font-sans, ui-sans-serif)', ...defaultTheme.fontFamily.sans],
                serif: [
                    'var(--aw-font-serif, source-serif-pro)',
                    'Georgia',
                    'Cambria',
                    '"Times New Roman"',
                    'Times',
                    'serif',
                ],
                heading: ['var(--aw-font-heading, ui-sans-serif)', ...defaultTheme.fontFamily.sans],
            },
            fontSize: {
                xs: ['0.75rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
                sm: ['0.875rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
                base: ['18px', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
                lg: ['20px', { lineHeight: '1.6', letterSpacing: '-0.01em' }],
                xl: ['24px', { lineHeight: '1.6', letterSpacing: '-0.005em' }],
                '2xl': ['30px', { lineHeight: '1.4', letterSpacing: '0' }],
                '3xl': ['36px', { lineHeight: '1.3', letterSpacing: '0' }],
                '4xl': ['48px', { lineHeight: '1.2', letterSpacing: '0' }],
                '5xl': ['60px', { lineHeight: '1.1', letterSpacing: '0' }],
            },
            lineHeight: {
                none: '1',
                tight: '1.25',
                snug: '1.375',
                normal: '1.5',
                relaxed: '1.625',
                loose: '2',
                medium: '1.5',
                prose: '1.6',
                reading: '1.7',
            },

            animation: {
                fade: 'fadeInUp 1s both',
            },

            keyframes: {
                fadeInUp: {
                    '0%': { opacity: 0, transform: 'translateY(2rem)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [
        typographyPlugin,
        plugin(({ addVariant }) => {
            addVariant('intersect', '&:not([no-intersect])');
        }),
    ],
    darkMode: 'class',
};
