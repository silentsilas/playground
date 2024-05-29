<script lang="ts">
	import App from '$lib/components/scenes/app/App.svelte';
	import CanvasContainer from '$lib/components/scenes/app/CanvasContainer.svelte';
	import '../../app.css'
</script>

<CanvasContainer>
	<App>
		<slot />
	</App>

</CanvasContainer>

<div class="overlay container" id="overlay"></div>

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

	.overlay {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: rgba(16, 56, 30, 0.9);
	}
</style>
