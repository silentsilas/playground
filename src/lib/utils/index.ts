export interface Metadata {
	title: string;
	date: string;
	categories?: string[];
	draft?: boolean;
}

export interface Section {
	poetry: 'poetry';
	thoughts: 'thoughts';
	services: 'services';
	all: 'all';
}

type SectionKey = keyof Section;

export interface Post {
	meta: Metadata;
	content: string;
	section: string;
	filename: string;
	id: string;
}

interface Data {
	metadata: Metadata;
	default: {
		render: () => { html: string };
	};
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
	limit?: number,
	offset?: number
): Promise<{ posts: Post[]; total: number }> => {
	let posts: Record<string, () => Promise<unknown>>;
	switch (section) {
		case 'all':
			posts = import.meta.glob('/src/posts/**/*.md');
			break;
		case 'poetry':
			posts = import.meta.glob('/src/posts/poetry/*.md');
			break;
		case 'thoughts':
			posts = import.meta.glob('/src/posts/thoughts/*.md');
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
					const { html } = data.default.render();
					// remove html tags
					const content = html.replace(/<[^>]*>/g, '');
					const section = path.split('/')[3];
					const filename = path.split('/').pop()?.slice(0, -3);

					return {
						meta: { ...metadata },
						content,
						section,
						filename,
						id: data.metadata.title
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

	if (limit === undefined || offset === undefined) {
		return { posts: sortedPosts, total: allPosts.length };
	}

	const paginatedPosts = sortedPosts.slice(offset, offset + limit);

	return { posts: paginatedPosts, total: allPosts.length };
};
