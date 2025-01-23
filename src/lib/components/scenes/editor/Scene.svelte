<script lang="ts" module>
	import { T } from '@threlte/core';
	import { Root, Container, Fullscreen, Text } from 'threlte-uikit';
</script>

<T.PerspectiveCamera position={[0, 0, 5]} />

<T.Group>
	<Root backgroundColor="red" sizeX={8} sizeY={4} flexDirection="row">
		<Container flexGrow={1} margin={32} backgroundColor="green" />
		<Container flexGrow={1} margin={32} backgroundColor="blue" />
	</Root>
	<T.Mesh position={[0, -0.2, 0]} visible>
		<T.BoxGeometry args={[3, 5, 0.1]} />
		<T.MeshStandardMaterial emissive="#187d18" />
	</T.Mesh>
</T.Group>
