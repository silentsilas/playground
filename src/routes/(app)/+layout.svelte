<script lang="ts">
	import '../../app.css';
	import SearchResults from '$lib/components/SearchResults.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<NavBar>
	<div class="flex flex-col items-center flex-1 overflow-auto py-4">
		<slot />
		<SearchResults />
	</div>

	<slot name="footer">
		<Footer />
	</slot>
</NavBar>
