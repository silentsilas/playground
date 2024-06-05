<!-- src/lib/CanvasLayout.svelte -->
<script lang="ts">
	import { Canvas } from '@threlte/core';

	function preventRightClick(event: MouseEvent) {
		event.preventDefault();
	}
</script>

<div class="canvas" on:contextmenu|preventDefault={preventRightClick} role="application">
	<Canvas>
		<slot />
	</Canvas>
</div>

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
