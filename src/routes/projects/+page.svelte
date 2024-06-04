<script lang="ts">
	import MenuItem from '$lib/components/scenes/app/MenuItem.svelte';
	import App from '$lib/components/scenes/app/App.svelte';
	import CanvasContainer from '$lib/components/scenes/app/CanvasContainer.svelte';
	import '../../app.css';

	import type { SearchResult } from '$lib/utils/search';
	import { searchResults } from '$lib/store';

	let results: SearchResult[] = [];

	searchResults.subscribe((value: SearchResult[]) => {
		results = value ? value : [];
	});

	type Project = {
		title: string;
		path: string;
		position: [number, number, number];
	};

	const projects: Project[] = [
		{
			title: 'Visions',
			path: 'https://visions.silentsilas.com',
			position: [0, -4, 0]
		},
		{
			title: 'Animation Editor',
			path: '/editor',
			position: [0, 4, 0]
		}
	];
</script>

{#if results.length <= 0}
	<CanvasContainer>
		<App>
			{#each projects as project, i}
				<MenuItem position={project.position} htmlContent={project.title} href={project.path} />
			{/each}
		</App>
	</CanvasContainer>
{/if}

<style>
	:global(body) {
		margin: 0;
	}

	.canvas {
		width: 100%;
		height: 100%;
		background: rgb(0, 36, 6);
		background: linear-gradient(180deg, rgba(0, 36, 6, 1) 0%, rgba(0, 0, 0, 1) 100%);
		position: absolute;
		justify-content: center;
		align-items: center;
	}
</style>
