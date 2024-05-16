export interface Metadata {
	title: string;
	date: string;
	content: string;
	categories?: string[];
	section?: SectionKey;
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
): Promise<Post[]> => {
	let posts: Record<string, () => Promise<unknown>>;
	switch (section) {
		case 'poetry':
			posts = import.meta.glob('/src/posts/poetry/*.md');
			break;
		case 'projects':
			posts = import.meta.glob('/src/routes/(app)/projects/posts/*.md');
			break;
			case 'thoughts':
				posts = import.meta.glob('/src/routes/(app)/thoughts/posts/*.md');
			break;
		default:
			throw new Error('Could not find this section');
	}
	const iterablePostFiles = Object.entries(posts);

	const allPosts = await Promise.all(
		iterablePostFiles.map(async ([path, resolver]) => {
			const data = await resolver();
			if (isData(data)) {
				const { metadata } = data;
				const postPath = path.slice(11, -3);
				return {
					meta: { ...metadata, section: section },
					path: postPath
				};
			} else {
				throw new Error('Could not properly parse this post');
			}
		})
	);

	const paginatedPosts = allPosts.slice(offset, offset + limit);

	return paginatedPosts;
};
