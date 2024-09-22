import { json } from '@sveltejs/kit';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { OpenAIEmbeddings } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { join } from 'path';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import type { RequestEvent } from '@sveltejs/kit';

const chatHistories: Record<string, ChatHistory> = {};

type VectorDocument = {
	pageContent: string;
};

const formatDocumentsAsString = (documents: VectorDocument[]) => {
	return documents.map((doc) => doc.pageContent).join('\n\n');
};

export type ChatHistory = HumanMessage[] | AIMessage[] | SystemMessage[];

export async function POST({ request, locals }: RequestEvent): Promise<Response> {
	const { query } = await request.json();
	const sessionId = locals.sessionId;

	if (!chatHistories[sessionId]) {
		chatHistories[sessionId] = [];
	}
	const chatHistory = chatHistories[sessionId];

	const directory = join(process.cwd(), 'vectorstore');
	const embeddings = new OpenAIEmbeddings();
	const vectorStore = await FaissStore.load(directory, embeddings);
	const vectorStoreRetriever = vectorStore.asRetriever();

	const model = new ChatAnthropic({
		modelName: 'claude-3-5-sonnet-20240620',
		anthropicApiKey: process.env.ANTHROPIC_API_KEY
	});

	const SYSTEM_TEMPLATE = `Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say that you don't know, don't try to make up an answer.

----------------

Context:
{context}

Question:
{question}`;

	const prompt = ChatPromptTemplate.fromMessages([
		['system', SYSTEM_TEMPLATE],
		...chatHistory,
		['user', '{question}']
	]);

	const chain = RunnableSequence.from([
		{
			context: vectorStoreRetriever.pipe(formatDocumentsAsString),
			question: new RunnablePassthrough(),
		},
		prompt,
		model,
		new StringOutputParser()
	]);

	const answer = await chain.invoke(query);

	chatHistory.push(new HumanMessage({ content: query }));
	chatHistory.push(new AIMessage({ content: answer }));

	return json({ response: answer, chatHistory });
}

export async function GET({ locals }): Promise<Response> {
	const sessionId = locals.sessionId;
	const chatHistory = chatHistories[sessionId] || [];
	return json({ chatHistory });
}
