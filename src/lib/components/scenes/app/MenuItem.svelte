<script lang="ts">
	import { HTML } from '@threlte/extras';
	import { Attractor } from '@threlte/rapier';

	export let position: [number, number, number] = [0, 0, 0];
	export let range: number = 100;
	export let clickHandler: (() => void) | undefined = undefined;
	export let htmlContent: HTMLElement | string = 'Hello!';
	export let href: string = '/';

	let isHovering = false;
	let isPointerDown = false;

	const onClick = () => {
		console.log('clicked!');
		if (clickHandler) {
			clickHandler();
		}
	};

	const isExternal = href.startsWith('http');
</script>

<HTML position.x={position[0]} position.y={position[1]} position.z={position[2]}>
	<a
		{href}
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
		target={isExternal ? '_blank' : ''}
		on:click={onClick}
		class="bg-green-700 px-3 py-3 text-white opacity-50 hover:opacity-90 active:opacity-100"
		style="transform: translate(-50%, 50%); display: block;"
	>
		{htmlContent}
	</a>
</HTML>

<Attractor
	position.x={position[0]}
	position.y={position[1]}
	position.z={position[2]}
	{range}
	strength={isHovering ? 1 : 0}
	gravityType={'static'}
/>
