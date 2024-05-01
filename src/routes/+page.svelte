<script lang="ts">
	import Home from '$lib/components/scenes/home/Home.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div>
	{#each data.models as model}
		<span>{model.title}</span>
	{/each}
  <Home />
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
		display: absolute;
		justify-content: center;
		align-items: center;
  }
</style>
