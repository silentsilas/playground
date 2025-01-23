<script lang="ts">
	import PaginatedPosts from '$lib/components/PaginatedPosts.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>silentsilas - Poetry</title>
</svelte:head>

<PaginatedPosts {data} baseUrl="poetry" title="Poetry" />
