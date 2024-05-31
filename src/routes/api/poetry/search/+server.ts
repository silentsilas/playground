// eslint-disable-next-line
import * as tf from '@tensorflow/tfjs-node';
import poemEmbeddings from '$lib/utils/poetry/embeddings.json';
import { json } from '@sveltejs/kit';
import { getModel, type Embedding, type SearchResult } from '$lib/utils/search';

// Search handler
export const GET = async ({ url }: { url: URL }) => {
	const model = await getModel();
	const searchQuery = url.searchParams.get('q');
	if (!searchQuery) {
		return { status: 400, body: { error: 'Query parameter "q" is required' } };
	}

	try {
		// Generate embedding for the query
		const queryEmbedding = await model.embed([searchQuery]);
		const queryVec = queryEmbedding.arraySync()[0];

		// Calculate similarities
		const results = poemEmbeddings
			.map((poem: Embedding) => ({
				poem,
				similarity: cosineSimilarity(queryVec, poem.vector)
			}))
			.sort((a: SearchResult, b: SearchResult) => b.similarity - a.similarity)
			.slice(0, 10); // Top 10 results

		return json(results);
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
