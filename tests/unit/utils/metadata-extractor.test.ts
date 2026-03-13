import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
    extractHtmlMetadata,
    extractMarkdownMetadata,
    generateMetadataSummary,
    processContentDirectory,
} from '~/utils/metadata-extractor';

const tempDirs: string[] = [];

async function createTempDir(): Promise<string> {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'surfing-tests-'));
    tempDirs.push(dir);
    return dir;
}

describe('metadata extractor', () => {
    afterEach(async () => {
        await Promise.all(tempDirs.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })));
    });

    it('extracts markdown metadata from file content and frontmatter', async () => {
        const dir = await createTempDir();
        const filePath = path.join(dir, 'sample.md');
        await fs.writeFile(
            filePath,
            `---
title: "Markdown Title"
description: "Short description"
---
# Heading

This is the body with ![image](img.png) and \`code\`.

## Subheading

[External](https://example.com)`
        );

        const metadata = await extractMarkdownMetadata(filePath);

        expect(metadata.title).toBe('Markdown Title');
        expect(metadata.description).toBe('Short description');
        expect(metadata.headings).toEqual(['Heading', 'Subheading']);
        expect(metadata.linkCount).toBe(2);
        expect(metadata.hasImages).toBe(true);
        expect(metadata.hasCodeBlocks).toBe(true);
        expect(metadata.headingStructure).toEqual([
            { level: 1, text: 'Heading' },
            { level: 2, text: 'Subheading' },
        ]);
    });

    it('falls back to heading and paragraph-derived markdown titles across language heuristics', async () => {
        const dir = await createTempDir();
        const h2File = path.join(dir, 'spanish.md');
        const frenchFile = path.join(dir, 'french.md');
        const paragraphFile = path.join(dir, 'plain.md');
        const emptyFile = path.join(dir, 'empty.md');

        await fs.writeFile(
            h2File,
            `## Hola Mundo

el la de que y es en un se no`
        );
        await fs.writeFile(
            frenchFile,
            `## Bonjour

le de et à un il être en avoir`
        );
        await fs.writeFile(
            paragraphFile,
            'This paragraph becomes the fallback title because no headings exist anywhere.'
        );
        await fs.writeFile(emptyFile, '');

        const h2Meta = await extractMarkdownMetadata(h2File);
        const frenchMeta = await extractMarkdownMetadata(frenchFile);
        const paragraphMeta = await extractMarkdownMetadata(paragraphFile);
        const emptyMeta = await extractMarkdownMetadata(emptyFile);

        expect(h2Meta.title).toBe('Hola Mundo');
        expect(h2Meta.language).toBe('es');
        expect(frenchMeta.language).toBe('fr');
        expect(paragraphMeta.title).toBe(
            'This paragraph becomes the fallback title because no...'
        );
        expect(emptyMeta.title).toBeUndefined();
        expect(emptyMeta.language).toBe('en');
    });

    it('extracts html metadata and strips unwanted markup from text analysis', async () => {
        const dir = await createTempDir();
        const filePath = path.join(dir, 'sample.html');
        await fs.writeFile(
            filePath,
            `<html lang="ja"><head><title>HTML Title</title><meta name="description" content="Meta description"></head>
            <body><h1>Heading</h1><p>Paragraph with <a href="https://example.com">link</a>.</p><img src="x.png"><pre>code</pre></body></html>`
        );

        const metadata = await extractHtmlMetadata(filePath);

        expect(metadata.title).toBe('HTML Title');
        expect(metadata.description).toBe('Meta description');
        expect(metadata.language).toBe('ja');
        expect(metadata.headings).toEqual(['Heading']);
        expect(metadata.links).toEqual(['https://example.com']);
        expect(metadata.hasImages).toBe(true);
        expect(metadata.hasCodeBlocks).toBe(true);
    });

    it('handles alternate html metadata fallbacks and filtered links', async () => {
        const dir = await createTempDir();
        const h1File = path.join(dir, 'fallback.html');
        const ogFile = path.join(dir, 'og.html');
        const plainFile = path.join(dir, 'plain.html');

        await fs.writeFile(
            h1File,
            '<html xml:lang="fr"><head></head><body><h1>Fallback Heading</h1><a href="#x">Skip</a><a href="javascript:void(0)">Skip</a><a href="/docs">Docs</a><a href="/docs">Docs</a></body></html>'
        );
        await fs.writeFile(
            ogFile,
            '<html><head><meta property="og:description" content="OG description"></head><body><p>le de et à un il être en avoir</p></body></html>'
        );
        await fs.writeFile(plainFile, '<html><body><p>No title or description</p></body></html>');

        const h1Meta = await extractHtmlMetadata(h1File);
        const ogMeta = await extractHtmlMetadata(ogFile);
        const plainMeta = await extractHtmlMetadata(plainFile);

        expect(h1Meta.title).toBe('Fallback Heading');
        expect(h1Meta.language).toBe('fr');
        expect(h1Meta.links).toEqual(['/docs']);
        expect(ogMeta.description).toBe('OG description');
        expect(plainMeta.title).toBeUndefined();
        expect(plainMeta.description).toBeUndefined();
        expect(plainMeta.language).toBe('en');
    });

    it('processes mixed content directories and summarizes extracted metadata', async () => {
        const dir = await createTempDir();
        await fs.writeFile(path.join(dir, 'a.md'), '# Hello\n\nThe and is in to of a that it with');
        await fs.writeFile(
            path.join(dir, 'b.html'),
            '<html xml:lang="fr"><head><meta property="og:description" content="OG desc"></head><body><h2>Bonjour</h2><a href="/docs">Docs</a></body></html>'
        );
        await fs.writeFile(path.join(dir, 'ignore.txt'), 'skip');

        const metadata = await processContentDirectory(dir);
        const summary = generateMetadataSummary(metadata);

        expect([...metadata.keys()].sort()).toEqual(['a.md', 'b.html']);
        expect(summary.totalFiles).toBe(2);
        expect(summary.totalWords).toBeGreaterThan(0);
        expect(summary.totalLinks).toBe(1);
        expect(summary.languageDistribution.get('en')).toBeGreaterThan(0);
        expect(summary.languageDistribution.get('fr')).toBeGreaterThan(0);
    });

    it('continues processing when one file extraction fails', async () => {
        const dir = await createTempDir();
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const readFileSpy = vi.spyOn(fs, 'readFile');
        const realFs = await vi.importActual<typeof import('node:fs/promises')>('node:fs/promises');

        await fs.writeFile(path.join(dir, 'good.md'), '# Good\n\nThe and is in to of a that it with');
        await fs.writeFile(path.join(dir, 'broken.md'), '# Broken');
        readFileSpy.mockImplementation(async (filePath, ...args) => {
            if (String(filePath).endsWith('broken.md')) {
                throw new Error('read failed');
            }
            return realFs.readFile(
                filePath as Parameters<typeof fs.readFile>[0],
                ...(args as [Parameters<typeof fs.readFile>[1]?])
            );
        });

        const metadata = await processContentDirectory(dir);

        expect(metadata.size).toBe(1);
        expect(metadata.has('good.md')).toBe(true);
        expect(warnSpy).toHaveBeenCalled();
    });

    it('returns an empty map for missing directories', async () => {
        const metadata = await processContentDirectory(path.join(os.tmpdir(), 'missing-surfing-dir'));
        expect(metadata.size).toBe(0);
    });
});
