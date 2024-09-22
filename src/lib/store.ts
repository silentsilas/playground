import { writable } from 'svelte/store';
import type { SearchResult } from './utils/search';
import type { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';

const initArray: SearchResult[] = [];
export const searchResults = writable(initArray);

export type ChatHistory = (HumanMessage | AIMessage | SystemMessage)[];

const chatHistories: Record<string, ChatHistory> = {};

export const chatStore = writable(chatHistories);

export function getChatHistory(sessionId: string): ChatHistory {
	return chatHistories[sessionId] || [];
}

export function setChatHistory(sessionId: string, history: ChatHistory): void {
	chatHistories[sessionId] = history;
	chatStore.set(chatHistories);
}

export function clearChatHistory(sessionId: string): void {
	chatHistories[sessionId] = [];
	chatStore.set(chatHistories);
}
