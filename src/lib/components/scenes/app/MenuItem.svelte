<script lang="ts">
	import { HTML } from '@threlte/extras';
	import { Attractor } from '@threlte/rapier';

	interface Props {
		position?: [number, number, number];
		range?: number;
		clickHandler?: (() => void) | undefined;
		active?: boolean;
		children?: import('svelte').Snippet;
	}

	let {
		position = [0, 0, 0],
		range = 100,
		clickHandler = undefined,
		active = false,
		children
	}: Props = $props();

	let isHovering = $state(false);
	let isPointerDown = $state(false);

	const onClick = () => {
		if (clickHandler) {
			clickHandler();
		}
	};
</script>

<HTML position.x={position[0]} position.y={position[1]} position.z={position[2]}>
	<button
		type="button"
		onpointerenter={() => (isHovering = true)}
		onpointerleave={() => {
			isPointerDown = false;
			isHovering = false;
		}}
		onpointerdown={() => (isPointerDown = true)}
		onpointerup={() => (isPointerDown = false)}
		onpointercancel={() => {
			isPointerDown = false;
			isHovering = false;
		}}
		onclick={onClick}
		class="bg-base-300 border border-primary px-3 py-3 text-primary md:opacity-50 hover:opacity-90 active:opacity-100"
		style="transform: translate(-50%, 50%); display: block; width: 170px;"
	>
		{@render children?.()}
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
