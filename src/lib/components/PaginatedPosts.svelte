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
	<div class="prose flex flex-row py-6 items-center">
		<h1 class="mb-0">{title}</h1>
		<a
			aria-label="Link to poetry RSS feed."
			class="link-primary mt-2 ml-2"
			href={`${baseUrl}/rss`}
			rel="external"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="size-5"
			>
				<path
					fill-rule="evenodd"
					d="M3.75 4.5a.75.75 0 0 1 .75-.75h.75c8.284 0 15 6.716 15 15v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75C18 11.708 12.292 6 5.25 6H4.5a.75.75 0 0 1-.75-.75V4.5Zm0 6.75a.75.75 0 0 1 .75-.75h.75a8.25 8.25 0 0 1 8.25 8.25v.75a.75.75 0 0 1-.75.75H12a.75.75 0 0 1-.75-.75v-.75a6 6 0 0 0-6-6H4.5a.75.75 0 0 1-.75-.75v-.75Zm0 7.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
					clip-rule="evenodd"
				/>
			</svg>
		</a>
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
