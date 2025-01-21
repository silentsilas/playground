<script lang="ts">
	import SearchResults from '$lib/components/SearchResults.svelte';
	import AppContainer from '$lib/components/scenes/app/AppContainer.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<AppContainer>
	{@render children?.()}
	<SearchResults />
</AppContainer>
