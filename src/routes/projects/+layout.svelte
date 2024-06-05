<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import SearchResults from '$lib/components/SearchResults.svelte';
</script>

<NavBar>
	<slot />
	<SearchResults />
</NavBar>
<Footer />
