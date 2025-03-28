<script lang="ts">
	import { Tipex, type TipexEditor } from '@friendofsvelte/tipex';
	import '@friendofsvelte/tipex/styles/Tipex.css';
	import '@friendofsvelte/tipex/styles/ProseMirror.css';
	import '@friendofsvelte/tipex/styles/Controls.css';
	import '@friendofsvelte/tipex/styles/EditLink.css';
	import '@friendofsvelte/tipex/styles/CodeBlock.css';
	import Utilities from './Utilities.svelte';

	let { initialContent } = $props();

	let body = $state(localStorage.getItem('tipex') || initialContent);
	let editor = $state<TipexEditor>();
	let suggestions = $state<Array<{ word: string; score: number }>>([]);
	let rhymes = $state<Array<{ word: string; score: number }>>([]);
	let currentWord = $state('');
	let cursorPosition = $state({ x: 0, y: 0 });
	let debounceTimer = $state<NodeJS.Timeout>();

	type Suggestion = {
		word: string;
		score: number;
	};

	function debounce<T extends (...args: any[]) => any>(
		fn: T,
		delay: number
	): (...args: Parameters<T>) => void {
		return (...args: Parameters<T>) => {
			clearTimeout(debounceTimer);
			debounceTimer = setTimeout(() => fn(...args), delay);
		};
	}

	const datamuseApi = {
		async getSuggestions(word: string): Promise<Suggestion[]> {
			if (!word || word.length < 2) return [];
			const response = await fetch(`https://api.datamuse.com/sug?s=${encodeURIComponent(word)}`);
			return response.json();
		},

		async getRhymes(word: string): Promise<Suggestion[]> {
			if (!word) return [];
			const response = await fetch(
				`https://api.datamuse.com/words?rel_rhy=${encodeURIComponent(word)}`
			);
			return response.json();
		}
	};

	const debouncedFetchSuggestions = debounce(async (word: string) => {
		suggestions = await datamuseApi.getSuggestions(word);
	}, 300);

	async function handleSelectionChange() {
		const selection = editor?.view.state.selection;
		if (selection && !selection.empty) {
			const selectedText = editor?.view.state.doc.textBetween(selection.from, selection.to, ' ');

			if (selectedText) {
				rhymes = await datamuseApi.getRhymes(selectedText);
				updateCursorPosition();
			}
		}
	}

	function updateCursorPosition() {
		const selection = window.getSelection();
		if (!selection?.rangeCount) return;

		const range = selection.getRangeAt(0);
		const rect = range.getBoundingClientRect();

		const x = Math.min(Math.max(rect.left + window.scrollX, 100), window.innerWidth - 100);

		cursorPosition = {
			x,
			y: rect.bottom + window.scrollY + 10
		};
	}

	async function handleUpdate() {
		const currentHtml = editor?.getHTML();
		localStorage.setItem('tipex', currentHtml || '');

		const { state } = editor?.view || {};
		const { doc, selection } = state || {};

		if (!doc || !selection) return;
		const pos = selection.from;
		const currentChar = doc.textBetween(Math.max(0, pos - 1), pos);

		if (/[\s\.,!?;:]/.test(currentChar)) {
			suggestions = [];
			currentWord = '';
			return;
		}

		const textBefore = doc.textBetween(Math.max(0, pos - 100), pos);

		const lastSpace = textBefore.search(/\s\w+$/);
		const currentWordMatch =
			lastSpace >= 0 ? textBefore.slice(lastSpace).match(/\w+$/) : textBefore.match(/\w+$/);

		const word = currentWordMatch ? currentWordMatch[0] : '';

		if (word && word !== currentWord) {
			currentWord = word;
			debouncedFetchSuggestions(currentWord);
		} else if (!word) {
			suggestions = [];
			currentWord = '';
		}
		updateCursorPosition();
	}

	async function handleMouseUp(event: MouseEvent | TouchEvent) {
		handleSelectionChange();
	}

	async function handleMouseDown() {
		suggestions = [];
		currentWord = '';
		rhymes = [];
	}

	function applySuggestion(suggestion: string) {
		if (!editor?.view) return;

		const view = editor.view;
		const { state } = view;
		const { schema, selection, tr } = state;

		view.focus();

		if (rhymes.length > 0 && !selection.empty) {
			const newTr = tr.replaceSelectionWith(schema.text(suggestion));
			view.dispatch(newTr);
			rhymes = [];
		} else {
			const pos = selection.from;
			const wordBefore = state.doc.textBetween(Math.max(0, pos - 100), pos);
			const match = wordBefore.match(/\S+$/);

			if (match) {
				const wordStart = pos - match[0].length;
				const newTr = tr.replaceWith(wordStart, pos, schema.text(suggestion));
				view.dispatch(newTr);
			}
		}

		suggestions = [];
		currentWord = '';

		setTimeout(() => {
			view.focus();
		}, 0);
	}
</script>

<svelte:window on:selectionchange={handleSelectionChange} />

<div
	class="container mx-auto my-8 dark relative px-4"
	onmouseup={handleMouseUp}
	ontouchend={handleMouseUp}
	onmousedown={handleMouseDown}
	ontouchstart={handleMouseDown}
	role="textbox"
	aria-label="Text editor container"
	tabindex="0"
>
	<Tipex {body} controls !focal class="h-[80vh]" bind:tipex={editor} onupdate={handleUpdate}>
		{#snippet utilities(editor)}
			<Utilities {editor} />
		{/snippet}
	</Tipex>

	{#if suggestions.length > 0 || rhymes.length > 0}
		<div
			class="suggestions-container"
			role="listbox"
			style:left="{cursorPosition.x}px"
			style:top="{cursorPosition.y}px"
		>
			{#if suggestions.length > 0}
				<div class="bg-white dark:bg-gray-800 shadow-lg rounded-md p-2 mb-2">
					<h3 class="text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Suggestions</h3>
					{#each suggestions.slice(0, 10) as { word }}
						<button
							type="button"
							class="block w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
							onmousedown={() => applySuggestion(word)}
							role="option"
							aria-selected="false"
						>
							{word}
						</button>
					{/each}
				</div>
			{/if}

			{#if rhymes.length > 0}
				<div class="bg-white dark:bg-gray-800 shadow-lg rounded-md p-2">
					<h3 class="text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Rhymes</h3>
					{#each rhymes.slice(0, 10) as { word }}
						<button
							class="block w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
							onmousedown={() => applySuggestion(word)}
							role="option"
							aria-selected="false"
						>
							{word}
						</button>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.suggestions-container {
		position: absolute;
		z-index: 1000;
		max-width: min(300px, 90vw);
		max-height: 30vh;
		overflow-y: auto;
		bottom: 1rem;
		overscroll-behavior: contain;
		left: var(--suggestion-x, 50%);
		top: var(--suggestion-y, -50%);
		transform: translate(-50%, -50%);
	}
</style>
