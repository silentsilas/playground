<script lang="ts">
	import NavBar from '$lib/components/NavBar.svelte';
	import SearchResults from '$lib/components/SearchResults.svelte';
</script>

<NavBar>
	<slot />
	<SearchResults />
</NavBar>
