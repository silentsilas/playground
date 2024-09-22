<script lang="ts">
	import '../../app.css';
	import type { SearchResult } from '$lib/utils/search';
	import { searchResults } from '$lib/store';
	import { onMount } from 'svelte';
	import { marked } from 'marked';
	import { HumanMessage, AIMessage } from '@langchain/core/messages';
	import type { ChatHistory } from '../api/ai/+server';
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
</script>

<svelte:head>
	<title>silentsilas - AI</title>
</svelte:head>

{#if searchResultsValue.length === 0}
	<div class="flex-grow flex-col overflow-auto p-4">
		<div class="space-y-4">
			{#each chatHistory as message}
				{@const { role, content } = getRoleAndContent(message)}
				{#if role === 'human'}
					<div class="chat chat-end">
						<div class="chat-bubble chat-bubble-primary">
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
			<div class="mt-4">
				<span class="loading loading-dots loading-lg"></span>
			</div>
		{/if}
		<form on:submit|preventDefault={handleSubmit} class="mt-4 flex-col">
			<label class="form-control">
				<div class="label">
					<span class="label-text">
						Querying the Authenticator <a
							href="https://git.silentsilas.com/silentsilas/Authenticator"
							target="_blank"
							class="link-primary">repository</a
						>
					</span>
				</div>
				<textarea
					bind:value={query}
					class="textarea textarea-bordered h-24"
					placeholder="Type your message here..."
				></textarea>
			</label>
			<button type="submit" class="btn btn-block btn-primary mt-2" disabled={loading}>
				Send
			</button>
		</form>
	</div>
{/if}
