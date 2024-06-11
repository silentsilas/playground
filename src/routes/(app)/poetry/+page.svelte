<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { searchResults } from '$lib/store';
	import type { SearchResult } from '$lib/utils/search';
	import { onMount } from 'svelte';
	import type { PageData } from '../poetry/$types';
	export let data: PageData;

	let results: SearchResult[] = [];

	searchResults.subscribe((value: SearchResult[]) => {
		results = value ? value : [];
	});

	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	let { posts, total } = data;
	const limit = 8;

	let currentPage = Number($page.url.searchParams.get('page')) || 1;
	let totalPages = Math.ceil(total / limit);
	$: $page.url.searchParams.get('page'),
		(currentPage = Number($page.url.searchParams.get('page')) || 1);

	async function fetchData(page: number) {
		const response = await fetch(`/api/poetry?limit=${limit}&page=${page}`);
		const newData = await response.json();
		currentPage = page;
		posts = newData.posts;
		total = newData.total;
		totalPages = Math.ceil(total / limit);
	}

	onMount(() => {
		searchResults.set([]);
	});

	function navigate(page: number) {
		fetchData(page);
		goto(`/poetry/?page=${page}`, { replaceState: true });
	}
</script>

<svelte:head>
	<title>silentsilas - Poetry</title>
</svelte:head>

{#if results.length <= 0}
	<div class="container mx-auto flex flex-col items-center">
		<div class="prose mb-4">
			<h1 class="py-6">Poetry</h1>
		</div>

		<ul>
			{#each posts as post}
				<li class="py-4">
					<h3 class="pb-1">
						<a class="link-primary" href={`/poetry/${post.filename}`}>
							{post.meta.title}
						</a>
					</h3>
					<p class="text-sm">{formatDate(post.meta.date)}</p>
				</li>
			{/each}
		</ul>
		{#if total > 1}
			<nav class="join justify-end py-10">
				<button
					class="join-item btn-primary btn btn-outline"
					on:click={() => navigate(currentPage - 1)}
					disabled={currentPage === 1}>Prev</button
				>
				<div class="join-item content-center px-10">{currentPage} of {totalPages}</div>
				<button
					class="join-item btn btn-primary btn-outline"
					on:click={() => navigate(currentPage + 1)}
					disabled={currentPage === totalPages}>Next</button
				>
			</nav>
		{/if}
	</div>
{/if}
