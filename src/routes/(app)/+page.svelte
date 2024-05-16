<script lang="ts">
	import MenuItem from '$lib/components/scenes/app/MenuItem.svelte';
</script>

<MenuItem position={[-2.5, 7.5, 0]} htmlContent="Poetry" href="/poetry" />

<MenuItem
	position={[2.5, 2.5, -2.5]}
	htmlContent="Projects"
	clickHandler={() => console.log('clicked!')}
/>

<MenuItem
	position={[-2.5, -2.5, -2.5]}
	htmlContent="Thoughts"
	clickHandler={() => console.log('clicked!')}
/>

<MenuItem
	position={[2.5, -7.5, 2.5]}
	htmlContent="About"
	clickHandler={() => console.log('clicked!')}
/>
