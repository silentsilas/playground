<script lang="ts">
	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	interface Props {
		message: string;
		type?: 'info' | 'success' | 'warning' | 'error';
		duration?: number;
	}

	let { message, type = 'info', duration = 3000 }: Props = $props();

	const dispatch = createEventDispatcher();

	let visible = $state(true);

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
