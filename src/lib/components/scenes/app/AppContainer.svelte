<script>
	import Footer from '$lib/components/Footer.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
</script>

<div
	class="flex flex-col flex-1 overflow-auto fixed h-full w-screen bg-base-300"
	style="overflow-x: hidden;"
>
	<NavBar></NavBar>

	<div class="flex flex-1 overflow-auto">
		<slot />
	</div>

	<Footer></Footer>
</div>
