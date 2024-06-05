<script lang="ts">
	import Editor from '$lib/components/scenes/editor/Editor.svelte';
</script>

<svelte:head>
	<title>silentsilas - Editor</title>
</svelte:head>

<div>
	<Editor />
</div>

<style>
	:global(body) {
		margin: 0;
	}

	div {
		width: 100vw;
		height: 100vh;
		background: rgb(0, 36, 6);
		background: linear-gradient(180deg, rgba(0, 36, 6, 1) 0%, rgba(0, 0, 0, 1) 100%);
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
