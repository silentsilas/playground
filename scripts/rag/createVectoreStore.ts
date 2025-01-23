import 'cheerio';
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { OpenAIEmbeddings } from '@langchain/openai';
import * as path from 'path';

const VECTOR_STORE_PATH = 'hex_docs_vector_store';
const DOCS_DIR = path.join(process.env.HOME || '~', '.hex/docs/hexpm');

async function generateEmbeddings() {
	const loader = new CheerioWebBaseLoader('https://lilianweng.github.io/posts/2023-06-23-agent/');
	const docs = await loader.load();

	const textSplitter = new RecursiveCharacterTextSplitter({
		chunkSize: 1000,
		chunkOverlap: 200
	});
	const splits = await textSplitter.splitDocuments(docs);

	const embeddings = new OpenAIEmbeddings();
	const vectorStore = await HNSWLib.fromDocuments(splits, embeddings);
	await vectorStore.save(VECTOR_STORE_PATH);

	console.log('Embeddings generated and saved successfully.');
}

generateEmbeddings().catch(console.error);
