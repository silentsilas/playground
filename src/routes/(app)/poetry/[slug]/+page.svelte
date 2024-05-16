<script lang="ts">
	import MenuItem from '$lib/components/scenes/app/MenuItem.svelte';
	import type { PageData } from './$types';
	import DomPortal from '$lib/utils/DomPortal.svelte';
	export let data: PageData;

	const { title, date: _date, Content, categories: _ } = data;
</script>

<MenuItem position={[-2.5, 10, 0]} htmlContent="Back" href="/poetry" />

<DomPortal target="#overlay">
	<div class="py-4">
		<h1 class="text-xl font-medium text-black pb-2">{title}</h1>
		<div>
			<Content />
		</div>
	</div>
</DomPortal>
