// src/lib/initModel.ts
import use, { UniversalSentenceEncoder } from '@tensorflow-models/universal-sentence-encoder';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as tf from '@tensorflow/tfjs-node';

export type Embedding = {
	id: string;
	vector: number[];
};

export type SearchResult = {
	poem: Embedding;
	similarity: number;
};

let model: UniversalSentenceEncoder | null = null;

export async function getModel(): Promise<UniversalSentenceEncoder> {
	if (!model) {
		model = await use.load();
		console.log('Model loaded successfully!');
	}
	return model;
}