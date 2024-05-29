export const load = async ({ fetch, url }) => {
	const limit = 8;

	const page = Number(url.searchParams.get('page')) || 1;

	const response = await fetch(`/api/poetry?limit=${limit}&page=${page}`);
	const { posts, total } = await response.json();

	return {
			posts,
			total,
			page,
			limit
	};
};
