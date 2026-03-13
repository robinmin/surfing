import { beforeEach, describe, expect, it } from 'vitest';

import { getCollection } from 'astro:content';
import {
    extractCategories,
    extractContentMetadata,
    extractTags,
    filterContent,
    getAllContent,
    getContentUrl,
    getRelatedContent,
    parseObsidianFrontmatter,
    sortContent,
} from '~/utils/content';

const getCollectionMock = getCollection as ReturnType<typeof import('vitest')['vi']['fn']>;

const baseEntries = {
    articles: [
        {
            id: 'en/one',
            data: {
                slug: 'article-one',
                title: 'Article One',
                description: 'First article',
                excerpt: 'Deep dive',
                tags: ['AI', 'TypeScript'],
                category: 'Guides',
                featured: true,
                draft: false,
                publishDate: new Date('2025-01-02'),
                readingTime: 7,
            },
        },
        {
            id: 'en/two',
            data: {
                slug: 'article-two',
                title: 'Article Two',
                description: 'Second article',
                tags: ['TypeScript'],
                category: 'Guides',
                featured: false,
                draft: true,
                updateDate: new Date('2024-02-10'),
                readingTime: 3,
            },
        },
    ],
    showcase: [
        {
            id: 'demo/project',
            data: {
                slug: 'demo-project',
                title: 'Demo Project',
                tags: ['AI'],
                category: 'Projects',
            },
        },
    ],
    documents: [
        {
            id: 'doc/start',
            data: {
                slug: 'getting-started',
                title: 'Getting Started',
                tags: ['docs'],
                category: 'Reference',
            },
        },
    ],
};

describe('content utilities', () => {
    beforeEach(() => {
        getCollectionMock.mockReset();
        getCollectionMock.mockImplementation(async (name: keyof typeof baseEntries) => baseEntries[name]);
    });

    it('parses frontmatter values with scalar, boolean, numeric, date, and array handling', () => {
        const parsed = parseObsidianFrontmatter(`---
title: "Hello"
# comment
invalidline
draft: false
views: 42
publishDate: 2025-01-01
tags: [astro, "TypeScript"]
---
Body copy`);

        expect(parsed.frontmatter).toEqual({
            title: 'Hello',
            draft: false,
            views: 42,
            publishDate: new Date('2025-01-01'),
            tags: ['astro', 'TypeScript'],
        });
        expect(parsed.body).toBe('Body copy');
        expect(parseObsidianFrontmatter('No frontmatter').frontmatter).toEqual({});
    });

    it('extracts derived content metadata from markdown text', () => {
        const metadata = extractContentMetadata(`# Heading

This is a paragraph with a [link](https://example.com).

## Details

Another paragraph.`);

        expect(metadata.wordCount).toBeGreaterThan(5);
        expect(metadata.readingTime).toBe(1);
        expect(metadata.headings).toEqual(['Heading', 'Details']);
        expect(metadata.links).toEqual(['https://example.com']);
        expect(metadata.excerpt).toContain('This is a paragraph');
        expect(extractContentMetadata('# Heading only').excerpt).toBeUndefined();
    });

    it('loads collections and attaches content type metadata', async () => {
        await expect(getAllContent('articles')).resolves.toEqual(baseEntries.articles);
        await expect(getAllContent('cheatsheets')).resolves.toEqual([]);

        await expect(getAllContent()).resolves.toEqual([
            { ...baseEntries.articles[0], contentType: 'articles' },
            { ...baseEntries.articles[1], contentType: 'articles' },
            { ...baseEntries.showcase[0], contentType: 'showcase' },
            { ...baseEntries.documents[0], contentType: 'documents' },
        ]);
    });

    it('filters content by tags, category, flags, and search terms', () => {
        const filtered = filterContent(baseEntries.articles, {
            tags: ['type'],
            category: 'Guides',
            featured: true,
            draft: false,
            search: 'deep',
        });

        expect(filtered).toEqual([baseEntries.articles[0]]);
        expect(filterContent(baseEntries.articles, { search: 'second' })).toEqual([baseEntries.articles[1]]);
        expect(filterContent(baseEntries.articles, { tags: ['rust'] })).toEqual([]);
        expect(filterContent(baseEntries.articles, { category: 'Missing' })).toEqual([]);
        expect(filterContent(baseEntries.articles, { draft: false })).toEqual([baseEntries.articles[0]]);
    });

    it('sorts content across supported sort orders', () => {
        expect(sortContent(baseEntries.articles, 'date', 'desc').map((item) => item.id)).toEqual([
            'en/one',
            'en/two',
        ]);
        expect(sortContent(baseEntries.articles, 'title', 'asc').map((item) => item.id)).toEqual([
            'en/one',
            'en/two',
        ]);
        expect(sortContent(baseEntries.articles, 'readingTime', 'asc').map((item) => item.id)).toEqual([
            'en/two',
            'en/one',
        ]);
        expect(sortContent(baseEntries.articles, 'featured', 'desc').map((item) => item.id)).toEqual([
            'en/one',
            'en/two',
        ]);
        expect(sortContent(baseEntries.articles, 'unknown' as never, 'desc')).toEqual(baseEntries.articles);
        expect(
            sortContent(
                [
                    { id: 'a', data: { title: 'Same', readingTime: 1 } },
                    { id: 'b', data: { title: 'Same', readingTime: 1 } },
                ],
                'title',
                'asc'
            ).map((item) => item.id)
        ).toEqual(['a', 'b']);
    });

    it('builds content URLs with collection-specific behavior', () => {
        expect(getContentUrl(baseEntries.articles[0] as never, 'post')).toBe('/base/article-one');
        expect(getContentUrl(baseEntries.articles[0] as never, 'articles')).toBe('/base/article-one');
        expect(getContentUrl(baseEntries.documents[0] as never, 'documents')).toBe('/base/getting-started');
        expect(getContentUrl(baseEntries.showcase[0] as never, 'showcase')).toBe('/base/demo-project');
        expect(getContentUrl({ id: 'raw-id', data: {} } as never, 'other')).toBe('/raw-id');
    });

    it('returns related content ranked by shared tags and category', async () => {
        const related = await getRelatedContent(baseEntries.articles[0] as never, 'articles', 2);
        expect(related).toEqual([baseEntries.articles[1]]);
        await expect(
            getRelatedContent(
                { id: 'x', data: { slug: 'x', title: 'Solo', tags: ['none'], category: 'Other' } } as never,
                'articles'
            )
        ).resolves.toEqual([]);
    });

    it('extracts normalized tags and categories', () => {
        expect(extractTags(baseEntries.articles)).toEqual(['ai', 'typescript']);
        expect(extractCategories(baseEntries.articles)).toEqual(['guides']);
        expect(extractTags([{ data: { title: 'No tags' } }])).toEqual([]);
        expect(extractCategories([{ data: { title: 'No category' } }])).toEqual([]);
    });
});
