<script lang="ts">
	import '../../app.css';
	import type { SearchResult } from '$lib/utils/search';
	import { searchResults, type ChatHistory } from '$lib/store';
	import { onMount } from 'svelte';
	import { marked } from 'marked';
	import { HumanMessage, AIMessage } from '@langchain/core/messages';
	import { PUBLIC_LOAD_DUMMY_HISTORY } from '$env/static/public';
	import Toast from '$lib/components/Toast.svelte';

	let searchResultsValue: SearchResult[] = [];
	let query = '';
	let loading = false;
	let showToast = false;
	let toastMessage = '';

	type Questions = {
		[key: string]: string[];
	};

	const QUESTIONS: Questions = {
		brewing: [
			'What is the difference between Western and Eastern styles of tea brewing?',
			'How does water temperature and steeping time affect the flavor of different types of tea?',
			'What are some traditional tea brewing methods from around the world?',
			'What is gongfu cha (功夫茶), and how does it differ from other tea preparation methods?'
		],
		varieties: [
			'What is the difference between raw and ripe pu-erh tea, and how does aging affect their taste and value?',
			'Can you explain the grading system for teas, particularly for varieties like Darjeeling and Assam?',
			'What are some rare or unusual tea varieties and what makes them unique?',
			'How do flavored teas (like Earl Grey or Jasmine) differ in production and taste from pure teas?'
		],
		history: [
			'How did tea influence global trade routes and international relations, particularly between China, Britain, and India?',
			'What role did Buddhism play in the spread of tea culture throughout Asia?',
			"How did the British East India Company's involvement in the tea trade impact both India and China?",
			'How did the Opium Wars, which were closely tied to the tea trade, alter the course of Chinese history?',
			'What role did tea play in the American Revolution, and how did this event change tea consumption patterns in America?'
		],
		culture: [
			'In what ways did tea ceremonies in different cultures (like Japan and England) reflect and shape social norms?',
			'How did the democratization of tea drinking in Europe affect social structures and daily life?',
			'How has the perception of tea as a medicinal substance evolved from ancient times to the present day?',
			'What are some of the most popular tea-related idioms and proverbs, and what do they mean?'
		],
		production: [
			'How did the processing and preparation of tea evolve over time, and what factors influenced these changes?',
			'What impact did tea plantations have on local ecosystems and labor practices in countries like India and Sri Lanka?',
			'What are the main differences in production methods between black, green, oolong, and white teas?',
			'How does the terroir (environmental factors) affect the flavor and quality of tea?'
		]
	};

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

	function copyToClipboard(text: string) {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				toastMessage = 'Copied to clipboard!';
				showToast = true;
			})
			.catch((err) => {
				toastMessage = 'Failed to copy text.';
				showToast = true;
			});
	}

	function handleToastClose() {
		showToast = false;
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
				</a>, so ask 'em about tea or something.
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
			<div class="bg-base-200 collapse collapse-plus border-primary border mt-20">
				<input type="checkbox" class="peer" />
				<div class="collapse-title bg-base-200 peer-checked:bg-base-300">
					Interesting things to ask:
				</div>
				<div class="collapse-content bg-base-200 peer-checked:bg-base-300">
					{#each Object.entries(QUESTIONS) as [category, questions]}
						<div class="mb-4">
							<h3 class="text-lg font-semibold mb-2 capitalize">{category}</h3>
							<ul class="list-disc list-inside space-y-4">
								{#each questions as item}
									<li class="flex items-center gap-2">
										<span>{item}</span>
										<button
											type="button"
											class="btn btn-sm btn-outline"
											on:click={() => copyToClipboard(item)}
											title="Copy to clipboard"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="currentColor"
												class="w-4 h-4"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
												/>
											</svg>
										</button>
									</li>
								{/each}
							</ul>
						</div>
					{/each}
				</div>
			</div>
		</form>
	</div>
{/if}

{#if showToast}
	<Toast message={toastMessage} type="success" on:close={handleToastClose} />
{/if}
