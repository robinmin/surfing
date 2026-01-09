import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { filterContent, getAllContent, sortContent } from '~/utils/content'

export async function GET(context: APIContext) {
  const articles = await getAllContent('articles')
  const publishedArticles = filterContent(articles, { draft: false })
  const sortedArticles = sortContent(publishedArticles, 'date', 'desc')

  // Extract domain from context.site for email addresses
  const siteDomain = context.site ? new URL(context.site).hostname : 'surfing.salty.vip'

  return rss({
    title: 'Surfing Articles - AI Insights & Technical Content',
    description: 'Latest articles on AI, technology, and innovation from the Surfing platform.',
    site: context.site!,
    items: sortedArticles.map((article) => ({
      title: article.data.title,
      description: article.data.description || article.data.excerpt || '',
      link: `/articles/${article.data.slug || article.id}`,
      pubDate: article.data.publishDate || article.data.updateDate || new Date(),
      categories: [
        ...(article.data.category ? [article.data.category] : []),
        ...(article.data.tags || []),
      ],
      author: article.data.author || 'Surfing Platform',
      customData: `
        <content:encoded><![CDATA[
          ${article.data.description || article.data.excerpt || ''}
        ]]></content:encoded>
        <dc:creator>${article.data.author || 'Surfing Platform'}</dc:creator>
        ${article.data.readingTime ? `<readingTime>${article.data.readingTime} minutes</readingTime>` : ''}
        <wordCount>${article.data.wordCount || 0}</wordCount>
      `,
    })),
    customData: `
      <language>en-us</language>
      <managingEditor>noreply@${siteDomain}</managingEditor>
      <webMaster>noreply@${siteDomain}</webMaster>
      <generator>Astro + Surfing Platform</generator>
      <category>Articles</category>
    `,
    xmlns: {
      content: 'http://purl.org/rss/1.0/modules/content/',
      dc: 'http://purl.org/dc/elements/1.1/',
    },
  })
}
