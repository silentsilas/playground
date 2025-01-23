<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from '$lib/components/scenes/editor/Scene.svelte';
</script>

<Canvas>
	{#if import.meta.env.MODE === 'development'}
		{#await import('@threlte/studio') then { Studio }}
			<Studio>
				<Scene />
			</Studio>
		{/await}
	{:else}
		<Scene />
	{/if}
</Canvas>
