import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../lib/config';

export async function GET(context: any) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `/blog/${post.slug}/`,
        content: post.body,
      })),
    customData: `<language>en-us</language>`,
    stylesheet: '/rss/styles.xsl',
  });
}