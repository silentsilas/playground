export interface Metadata {
	title: string;
	date: string;
	content: string;
	categories?: string[];
	draft?: boolean;
}

export interface Section {
	poetry: 'poetry';
	thoughts: 'thoughts';
	projects: 'projects';
}

type SectionKey = keyof Section;

export interface Post {
	meta: Metadata;
	path: string;
}

interface Data {
	metadata: Metadata;
}

function isData(obj: unknown): obj is Data {
	if (typeof obj !== 'object' || obj === null) {
		return false;
	}

	const dataObj = obj as Data;

	return (
		'metadata' in dataObj &&
		typeof dataObj.metadata.title === 'string' &&
		typeof dataObj.metadata.date === 'string'
	);
}

export const fetchMarkdownPosts = async (
	section: SectionKey,
	limit: number,
	offset: number
): Promise<{ posts: Post[]; total: number }> => {
	let posts: Record<string, () => Promise<unknown>>;
	switch (section) {
		case 'poetry':
			posts = import.meta.glob('/src/posts/poetry/*.md');
			break;
		case 'projects':
			posts = import.meta.glob('/src/routes/(app)/projects/posts/*.md');
			break;
		case 'thoughts':
			posts = import.meta.glob('/src/posts/thoughts/*.md');
			console.log(posts);
			break;
		default:
			throw new Error('Could not find this section');
	}
	const iterablePostFiles = Object.entries(posts);

	const postsWithErrors: string[] = [];

	const allPosts = await Promise.all(
		iterablePostFiles.map(async ([path, resolver]) => {
			try {
				const data = await resolver();
				if (isData(data)) {
					if (data.metadata.draft) {
						return undefined;
					}
					const { metadata } = data;
					const postPath = path.slice(11, -3);
					return {
						meta: { ...metadata },
						path: postPath
					};
				} else {
					console.error('Could not properly parse this post');
					postsWithErrors.push(path);
				}
			} catch (error) {
				console.error(`Error parsing post at ${path}: ${error}`);
				postsWithErrors.push(path);
			}
		})
	);

	console.log('Files that could not be properly parsed:', postsWithErrors);

	const sortedPosts: Post[] = allPosts
		.filter((post): post is Post => post !== undefined)
		.sort(
			(b, a) => new Date(a?.meta.date || '').getTime() - new Date(b?.meta.date || '').getTime()
		);

	const paginatedPosts = sortedPosts.slice(offset, offset + limit);

	return { posts: paginatedPosts, total: allPosts.length };
};
