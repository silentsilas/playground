<script lang="ts">
	import { T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import { Project, Sequence, type SequenceController, Sheet, SheetObject } from '@threlte/theatre';
	import { Vector3, type Mesh, type SpotLight } from 'three';
	import spinnersJson from '$lib/components/scenes/editor/SpinnersState.json';
	import { type IProjectConfig } from '@theatre/core';

	let sequence: SequenceController;

	let ball: Mesh;
	let spotlight: SpotLight;
	let lastBallPosition = new Vector3();
	let currentBallPosition = new Vector3();
	let config = spinnersJson as IProjectConfig;

	const ballMoved: any = (props: { position: { x: number; y: number; z: number } }) => {
		if (ball && spotlight) {
			const { x, y, z } = props.position;
			currentBallPosition.set(x, y, z);
			spotlight.lookAt(currentBallPosition);
			lastBallPosition.copy(currentBallPosition);
		}
	};
</script>

<Project name="Spinners" config={{ state: config }}>
	<Sheet name="Spinners Sheet">
		<T.PerspectiveCamera position={[0, 5, 10]} makeDefault>
			<OrbitControls target={[0, 1.5, 0]} />
		</T.PerspectiveCamera>

		<!-- create a T.SpotLight that looks at box-->
		<T.SpotLight position={[0, 5, 3]} intensity={10} bind:ref={spotlight}></T.SpotLight>

		<SheetObject key="Box" let:Transform let:Sync on:change={ballMoved}>
			<Transform>
				<T.Mesh position.y={0.5} bind:ref={ball}>
					<T.SphereGeometry args={[1, 8, 4]} />
					<T.MeshStandardMaterial color="#b00d03">
						<Sync color roughness metalness />
					</T.MeshStandardMaterial>
				</T.Mesh>
			</Transform>
		</SheetObject>
		<Sequence iterationCount={Infinity} direction="alternate" autoplay rate={1} bind:sequence />
	</Sheet>
</Project>
