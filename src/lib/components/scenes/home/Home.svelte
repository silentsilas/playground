<script lang="ts">
	import { Canvas, T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import OrbitingSpheres from '$lib/components/scenes/home/OrbitingSpheres.svelte';
	import { World } from '@threlte/rapier';
	import { Inspector } from 'three-inspect';
	import { dev } from '$app/environment';
	import SpaceSkysphere from './SpaceSkysphere.svelte';
</script>

<Canvas>
	<World gravity={[0, 0, 0]}>
		<T.PerspectiveCamera position.y={15} position.z={25} makeDefault fov={70} far={10000}>
			<OrbitControls
				enableZoom={false}
				enablePan={false}
				enableRotate={false}
				enableDamping
				target.y={0}
				autoRotate
			/>
		</T.PerspectiveCamera>

		<SpaceSkysphere size={100} count={500} />

		<OrbitingSpheres position={[0, 0, 0]} range={10} />
	</World>

	{#if dev}
		<Inspector />
	{/if}
</Canvas>
