import { fetchMarkdownPosts, type Post } from '$lib/utils';

const siteURL = 'https://silentsilas.com';
const siteTitle = 'silentsilas - Thoughts &#38; Poems';
const siteDescription = 'Read some bad takes and poetry.';

export const prerender = true;

export const GET = async () => {
	const { posts } = await fetchMarkdownPosts('all');

	const body = render(posts);
	const options = {
		headers: {
			'Cache-Control': 'max-age=0, s-maxage=604800',
			'Content-Type': 'application/atom+xml'
		}
	};

	return new Response(body, options);
};

const render = (posts: Post[]) => `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${siteTitle}</title>
<description>${siteDescription}</description>
<link>${siteURL}</link>
<atom:link href="${siteURL}/rss" rel="self" type="application/rss+xml"/>
${posts
	.map(
		(post) => `<item>
<guid isPermaLink="true">${siteURL}/${post.section}/${post.filename}</guid>
<title>${post.meta.title}</title>
<link>${siteURL}/${post.section}/${post.filename}</link>
<description>${post.meta.title}</description>
<pubDate>${new Date(post.meta.date).toUTCString()}</pubDate>
</item>`
	)
	.join('')}
</channel>
</rss>
`;
