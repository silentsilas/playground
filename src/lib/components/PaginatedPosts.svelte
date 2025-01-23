<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { searchResults } from '$lib/store';
	import type { SearchResult } from '$lib/utils/search';
	import { onMount } from 'svelte';

	interface Post {
		filename: string;
		meta: {
			title: string;
			date: string;
		};
	}

	interface Props {
		data: {
			posts: Post[];
			total: number;
		};
		baseUrl: string;
		title: string;
	}

	const POSTS_PER_PAGE = 8;

	let { data, baseUrl, title }: Props = $props();
	let { posts, total } = $state(data);
	let results: SearchResult[] = $state([]);
	let currentPage = $state(Number(page.url.searchParams.get('page')) || 1);
	let totalPages = $state(0);

	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	async function fetchData(page: number) {
		const response = await fetch(`/api/${baseUrl}?limit=${POSTS_PER_PAGE}&page=${page}`);
		const newData = await response.json();
		currentPage = page;
		posts = newData.posts;
		total = newData.total;
	}

	function navigate(page: number) {
		fetchData(page);
		goto(`/${baseUrl}/?page=${page}`, { replaceState: true });
	}

	// Effects and Subscriptions
	$effect.pre(() => {
		currentPage = Number(page.url.searchParams.get('page')) || 1;
	});

	$effect(() => {
		totalPages = Math.ceil(total / POSTS_PER_PAGE);
	});

	searchResults.subscribe((value: SearchResult[]) => {
		results = value ? value : [];
	});

	// Lifecycle
	onMount(() => {
		searchResults.set([]);
	});
</script>

<div class="container mx-auto flex flex-col items-center">
	<div class="prose mb-4">
		<h1 class="py-6">{title}</h1>
	</div>

	<ul>
		{#each posts as post}
			<li class="py-4">
				<h3 class="pb-1">
					<a class="link-primary" href={`/${baseUrl}/${post.filename}`}>
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
				onclick={() => navigate(currentPage - 1)}
				disabled={currentPage === 1}
			>
				Prev
			</button>
			<div class="join-item content-center px-10">
				{currentPage} of {totalPages}
			</div>
			<button
				class="join-item btn btn-primary btn-outline"
				onclick={() => navigate(currentPage + 1)}
				disabled={currentPage === totalPages}
			>
				Next
			</button>
		</nav>
	{/if}
</div>
