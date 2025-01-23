<script lang="ts">
	import PaginatedPosts from '$lib/components/PaginatedPosts.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>silentsilas - Thoughts</title>
</svelte:head>

<PaginatedPosts {data} baseUrl="thoughts" title="Thoughts" />
