import { fetchMarkdownPosts } from '$lib/utils';
import { json } from '@sveltejs/kit';

export const GET = async ({ url }) => {
	const limit = Number(url.searchParams.get('limit')) || 6;
	const offset = Number(url.searchParams.get('offset')) || 0;
	const allPosts = await fetchMarkdownPosts('poetry', limit, offset);

	const sortedPosts = allPosts.sort((a, b) => {
		return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
	});

	return json(sortedPosts);
};
