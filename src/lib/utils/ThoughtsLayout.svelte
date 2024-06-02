<script context="module">
	import Headline from './thoughts/h1.svelte';
	import p from './thoughts/p.svelte';
	export { Headline as h1, p };
</script>

<script lang="ts">
	export let title;
	export let date;
	export let categories;
	export let tags;
	export let year;
	export let layout;
</script>

<main>
	<slot />
</main>
