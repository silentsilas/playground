<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import SearchResults from '$lib/components/SearchResults.svelte';
	import AppContainer from '$lib/components/scenes/app/AppContainer.svelte';
</script>

<AppContainer>
	<slot />
	<SearchResults />
</AppContainer>
