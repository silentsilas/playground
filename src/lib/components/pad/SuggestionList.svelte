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
</script>

<div class="bg-white dark:bg-gray-800 shadow-lg rounded-md p-2 mb-2">
	<h3 class="text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">{title}</h3>
	{#each suggestions.slice(0, 10) as { word }, i}
		<button
			type="button"
			class="block w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded
        {selectedIndex === i ? 'bg-gray-100 dark:bg-gray-700' : ''}"
			onmousedown={() => onSelect(word)}
			role="option"
			aria-selected={selectedIndex === i}
		>
			{word}
		</button>
	{/each}
</div>
