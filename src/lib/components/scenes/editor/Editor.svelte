<script lang="ts">
	import { dev } from '$app/environment';
	import { Canvas } from '@threlte/core';
	import Spinners from '$lib/components/scenes/editor/Spinners.svelte';
	import { Studio } from '@threlte/theatre';
</script>

<Studio enabled={dev} />

<Canvas>
	<Spinners />
</Canvas>
