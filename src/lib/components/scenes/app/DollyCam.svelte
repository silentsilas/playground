<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { onMount } from 'svelte';
	import { PerspectiveCamera, Vector3 } from 'three';
	const { invalidate } = useThrelte();

	let camLookatPosition: Vector3 = new Vector3();
	let camCurrentPosition: Vector3 = new Vector3();
	let camDamping: number = 1;
	let camera: PerspectiveCamera | undefined = $state();

	const handleMouseMove = (event: MouseEvent) => {
		// normalize the mouse position to [-1, 1], and smoothly interpolate the camera's lookAt position
		camLookatPosition.set(
			(event.clientX / window.innerWidth) * 2 - 1,
			-(event.clientY / window.innerHeight) * 2 + 1,
			0
		);
	};

	useTask(
		'dollyCam',
		(delta) => {
			if (!camera) return;
			camCurrentPosition.lerp(camLookatPosition, camDamping * delta);
			camera.lookAt(camCurrentPosition);

			if (camera && camCurrentPosition.distanceTo(camLookatPosition) > 0.1) {
				invalidate();
			}
		},
		{ autoInvalidate: false }
	);

	onMount(() => {
		document.addEventListener('mousemove', handleMouseMove);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
		};
	});
</script>

<T.PerspectiveCamera position.z={25} makeDefault fov={50} far={10000} bind:ref={camera} />
