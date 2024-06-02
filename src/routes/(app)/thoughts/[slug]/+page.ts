import type { Metadata } from '$lib/utils/index.js';

export async function load({ params }) {
	const post = await import(`../../../../posts/thoughts/${params.slug}.md`);
	const { title, date, categories, draft } = post.metadata as Metadata;
	const Content = post.default;
	const parsedDate = new Date(date.slice(0, date.length - 6));
	const validDate = `${
		parsedDate.getMonth() + 1
	}/${parsedDate.getDate()}/${parsedDate.getFullYear()}`;

	return {
		Content,
		title,
		date: validDate,
		categories,
		post,
		draft
	};
}
