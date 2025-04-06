<script lang="ts">
	type Suggestion = {
		word: string;
		score: number;
	};

	let { title, suggestions, selectedIndex, onSelect } = $props<{
		title: string;
		suggestions: Suggestion[];
		selectedIndex: number;
		onSelect: (word: string) => void;
	}>();

	const isMobile = window.innerWidth < 768;

	function handleTouchSelect(event: TouchEvent, word: string) {
		event.preventDefault();
		onSelect(word);
	}
</script>

<div class="bg-white dark:bg-gray-800 shadow-lg rounded-md p-2 mb-2">
	<h3 class="text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">{title}</h3>
	{#each suggestions.slice(0, 10) as { word }, i}
		<button
			type="button"
			class="block w-full text-left px-2 {isMobile
				? 'py-3'
				: 'py-1'} hover:bg-gray-100 dark:hover:bg-gray-700 rounded
        {selectedIndex === i ? 'bg-gray-100 dark:bg-gray-700' : ''}"
			onmousedown={() => onSelect(word)}
			ontouchstart={(e) => handleTouchSelect(e, word)}
			role="option"
			aria-selected={selectedIndex === i}
			style:touch-action="manipulation"
		>
			{word}
		</button>
	{/each}
</div>

<style>
	/* Mobile-specific styles */
	@media (max-width: 768px) {
		button {
			padding: 12px 8px;
			margin-bottom: 4px;
			font-size: 16px; /* Minimum readable size on mobile */
		}
	}
</style>
