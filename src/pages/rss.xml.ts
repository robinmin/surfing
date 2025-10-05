import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getAllContent, filterContent, sortContent } from '~/utils/content';

export async function GET(context: APIContext) {
  const allContent = await getAllContent();
  const publishedContent = filterContent(allContent, { draft: false });
  const sortedContent = sortContent(publishedContent, 'date', 'desc');

  // Extract domain from context.site for email addresses
  const siteDomain = context.site ? new URL(context.site).hostname : 'surfing.salty.vip';

  return rss({
    title: 'Surfing - AI-Powered Content Platform for Creators',
    description: 'Discover AI insights, technical articles, project showcases, and creative content.',
    site: context.site!,
    items: sortedContent.map((entry) => {
      const contentType = entry.data.contentType || entry.collection;
      const slug = entry.data.slug || entry.id;
      const url =
        contentType === 'articles'
          ? `/articles/${slug}`
          : contentType === 'showcase'
            ? `/showcase/${slug}`
            : contentType === 'documents'
              ? `/documents/${slug}`
              : contentType === 'cheatsheets'
                ? `/cheatsheets/${slug}`
                : `/articles/${slug}`;

      return {
        title: entry.data.title,
        description: entry.data.description || entry.data.excerpt || '',
        link: url,
        pubDate: entry.data.publishDate || entry.data.updateDate || new Date(),
        categories: [...(entry.data.category ? [entry.data.category] : []), ...(entry.data.tags || [])],
        author: entry.data.author || 'Surfing Platform',
        customData: `
          <content:encoded><![CDATA[
            ${entry.data.description || entry.data.excerpt || ''}
          ]]></content:encoded>
          <dc:creator>${entry.data.author || 'Surfing Platform'}</dc:creator>
          ${entry.data.readingTime ? `<readingTime>${entry.data.readingTime} minutes</readingTime>` : ''}
          <contentType>${contentType}</contentType>
        `,
      };
    }),
    customData: `
      <language>en-us</language>
      <managingEditor>noreply@${siteDomain}</managingEditor>
      <webMaster>noreply@${siteDomain}</webMaster>
      <docs>https://www.rssboard.org/rss-specification</docs>
      <generator>Astro + Surfing Platform</generator>
    `,
    xmlns: {
      content: 'http://purl.org/rss/1.0/modules/content/',
      dc: 'http://purl.org/dc/elements/1.1/',
    },
  });
}
