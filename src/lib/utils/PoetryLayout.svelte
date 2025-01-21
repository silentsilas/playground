<script module>
	import Headline from './poetry/h1.svelte';
	import p from './poetry/p.svelte';
	export { Headline as h1, p };
</script>

<script lang="ts">
	let { title, date, categories, tags, year, layout, children } = $props();
</script>

<main>
	{@render children?.()}
</main>
