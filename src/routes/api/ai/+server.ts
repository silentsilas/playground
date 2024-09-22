import { json } from '@sveltejs/kit';
import { ChatAnthropic } from '@langchain/anthropic';
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import type { RequestEvent } from '@sveltejs/kit';
import { EPubLoader } from "@langchain/community/document_loaders/fs/epub";
import { join } from 'path';
import { getChatHistory, setChatHistory } from '$lib/store';
import { dev } from '$app/environment';

export async function POST({ request, locals }: RequestEvent): Promise<Response> {
	const { query } = await request.json();
	const sessionId = locals.sessionId;

	const chatHistory = getChatHistory(sessionId);

	let ebookPath;
	if (dev) {
		ebookPath = join(process.cwd(), 'static', 'book.epub');
	} else {
		ebookPath = join(process.cwd(), 'client', 'book.epub');
	}

	const loader = new EPubLoader(ebookPath);
	const docs = await loader.load();

	const context = docs.map(doc => doc.pageContent).join('\n\n');

	const model = new ChatAnthropic({
		modelName: 'claude-3-5-sonnet-20240620',
		anthropicApiKey: process.env.ANTHROPIC_API_KEY,
	});

	const SYSTEM_TEMPLATE = `The following pieces of context are the book you've just read.
You are a tea guru, and the book was "A History of Tea: The Life and Times of the World's Favorite Beverage" by Laura C. Martin.
You might be asked questions about the book, or about tea in general. Try to augment your answer with relevant information from the book.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
Always format your response in markdown.

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
			context: () => context,
			question: new RunnablePassthrough(),
		},
		prompt,
		model,
		new StringOutputParser()
	]);

	const answer = await chain.invoke(query);

	chatHistory.push(new HumanMessage({ content: query }));
	chatHistory.push(new AIMessage({ content: answer }));

	setChatHistory(sessionId, chatHistory);

	return json({ response: answer, chatHistory });
}

export async function GET({ locals }): Promise<Response> {
	const sessionId = locals.sessionId;
	const chatHistory = getChatHistory(sessionId);
	return json({ chatHistory });
}
