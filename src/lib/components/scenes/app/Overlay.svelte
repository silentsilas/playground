<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="overlay container prose bg-base-300/80 border border-primary" id="overlay">
	{@render children?.()}
</div>

<style>
	.overlay {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
		z-index: 1000000000;
	}
</style>
