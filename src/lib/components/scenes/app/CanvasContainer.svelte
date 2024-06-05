<!-- src/lib/CanvasLayout.svelte -->
<script lang="ts">
	import { Canvas } from '@threlte/core';

	function preventRightClick(event: MouseEvent) {
		event.preventDefault();
	}
</script>

<div
	class="canvas flex flex-1"
	on:contextmenu|preventDefault={preventRightClick}
	role="application"
>
	<Canvas>
		<slot />
	</Canvas>
</div>

<style>
	:global(body) {
		margin: 0;
	}

	.canvas {
		margin-top: 69px;
		margin-bottom: 53px;
	}
</style>
