import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('permalinks', () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it('normalizes slugs and builds canonical URLs', async () => {
        const { cleanSlug, getCanonical, trimSlash } = await import('~/utils/permalinks');

        expect(trimSlash('/nested/path/')).toBe('nested/path');
        expect(cleanSlug('Hello World/Ni Hao')).toBe('hello-world/ni-hao');
        expect(getCanonical('/articles/post')).toBe('https://surfing.test/articles/post');
        expect(getCanonical('/articles/post/')).toBe('https://surfing.test/articles/post');
    });

    it('creates the expected permalinks for internal and external targets', async () => {
        const {
            BLOG_BASE,
            CATEGORY_BASE,
            TAG_BASE,
            getAsset,
            getBlogPermalink,
            getHomePermalink,
            getPermalink,
        } = await import('~/utils/permalinks');

        expect(BLOG_BASE).toBe('articles');
        expect(CATEGORY_BASE).toBe('category');
        expect(TAG_BASE).toBe('tag');
        expect(getHomePermalink()).toBe('/base');
        expect(getBlogPermalink()).toBe('/base/articles');
        expect(getAsset('/rss.xml')).toBe('/base/rss.xml');
        expect(getPermalink('', 'home')).toBe('/base');
        expect(getPermalink('', 'blog')).toBe('/base/articles');
        expect(getPermalink('/feed.xml', 'asset')).toBe('/base/feed.xml');
        expect(getPermalink('/browse')).toBe('/base/browse');
        expect(getPermalink('advanced-guides', 'category')).toBe('/base/category/advanced-guides');
        expect(getPermalink('typescript', 'tag')).toBe('/base/tag/typescript');
        expect(getPermalink('post/path', 'post')).toBe('/base/post/path');
        expect(getPermalink('https://example.com')).toBe('https://example.com');
        expect(getPermalink('#faq')).toBe('#faq');
        expect(getPermalink('javascript:void(0)')).toBe('javascript:void(0)');
    });

    it('recursively rewrites nested menu href values', async () => {
        const { applyGetPermalinks } = await import('~/utils/permalinks');

        const menu = {
            title: 'Root',
            href: '/pricing',
            links: [
                { href: { type: 'home' } },
                { href: { type: 'blog' } },
                { href: { type: 'asset', url: '/feed.xml' } },
                { href: { url: '/about', type: 'page' } },
            ],
        };

        expect(applyGetPermalinks(menu)).toEqual({
            title: 'Root',
            href: '/base/pricing',
            links: [
                { href: '/base' },
                { href: '/base/articles' },
                { href: '/base/feed.xml' },
                { href: '/base/about' },
            ],
        });

        expect(applyGetPermalinks([{ href: '/docs' }, 'plain'])).toEqual([
            { href: '/base/docs' },
            'plain',
        ]);
    });

    it('supports trailing-slash canonicalization when the site config requires it', async () => {
        vi.doMock('astrowind:config', () => ({
            APP_BLOG: {
                list: { pathname: '/articles' },
                category: { pathname: '/category' },
                tag: { pathname: '/tag' },
                post: { permalink: '/articles/%slug%' },
            },
            I18N: {
                language: 'en-US',
            },
            SITE: {
                site: 'https://surfing.test',
                base: '/base',
                trailingSlash: true,
            },
        }));

        const { getCanonical } = await import('~/utils/permalinks');
        expect(getCanonical('/articles/post')).toBe('https://surfing.test/articles/post/');
    });

    it('falls back sensibly when optional blog config pieces are missing', async () => {
        vi.doMock('astrowind:config', () => ({
            APP_BLOG: {
                list: { pathname: '/articles' },
            },
            I18N: {
                language: 'en-US',
            },
            SITE: {
                site: 'https://surfing.test',
                base: '/',
                trailingSlash: false,
            },
        }));

        const { POST_PERMALINK_PATTERN, TAG_BASE } = await import('~/utils/permalinks');
        expect(TAG_BASE).toBe('tag');
        expect(POST_PERMALINK_PATTERN).toBe('articles/%slug%');
    });
});
