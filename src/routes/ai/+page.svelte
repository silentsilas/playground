<script lang="ts">
	import '../../app.css';
	import { onMount } from 'svelte';
	import { marked } from 'marked';
	import Toast from '$lib/components/Toast.svelte';
	import { HumanMessage, type AIMessage } from '@langchain/core/messages';
	import { ChatManager } from '$lib/components/ai/ChatManager';
	import Keys from '$lib/components/ai/Settings.svelte';

	let query = $state('');
	let loading = $state(false);
	let showToast = $state(false);
	let toastMessage = $state('');
	let showSettings = $state(false);

	let chatManager: ChatManager;
	let chatHistory: (HumanMessage | AIMessage)[] = $state([]);

	onMount(() => {
		initializeChatManager();
	});

	function initializeChatManager() {
		try {
			chatManager = new ChatManager();
			chatHistory = chatManager.getChatHistory();
		} catch (error) {
			console.error('Error initializing chat manager:', error);
			showError('Please set up your API key');
			showSettings = true;
		}
	}

	function showError(message: string) {
		toastMessage = message;
		showToast = true;
	}

	function getMessageContent(message: HumanMessage | AIMessage): string {
		const content = message.content;
		if (typeof content === 'string') {
			return content;
		}
		if (Array.isArray(content)) {
			return content
				.map((item) => {
					if (typeof item === 'string') {
						return item as string;
					}
					return item || ('' as string);
				})
				.join(' ');
		}
		return '';
	}

	function renderMarkdown(content: string) {
		return marked(content);
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (!query.trim()) return;
		loading = true;
		try {
			const { chatHistory: newHistory } = await chatManager.sendMessage(query);
			chatHistory = newHistory;
			query = '';
		} catch (error) {
			console.error('Error fetching AI response:', error);
			showError('Failed to get response from AI');
		} finally {
			loading = false;
		}
	}

	async function handleNewSession() {
		chatManager.clearHistory();
		chatHistory = [];
		query = '';
	}

	function handleApiKeySave() {
		showSettings = false;
		initializeChatManager();
	}
</script>

<svelte:head>
	<title>silentsilas - AI</title>
</svelte:head>

<div class="flex-grow flex-col overflow-auto p-4 my-2 bg-base-200">
	<div class="flex flex-col items-center gap-4">
		<div class="avatar">
			<div class="ring-primary ring-offset-base-100 w-64 rounded-full ring ring-offset-2">
				<img src="/imgs/ai/profile.jpg" alt="Portrait of an orange tabby cat reading a book" />
			</div>
		</div>
		<span> This lil guy just got out of AI school, so ask 'em about something. </span>
	</div>
	<div class="space-y-4">
		{#each chatHistory as message}
			{#if message instanceof HumanMessage}
				<div class="chat chat-end">
					<div class="chat-bubble chat-bubble-primary prose">
						{@html renderMarkdown(getMessageContent(message))}
					</div>
				</div>
			{:else}
				<div class="p-4 rounded-lg bg-base-300 prose md:container">
					{@html renderMarkdown(getMessageContent(message))}
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
	<form onsubmit={handleSubmit} class="mt-4 flex-col">
		<label class="form-control">
			<textarea
				bind:value={query}
				class="textarea textarea-bordered h-24"
				placeholder="Type your message here..."
			></textarea>
		</label>
		<button type="submit" class="btn btn-block btn-primary mt-4" disabled={loading}> Send </button>
		<button
			type="button"
			class="btn btn-block btn-error btn-outline mt-2"
			onclick={handleNewSession}
		>
			New Session
		</button>
	</form>

	<div class="mt-2 flex-col">
		<button
			type="button"
			class="btn btn-block btn-outline"
			onclick={() => (showSettings = !showSettings)}
		>
			Settings
		</button>
	</div>
</div>

{#if showToast}
	<Toast message={toastMessage} type="success" onClose={() => (showToast = false)} />
{/if}

{#if showSettings}
	<Keys onClose={() => (showSettings = false)} onSave={handleApiKeySave} />
{/if}
