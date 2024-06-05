<script lang="ts">
	import { searchResults } from '$lib/store';
	import type { SearchResult } from '$lib/utils/search';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	const { title, date: _date, Content, categories: _ } = data;

	let results: SearchResult[] = [];

	searchResults.subscribe((value: SearchResult[]) => {
		results = value ? value : [];
	});
	onMount(() => {
		searchResults.set([]);
	});
</script>

{#if results.length <= 0}
	<div class="container mx-auto flex flex-col items-center prose px-4">
		<h1 class="pt-10">{title}</h1>
		<Content />
		<a href="/thoughts" class="link-primary py-10">Back to Thoughts</a>
	</div>
{/if}
