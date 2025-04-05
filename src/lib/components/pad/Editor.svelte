<script lang="ts">
	import { Tipex, type TipexEditor } from '@friendofsvelte/tipex';
	import '@friendofsvelte/tipex/styles/Tipex.css';
	import '@friendofsvelte/tipex/styles/ProseMirror.css';
	import '@friendofsvelte/tipex/styles/Controls.css';
	import '@friendofsvelte/tipex/styles/EditLink.css';
	import '@friendofsvelte/tipex/styles/CodeBlock.css';
	import Utilities from './Utilities.svelte';
	import SuggestionList from './SuggestionList.svelte';
	import { datamuseApi, type Suggestion } from '$lib/services/datamuse';
	import { calculateCursorPosition } from '$lib/utils/cursor';
	import { createDebounce } from '$lib/utils/debounce';
	import { extractCurrentWord, extractSelectedWord } from '$lib/utils/text';

	let { initialContent } = $props();

	let editor = $state<TipexEditor>();
	let body = $state(initialContent || localStorage.getItem('tipex') || '');
	let suggestions = $state<Suggestion[]>([]);
	let rhymes = $state<Suggestion[]>([]);
	let currentWord = $state('');
	let selectedIndex = $state(-1);
	let cursorPosition = $state({ x: 0, y: 0 });
	const debounce = createDebounce();

	$effect(() => {
		if (editor?.getHTML()) {
			localStorage.setItem('tipex', editor.getHTML());
		}
	});

	function updateCursorPosition() {
		cursorPosition = calculateCursorPosition(editor);
	}

	const handleUpdate = debounce(async () => {
		const { state } = editor?.view || {};
		if (!state) return;

		const { doc, selection } = state;
		const word = extractCurrentWord(doc, selection.from);

		if (word && word !== currentWord) {
			currentWord = word;
			suggestions = await datamuseApi.getSuggestions(word);
			selectedIndex = -1;
		} else if (!word) {
			suggestions = [];
			currentWord = '';
		}
		updateCursorPosition();
	}, 300);

	const handleSelectionChange = debounce(async () => {
		const selection = editor?.view.state.selection;
		if (editor && selection && !selection.empty) {
			const word = extractSelectedWord(editor.view.state.doc, selection.from, selection.to);
			if (word) {
				rhymes = await datamuseApi.getRhymes(word);
				selectedIndex = -1;
				updateCursorPosition();
			}
		}
	}, 300);

	function clearSuggestions() {
		suggestions = [];
		rhymes = [];
		currentWord = '';
		selectedIndex = -1;
	}

	function applySuggestion(word: string) {
		if (!editor?.view) return;

		const view = editor.view;
		const { state } = view;
		const { schema, selection, tr } = state;

		view.focus();

		if (rhymes.length > 0 && !selection.empty) {
			view.dispatch(tr.replaceSelectionWith(schema.text(word)));
			rhymes = [];
		} else {
			const pos = selection.from;
			const wordBefore = state.doc.textBetween(Math.max(0, pos - 100), pos);
			const match = wordBefore.match(/\S+$/);

			if (match) {
				const wordStart = pos - match[0].length;
				view.dispatch(tr.replaceWith(wordStart, pos, schema.text(word)));
			}
		}

		clearSuggestions();
		view.focus();
	}

	function handleKeydown(event: KeyboardEvent) {
		const activeSuggestions = suggestions.length ? suggestions : rhymes;
		if (!activeSuggestions.length) return;

		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				selectedIndex = Math.min(selectedIndex + 1, activeSuggestions.length - 1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				selectedIndex = Math.max(selectedIndex - 1, -1);
				break;
			case 'Enter':
				event.preventDefault();
				if (selectedIndex >= 0) {
					applySuggestion(activeSuggestions[selectedIndex].word);
				}
				break;
			case 'Escape':
				event.preventDefault();
				clearSuggestions();
				break;
		}
	}
</script>

<svelte:window onselectionchange={handleSelectionChange} onkeydown={handleKeydown} />

<div
	class="container mx-auto my-8 dark relative px-4"
	onmouseup={handleSelectionChange}
	ontouchend={handleSelectionChange}
	onmousedown={clearSuggestions}
	ontouchstart={clearSuggestions}
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
			aria-label="Suggestions and rhymes"
			style:left="{cursorPosition.x}px"
			style:top="{cursorPosition.y}px"
		>
			{#if suggestions.length > 0}
				<SuggestionList
					title="Suggestions"
					{suggestions}
					{selectedIndex}
					onSelect={applySuggestion}
				/>
			{/if}

			{#if rhymes.length > 0}
				<SuggestionList
					title="Rhymes"
					suggestions={rhymes}
					{selectedIndex}
					onSelect={applySuggestion}
				/>
			{/if}
		</div>
	{/if}
</div>

<style>
	.suggestions-container {
		position: fixed;
		z-index: 1000;
		max-width: min(300px, 90vw);
		max-height: 300px;
		overflow-y: auto;
		transform: translateX(-50%);
		overscroll-behavior: contain;
		scroll-behavior: smooth;
		box-shadow:
			0 4px 6px -1px rgb(0 0 0 / 0.1),
			0 2px 4px -2px rgb(0 0 0 / 0.1);
	}
</style>
