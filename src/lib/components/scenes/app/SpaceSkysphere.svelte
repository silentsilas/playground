<script lang="ts">
	import { isInstanceOf, T } from '@threlte/core';
	interface Props {
		size?: number;
		count?: number;
		color?: any;
	}

	let {
		size = 100,
		count = 500,
		color = localStorage.getItem('theme') === 'forest' ? 'white' : '#a991f7'
	}: Props = $props();

	const positions = $state(new Float32Array(count * 3));

	// randomly distribute points in a cube
	for (let i = 0; i < count; i++) {
		positions[i * 3 + 0] = (Math.random() - 0.5) * size;
		positions[i * 3 + 1] = (Math.random() - 0.5) * size;
		positions[i * 3 + 2] = (Math.random() - 0.5) * size;
	}
</script>

<T.Points>
	<T.BufferGeometry>
		<T.BufferAttribute
			args={[positions, 3]}
			attach={({ ref, parent, parentObject3D }) => {
				if (isInstanceOf(parent, 'BufferGeometry') && isInstanceOf(ref, 'BufferAttribute')) {
					parent.setAttribute('position', ref);
				}
				return () => {
					// cleanup function called when ref changes or the component unmounts
					// https://threlte.xyz/docs/reference/core/t#attach
				};
			}}
		/>
	</T.BufferGeometry>
	<T.PointsMaterial size={0.1} {color} />
</T.Points>
