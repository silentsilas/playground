<script lang="ts">
	import type { PageData } from './$types';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const { title, date: _date, Content, categories: _ } = data;
</script>

<svelte:head>
	<title>silentsilas - {title}</title>
</svelte:head>

<div class="container mx-auto flex flex-col items-center prose px-4">
	<h1 class="py-6 mb-0">{title}</h1>
	<Content />
	<a href="/poetry" class="link-primary py-10">Back to Poetry</a>
</div>
