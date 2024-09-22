<script lang="ts">
	import SearchResults from '$lib/components/SearchResults.svelte';
	import AppContainer from '$lib/components/scenes/app/AppContainer.svelte';
</script>

<AppContainer>
	<slot />
	<SearchResults />
</AppContainer>
