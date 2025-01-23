<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { WebGPURenderer } from 'three/webgpu';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	function preventRightClick(event: MouseEvent) {
		event.preventDefault();
	}
</script>

<div class="canvas flex flex-1" oncontextmenu={preventRightClick} role="application">
	<Canvas
		createRenderer={(canvas) => {
			return new WebGPURenderer({
				canvas,
				antialias: true,
				forceWebGL: false
			});
		}}
	>
		{@render children?.()}
	</Canvas>
</div>

<style>
	:global(body) {
		margin: 0;
	}

	.canvas {
		max-width: 100vw;
	}
</style>
