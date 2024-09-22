// scripts/finetune.js
import { GithubRepoLoader } from '@langchain/community/document_loaders/web/github';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { OpenAIEmbeddings } from '@langchain/openai';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function finetune() {
	console.log('Fine-tuning model...');

	const loader = new GithubRepoLoader('https://github.com/silentsilas/Authenticator', {
		branch: 'develop',
		recursive: true,
		unknown: 'warn',
		maxConcurrency: 5
	});
	const docs = await loader.load();

	const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
	const splitDocs = await textSplitter.splitDocuments(docs);

	const embeddings = new OpenAIEmbeddings();
	const vectorStore = await FaissStore.fromDocuments(splitDocs, embeddings);

	const directory = join(__dirname, '..', 'vectorstore');
	await vectorStore.save(directory);

	console.log('Fine-tuning complete. Vector store saved.');
}

finetune();
