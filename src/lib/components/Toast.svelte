<script lang="ts">
	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	export let message: string;
	export let type: 'info' | 'success' | 'warning' | 'error' = 'info';
	export let duration: number = 3000;

	const dispatch = createEventDispatcher();

	let visible = true;

	setTimeout(() => {
		visible = false;
		dispatch('close');
	}, duration);
</script>

{#if visible}
	<div class="toast toast-center z-50" transition:fade>
		<div class="alert alert-{type}">
			<span>{message}</span>
		</div>
	</div>
{/if}

<style>
	.toast {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
	}
</style>
