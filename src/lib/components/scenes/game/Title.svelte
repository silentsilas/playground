<script lang="ts">
	import { Root, Container } from 'threlte-uikit';
</script>

<Root backgroundColor="red" sizeX={8} sizeY={4} flexDirection="row">
	<Container flexGrow={1} margin={32} backgroundColor="green" />
	<Container flexGrow={1} margin={32} backgroundColor="blue" />
</Root>
