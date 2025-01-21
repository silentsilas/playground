import { fetchMarkdownPosts } from '$lib/utils';
import { json } from '@sveltejs/kit';

export const GET = async ({ url }) => {
	const page = Number(url.searchParams.get('page')) || 1;
	const limit = Number(url.searchParams.get('limit')) || 8;
	const offset = (page - 1) * limit;
	const { posts: allPosts, total: total } = await fetchMarkdownPosts('poetry', limit, offset);

	const sortedPosts = allPosts.sort((a, b) => {
		return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
	});

	return json({ posts: sortedPosts, total: total, page: page });
};
