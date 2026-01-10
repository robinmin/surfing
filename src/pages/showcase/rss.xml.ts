import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { filterContent, getAllContent, sortContent } from '~/utils/content';

export async function GET(context: APIContext) {
    const showcases = await getAllContent('showcase');
    const publishedShowcases = filterContent(showcases, { draft: false });
    const sortedShowcases = sortContent(publishedShowcases, 'date', 'desc');

    // Extract domain from context.site for email addresses
    const siteDomain = context.site ? new URL(context.site).hostname : 'surfing.salty.vip';

    return rss({
        title: 'Surfing Showcase - Latest Projects & Creations',
        description:
            'Discover amazing projects, tools, and creations from our community of creators.',
        site: context.site?.toString() || '',
        items: sortedShowcases.map((showcase) => ({
            title: showcase.data.title,
            description: showcase.data.description,
            link: `/showcase/${showcase.data.slug || showcase.id}`,
            pubDate: showcase.data.publishDate || new Date(),
            categories: [
                'showcase',
                ...(showcase.data.category ? [showcase.data.category] : []),
                ...(showcase.data.tags || []),
                ...(showcase.data.technologies || []),
            ],
            author: showcase.data.author || 'Surfing Platform',
            customData: `
        <content:encoded><![CDATA[
          ${showcase.data.description}
          ${showcase.data.projectUrl ? `<p><strong>Live Demo:</strong> <a href="${showcase.data.projectUrl}">${showcase.data.projectUrl}</a></p>` : ''}
          ${showcase.data.githubUrl ? `<p><strong>Source Code:</strong> <a href="${showcase.data.githubUrl}">${showcase.data.githubUrl}</a></p>` : ''}
          ${showcase.data.technologies?.length ? `<p><strong>Technologies:</strong> ${showcase.data.technologies.join(', ')}</p>` : ''}
        ]]></content:encoded>
        <dc:creator>${showcase.data.author || 'Surfing Platform'}</dc:creator>
        ${showcase.data.projectUrl ? `<projectUrl>${showcase.data.projectUrl}</projectUrl>` : ''}
        ${showcase.data.githubUrl ? `<githubUrl>${showcase.data.githubUrl}</githubUrl>` : ''}
        ${showcase.data.featured ? '<featured>true</featured>' : ''}
      `,
        })),
        customData: `
      <language>en-us</language>
      <managingEditor>noreply@${siteDomain}</managingEditor>
      <webMaster>noreply@${siteDomain}</webMaster>
      <generator>Astro + Surfing Platform</generator>
      <category>Showcase</category>
    `,
        xmlns: {
            content: 'http://purl.org/rss/1.0/modules/content/',
            dc: 'http://purl.org/dc/elements/1.1/',
        },
    });
}
