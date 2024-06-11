// src/lib/initModel.ts
// import('@tensorflow/tfjs-node');
import type { UniversalSentenceEncoder } from '@tensorflow-models/universal-sentence-encoder';
import * as use from '@tensorflow-models/universal-sentence-encoder';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as tf from '@tensorflow/tfjs-node';

export type Embedding = {
	id: string;
	vector: number[];
	section: string;
	filename: string;
};

export type SearchResult = {
	post: Embedding;
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
