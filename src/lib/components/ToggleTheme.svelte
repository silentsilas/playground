<script lang="ts">
	// Reactive variable to store the current theme
	let theme = 'forest'; // default theme

	// On component mount, check for saved theme in local storage
	import { onMount } from 'svelte';

	onMount(() => {
		theme = localStorage.getItem('theme') || 'forest';
		updateTheme();
	});

	// Function to toggle theme
	function toggleTheme() {
		theme = theme === 'forest' ? 'light' : 'forest';
		localStorage.setItem('theme', theme);
		updateTheme();
	}

	// Function to update the theme on the body element
	function updateTheme() {
		document.body.setAttribute('data-theme', theme);
	}
</script>

<button on:click={toggleTheme}>Toggle Theme</button>
