import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { filterContent, getAllContent, sortContent } from '~/utils/content';

export async function GET(context: APIContext) {
    const cheatsheets = await getAllContent('cheatsheets');
    const publishedCheatsheets = filterContent(cheatsheets, { draft: false });
    const sortedCheatsheets = sortContent(publishedCheatsheets, 'date', 'desc');

    // Extract domain from context.site for email addresses
    const siteDomain = context.site ? new URL(context.site).hostname : 'surfing.salty.vip';

    return rss({
        title: 'Surfing Cheatsheets - AI-Generated Reference Materials',
        description:
            'Quick reference guides and comprehensive cheatsheets for developers, created by AI to boost productivity and accelerate learning.',
        site: context.site?.toString() || '',
        items: sortedCheatsheets.map((cheatsheet) => ({
            title: cheatsheet.data.title,
            description:
                cheatsheet.data.description ||
                `${cheatsheet.data.topic ? `${cheatsheet.data.topic} - ` : ''}AI-generated cheatsheet`,
            link: `/cheatsheets/${cheatsheet.data.slug || cheatsheet.id}`,
            pubDate: cheatsheet.data.publishDate || cheatsheet.data.updateDate || new Date(),
            categories: [
                ...(cheatsheet.data.topic ? [cheatsheet.data.topic] : []),
                ...(cheatsheet.data.category ? [cheatsheet.data.category] : []),
                ...(cheatsheet.data.tags || []),
                ...(cheatsheet.data.difficulty ? [cheatsheet.data.difficulty] : []),
            ],
            author: cheatsheet.data.author || cheatsheet.data.generatedBy || 'AI Assistant',
            customData: `
        <content:encoded><![CDATA[
          ${cheatsheet.data.description || `${cheatsheet.data.topic ? `${cheatsheet.data.topic} - ` : ''}AI-generated cheatsheet`}
        ]]></content:encoded>
        <dc:creator>${cheatsheet.data.author || cheatsheet.data.generatedBy || 'AI Assistant'}</dc:creator>
        ${cheatsheet.data.readingTime ? `<readingTime>${cheatsheet.data.readingTime} minutes</readingTime>` : ''}
        <wordCount>${cheatsheet.data.wordCount || 0}</wordCount>
        ${cheatsheet.data.topic ? `<topic>${cheatsheet.data.topic}</topic>` : ''}
        ${cheatsheet.data.difficulty ? `<difficulty>${cheatsheet.data.difficulty}</difficulty>` : ''}
        ${cheatsheet.data.format ? `<format>${cheatsheet.data.format}</format>` : ''}
        ${cheatsheet.data.generatedBy ? `<generatedBy>${cheatsheet.data.generatedBy}</generatedBy>` : ''}
        ${cheatsheet.data.version ? `<version>${cheatsheet.data.version}</version>` : ''}
        ${cheatsheet.data.pdfUrl ? `<pdfUrl>${cheatsheet.data.pdfUrl}</pdfUrl>` : ''}
      `,
        })),
        customData: `
      <language>en-us</language>
      <managingEditor>noreply@${siteDomain}</managingEditor>
      <webMaster>noreply@${siteDomain}</webMaster>
      <generator>Astro + Surfing Platform</generator>
      <category>Cheatsheets</category>
      <category>Reference Materials</category>
      <category>AI Generated</category>
    `,
        xmlns: {
            content: 'http://purl.org/rss/1.0/modules/content/',
            dc: 'http://purl.org/dc/elements/1.1/',
        },
    });
}
