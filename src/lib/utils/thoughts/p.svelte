<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<p class="whitespace-pre-wrap">
	{@render children?.()}
</p>
