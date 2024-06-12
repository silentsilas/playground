<script lang="ts">
	import { T } from '@threlte/core';
	export let size = 100;
	export let count = 500;
	export let color = localStorage.getItem('theme') === 'forest' ? 'white' : '#a991f7';

	const positions = new Float32Array(count * 3);

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
			attach={(parent, self) => {
				parent.setAttribute('position', self);
				return () => {
					// cleanup function called when ref changes or the component unmounts
					// https://threlte.xyz/docs/reference/core/t#attach
				};
			}}
		/>
	</T.BufferGeometry>
	<T.PointsMaterial size={0.1} {color} />
</T.Points>
