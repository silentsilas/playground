<script lang="ts" module>
	import { T } from '@threlte/core';
</script>

<T.PerspectiveCamera position={[0, 0, 5]} />

<T.Group>
	<T.Mesh position={[ 0, -0.2, 0 ]}>
		<T.BoxGeometry args={[1, 1, 1]} />
		<T.MeshBasicMaterial color="red" />
	</T.Mesh>
</T.Group>
