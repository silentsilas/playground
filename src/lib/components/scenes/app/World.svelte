<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { World } from '@threlte/rapier';
	import { dev } from '$app/environment';
	import SpaceSkysphere from './SpaceSkysphere.svelte';
	import { Group, type Object3DEventMap } from 'three';
	import DollyCam from './DollyCam.svelte';
	import Planet from '$lib/components/scenes/app/Planet.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	const { invalidate } = useThrelte();
	let spaceObjects: Group<Object3DEventMap> = $state();

	useTask(
		'updateSpaceObjects',
		(delta) => {
			if (!spaceObjects) return;
			spaceObjects.rotation.y += 0.3 * delta;
			spaceObjects.position.y = Math.sin(spaceObjects.rotation.y);

			invalidate();
		},
		{ autoInvalidate: false }
	);
</script>

<World gravity={[0, 0, 0]}>
	<DollyCam />

	<T.Group bind:ref={spaceObjects}>
		<SpaceSkysphere size={100} count={500} />

		<Planet />

		{@render children?.()}
	</T.Group>
</World>
