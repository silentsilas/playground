<script lang="ts">
	import '../../app.css';
	import AppContainer from '$lib/components/scenes/app/AppContainer.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<AppContainer>
	{@render children?.()}
</AppContainer>
