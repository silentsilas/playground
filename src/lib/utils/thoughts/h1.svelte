<script lang="ts">
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<h1 class="poetry-headline">
  {@render children?.()}
</h1>
