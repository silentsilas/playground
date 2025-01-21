<script lang="ts">
	import { searchResults } from '$lib/store';
	import type { SearchResult } from '$lib/utils/search';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const { title, date: _date, Content, categories: _ } = data;

	let results: SearchResult[] = $state([]);

	searchResults.subscribe((value: SearchResult[]) => {
		results = value ? value : [];
	});
	onMount(() => {
		searchResults.set([]);
	});
</script>

<svelte:head>
	<title>silentsilas - {title}</title>
</svelte:head>

{#if results.length <= 0}
	<div class="container mx-auto flex flex-col items-center prose px-4">
		<h1 class="py-6 mb-0">{title}</h1>
		<Content />
		<a href="/poetry" class="link-primary py-10">Back to Poetry</a>
	</div>
{/if}
