<script lang="ts">
  import { Canvas } from '@threlte/core'
  import Home from '$lib/components/scenes/Home.svelte'
	import { World } from '@threlte/rapier';
	import { Inspector } from 'three-inspect';
	import { dev } from '$app/environment';

</script>

<Canvas>
  <World gravity={[0, 0, 0]}>
    <Home />
  </World>
	{#if dev}
		<Inspector />
	{/if}
</Canvas>
