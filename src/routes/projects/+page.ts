export const load = async ({ fetch }) => {
	const response = await fetch(`/api/poetry?limit=5&offset=0`);
	const posts = await response.json();

	return {
		posts
	};
};
