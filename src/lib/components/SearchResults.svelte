<script lang="ts">
	import { searchResults } from '$lib/store';
	import type { SearchResult } from '$lib/utils/search';

	let results: SearchResult[] = [];

	searchResults.subscribe((value: SearchResult[]) => {
		results = value ? value : [];
	});

	function slugToTitle(slug: string) {
		return slug
			.replace(/-/g, ' ')
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}
</script>

{#if results.length > 0}
	<div class="container mx-auto flex flex-col items-center">
		<div class="prose">
			<h1 class="py-6">Search results:</h1>
		</div>
		<ul>
			{#each results as result}
				<li class="py-4">
					<h3 class="pb-1">
						<a class="link" href="/poetry/{result.poem.id}">{slugToTitle(result.poem.id)}</a>
						<p class="text-sm">(Relevance: {(result.similarity * 100).toFixed(3)})%</p>
					</h3>
				</li>
			{/each}
		</ul>
	</div>
{/if}
