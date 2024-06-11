<script lang="ts">
	import { HTML } from '@threlte/extras';
	import { Attractor } from '@threlte/rapier';

	export let position: [number, number, number] = [0, 0, 0];
	export let range: number = 100;
	export let clickHandler: (() => void) | undefined = undefined;
	export let active: boolean = false;

	let isHovering = false;
	let isPointerDown = false;

	const onClick = () => {
		if (clickHandler) {
			clickHandler();
		}
	};
</script>

<HTML position.x={position[0]} position.y={position[1]} position.z={position[2]}>
	<button
		type="button"
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
		class="bg-base-300 border border-primary px-3 py-3 text-primary md:opacity-50 hover:opacity-90 active:opacity-100"
		style="transform: translate(-50%, 50%); display: block; width: 170px;"
	>
		<slot />
	</button>
</HTML>

<Attractor
	position.x={position[0]}
	position.y={position[1]}
	position.z={position[2]}
	{range}
	strength={isHovering || isPointerDown || active ? 1 : 0}
	gravityType={'static'}
/>
