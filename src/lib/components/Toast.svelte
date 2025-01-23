<script lang="ts">
	interface Props {
		message: string;
		type?: 'info' | 'success' | 'warning' | 'error';
		duration?: number;
		onClose?: () => void;
	}

	let { message, type = 'info', duration = 3000, onClose }: Props = $props();

	let visible = $state(true);

	setTimeout(() => {
		visible = false;
		onClose?.();
	}, duration);
</script>

{#if visible}
	<div class="toast toast-center z-50">
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
