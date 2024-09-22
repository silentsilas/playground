<script lang="ts">
	import '../../app.css';
	import type { SearchResult } from '$lib/utils/search';
	import { searchResults, type ChatHistory } from '$lib/store';
	import { onMount } from 'svelte';
	import { marked } from 'marked';
	import { HumanMessage, AIMessage } from '@langchain/core/messages';
	import { PUBLIC_LOAD_DUMMY_HISTORY } from '$env/static/public';

	let searchResultsValue: SearchResult[] = [];
	let query = '';
	let loading = false;
	function generateDummyHistory() {
		return [
			JSON.parse(JSON.stringify(new HumanMessage({ content: 'Hello, AI!' }))),
			JSON.parse(JSON.stringify(new AIMessage({ content: 'Hello! How can I assist you today?' }))),
			JSON.parse(JSON.stringify(new HumanMessage({ content: "What's the weather like?" }))),
			JSON.parse(
				JSON.stringify(
					new AIMessage({
						content:
							"I'm sorry, but I don't have access to real-time weather information. You might want to check a weather app or website for the most up-to-date forecast."
					})
				)
			)
		];
	}

	let chatHistory: ChatHistory = [];

	onMount(async () => {
		try {
			if (PUBLIC_LOAD_DUMMY_HISTORY === 'true') {
				chatHistory = generateDummyHistory();
				return;
			}
			const response = await fetch('/api/ai');
			const data = await response.json();
			chatHistory = data.chatHistory || [];
		} catch (error) {
			console.error('Error fetching chat history:', error);
		}
	});

	searchResults.subscribe((value: SearchResult[]) => {
		searchResultsValue = value ? value : [];
	});

	function getRoleAndContent(message: any): { role: string; content: string } {
		if (message.type === 'constructor') {
			const messageType = message.id[2];
			return {
				role: messageType.replace('Message', '').toLowerCase(),
				content: message.kwargs.content
			};
		}
		return {
			role: 'unknown',
			content: JSON.stringify(message)
		};
	}

	// safely render markdown
	function renderMarkdown(content: string) {
		return marked(content);
	}

	async function handleSubmit() {
		loading = true;
		try {
			const response = await fetch('/api/ai', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ query })
			});
			const data = await response.json();
			chatHistory = data.chatHistory || [];

			query = '';
		} catch (error) {
			console.error('Error fetching AI response:', error);
		} finally {
			loading = false;
		}
	}

	async function handleNewSession() {
		try {
			const response = await fetch('/api/ai/new-session', { method: 'POST' });
			if (response.ok) {
				const historyResponse = await fetch('/api/ai');
				const data = await historyResponse.json();
				chatHistory = data.chatHistory || [];
				query = '';
			} else {
				console.error('Failed to start new session');
			}
		} catch (error) {
			console.error('Error starting new session:', error);
		}
	}
</script>

<svelte:head>
	<title>silentsilas - AI</title>
</svelte:head>

{#if searchResultsValue.length === 0}
	<div class="flex-grow flex-col overflow-auto p-4 my-2 bg-base-200">
		<div class="flex flex-col items-center gap-4">
			<div class="avatar">
				<div class="ring-primary ring-offset-base-100 w-64 rounded-full ring ring-offset-2">
					<img src="/imgs/ai/profile.jpg" alt="Portrait of an orange tabby cat reading a book" />
				</div>
			</div>
			<span>
				This lil guy just finished reading <a
					class="link link-primary"
					href="https://bookshop.org/p/books/a-history-of-tea-the-life-and-times-of-the-world-s-favorite-beverage-laura-c-martin/11044690"
					target="_blank"
				>
					A History of Tea
				</a>, so ask 'em anything about the book.
			</span>
		</div>
		<div class="space-y-4">
			{#each chatHistory as message}
				{@const { role, content } = getRoleAndContent(message)}
				{#if role === 'human'}
					<div class="chat chat-end">
						<div class="chat-bubble chat-bubble-primary prose">
							{@html renderMarkdown(content)}
						</div>
					</div>
				{:else}
					<div class="p-4 rounded-lg bg-base-300 prose md:container">
						{@html renderMarkdown(content)}
					</div>
				{/if}
			{/each}
		</div>

		{#if loading}
			<div class="mt-4 flex flex-col items-center justify-center">
				<span class="loading loading-dots loading-lg"></span>
				<span>This may take a minute; streaming is still a work in progress.</span>
			</div>
		{/if}
		<form on:submit|preventDefault={handleSubmit} class="mt-4 flex-col">
			<label class="form-control">
				<textarea
					bind:value={query}
					class="textarea textarea-bordered h-24"
					placeholder="Type your message here..."
				></textarea>
			</label>
			<button type="submit" class="btn btn-block btn-primary mt-4" disabled={loading}>
				Send
			</button>
			<button
				type="button"
				class="btn btn-block btn-error btn-outline mt-2"
				on:click={handleNewSession}
			>
				New Session
			</button>
		</form>
	</div>
{/if}
