// eslint-disable-next-line
import * as tf from '@tensorflow/tfjs-node';
import postEmbeddings from '$lib/utils/poetry/embeddings.json';
import { json } from '@sveltejs/kit';
import { getModel, type Embedding, type SearchResult } from '$lib/utils/search';
import { fetchMarkdownPosts } from '$lib/utils';
import Fuse from 'fuse.js';

// Search handler
export const GET = async ({ url }: { url: URL }) => {
	const searchQuery = url.searchParams.get('q');
	if (!searchQuery) {
		return { status: 400, body: { error: 'Query parameter "q" is required' } };
	}

	try {
		const model = await getModel();
		const { posts } = await fetchMarkdownPosts('all');
		const fuse = new Fuse(posts, {
			keys: ['content', 'meta.title', 'meta.tags'],
			includeScore: true
		});

		// Fuzzy search
		const fuzzyResults = fuse.search(searchQuery, { limit: 10 });

		// Generate embedding for the query
		const queryEmbedding = await model.embed([searchQuery]);
		const queryVec = queryEmbedding.arraySync()[0];

		// Calculate similarities
		let semanticResults = postEmbeddings.map((post: Embedding) => ({
			post,
			similarity: cosineSimilarity(queryVec, post.vector)
		}));

		// add fuzzy results to semantic results
		semanticResults = semanticResults.map((semanticResult) => {
			const fuzzyResultIndex = fuzzyResults.findIndex(
				(fuzzyResult) =>
					fuzzyResult.item.section === semanticResult.post.section &&
					fuzzyResult.item.filename === semanticResult.post.filename
			);

			if (fuzzyResultIndex > -1) {
				const fuzzyResult = fuzzyResults.splice(fuzzyResultIndex, 1)[0];

				if (fuzzyResult.score && 1 - fuzzyResult.score > 0.8) {
					semanticResult.similarity = 1 - fuzzyResult.score / 2 + semanticResult.similarity;
				}
			}
			return semanticResult;
		});

		// add rest of fuzzy results
		semanticResults.push(
			...fuzzyResults.map((fuzzyResult) => {
				let similarity = 0;
				if (fuzzyResult.score && 1 - fuzzyResult.score > 0.9) {
					similarity = 1 - fuzzyResult.score / 2;
				}
				return {
					post: {
						id: fuzzyResult.item.id,
						section: fuzzyResult.item.section,
						filename: fuzzyResult.item.filename,
						vector: [0, 0, 0]
					},
					similarity: similarity
				};
			})
		);
		semanticResults = semanticResults
			.sort((a: SearchResult, b: SearchResult) => b.similarity - a.similarity)
			.slice(0, 10);

		return json(semanticResults);
	} catch (error) {
		return { status: 500, body: { error: (error as Error).message } };
	}
};

function cosineSimilarity(vecA: number[], vecB: number[]) {
	const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
	const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
	const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
	return dotProduct / (magnitudeA * magnitudeB);
}
