import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE, METADATA } from 'astrowind:config';
import { getPermalink } from '~/utils/permalinks';

export async function GET(context) {
  const documents = await getCollection('documents', ({ data }) => !data.draft);
  
  return rss({
    title: `${SITE?.name} - Documents`,
    description: `HTML documents and rich-formatted content from ${SITE?.name}`,
    site: context.site ?? SITE?.site,
    items: documents.map((document) => ({
      title: document.data.title,
      description: document.data.description || '',
      pubDate: document.data.publishDate || document.data.updateDate,
      link: getPermalink(document.slug, 'document'),
      categories: document.data.tags || [],
      author: document.data.author,
      customData: `
        <contentType>${document.data.contentType}</contentType>
        ${document.data.source ? `<source>${document.data.source}</source>` : ''}
        ${document.data.readingTime ? `<readingTime>${document.data.readingTime}</readingTime>` : ''}
      `,
    })),
    customData: `<language>en-us</language>`,
  });
}
