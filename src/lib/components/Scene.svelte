<script lang="ts">
  import { T } from '@threlte/core'
  import { ContactShadows, Float, Grid, OrbitControls } from '@threlte/extras'
	import { Attractor, RigidBody } from '@threlte/rapier';
	import RandomMeshes from './RandomMeshes.svelte';

	const size = 100
  const count = 500

	const positions = new Float32Array(count * 3)

	// randomly distribute points in a cube
	for (let i = 0; i < count; i++) {
		positions[i * 3 + 0] = (Math.random() - 0.5) * size
		positions[i * 3 + 1] = (Math.random() - 0.5) * size
		positions[i * 3 + 2] = (Math.random() - 0.5) * size
	}
</script>

<T.PerspectiveCamera
	position.y={15}
  position.z={25}
	makeDefault
  fov={70}
  far={10000}
>
  <OrbitControls
    enableZoom={false}
    enablePan={false}
    enableRotate={false}
    enableDamping
    target.y={0}
		autoRotate
  />
</T.PerspectiveCamera>

<T.DirectionalLight
  intensity={0.8}
  position.x={5}
  position.y={10}
/>


<T.Points>
  <T.BufferGeometry>
    <T.BufferAttribute
      args={[positions, 3]}
      attach={(parent, self) => {
        parent.setAttribute('position', self)
        return () => {
          // cleanup function called when ref changes or the component unmounts
          // https://threlte.xyz/docs/reference/core/t#attach
        }
      }}
    />
  </T.BufferGeometry>
  <T.PointsMaterial size={0.1} />
</T.Points>

<RandomMeshes
	position={[0, 0, 0]}
  range={10}
/>

