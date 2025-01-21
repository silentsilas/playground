<script lang="ts" module>
	import { T } from '@threlte/core';
	import { Attractor, Collider, RigidBody } from '@threlte/rapier';
	import { MeshBasicMaterial, SphereGeometry } from 'three';
	const geometry = new SphereGeometry(1, 8, 4);
	const material = new MeshBasicMaterial({ color: '#339933', wireframe: true });
	const position: [number, number, number] = [0, 0, 0];
	const scale: number = 2;
	const offset = position.map((el) => el + 1.5);
</script>

<Attractor {position} range={100} strength={0.3} gravityType={'linear'} />

<T.Group position.x={-offset[0]} position.y={-offset[1]} position.z={offset[2]}>
	<RigidBody linearDamping={0.3}>
		<Collider shape="ball" args={[scale]} mass={scale} />
		<T.Mesh scale={[scale, scale, scale]} {geometry} {material} />
	</RigidBody>
</T.Group>
