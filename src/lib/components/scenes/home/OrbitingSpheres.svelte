<script lang="ts" context="module">
	const geometry = new SphereGeometry(1, 8, 4);
	const material = new MeshBasicMaterial({ color: '#339933' });
</script>

<script lang="ts">
	import { T } from '@threlte/core';
	import { HTML } from '@threlte/extras';
	import { Attractor, Collider, RigidBody } from '@threlte/rapier';
	import { MeshBasicMaterial, SphereGeometry, Vector3 } from 'three';

	export let range: number = 10;
	export let position: [number, number, number] = [0, 0, 0];
	let isHovering = false;
	let isPointerDown = false;
	const bodyPositions = [
		new Vector3(position[0] - range, position[0] - range, position[0] - range).toArray(),
		new Vector3(position[1] + range / 2, position[1] + range, position[1] + range).toArray(),
		new Vector3(position[2] + range, position[2] - range / 2, position[2] + range).toArray()
	];

	const getId = () => {
		return Math.random().toString(16).slice(2);
	};

	const getRandomSize = (): number => {
		return Math.random() / 4 + 0.25;
	};

	const generateBodies = (c: number) => {
		return Array(c)
			.fill('x')
			.map((_, index) => {
				return {
					id: getId(),
					position: bodyPositions[index],
					size: getRandomSize()
				};
			});
	};

	const onClick = () => {
		console.log('clicked');
	};

	$: bodies = generateBodies(2);
</script>

<HTML position.x={position[0]} position.y={position[1]} position.z={position[2]}>
	<button
		on:pointerenter={() => (isHovering = true)}
		on:pointerleave={() => {
			isPointerDown = false;
			isHovering = false;
		}}
		on:pointerdown={() => (isPointerDown = true)}
		on:pointerup={() => (isPointerDown = false)}
		on:pointercancel={() => {
			isPointerDown = false;
			isHovering = false;
		}}
		on:click={onClick}
		class="rounded-full bg-orange-500 px-3 text-white hover:opacity-90 active:opacity-70"
	>
		Hello!
	</button>
</HTML>

<Attractor
	position.x={position[0]}
	position.y={position[1]}
	position.z={position[2]}
	range={200}
	strength={isHovering ? 1 : 0.1}
	gravityType={'linear'}
/>

{#each bodies as body (body.id)}
	<T.Group position={body.position}>
		<RigidBody>
			<Collider shape="ball" args={[body.size]} mass={body.size} />
			<Attractor range={50} strength={1} gravityType={'newtonian'} />
			<T.Mesh scale={[body.size, body.size, body.size]} {geometry} {material} />
		</RigidBody>
	</T.Group>
{/each}
