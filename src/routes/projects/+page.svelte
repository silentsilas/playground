<script lang="ts">
	import MenuItem from '$lib/components/scenes/app/MenuItem.svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	const xMin = -2.5,
		xMax = 2.5;
	const yMin = -7.5,
		yMax = 7.5;
	const zMin = -2.5,
		zMax = 2.5;

	const calculatePositions = (numPosts: number): Array<[number, number, number]> => {
		const positions: Array<[number, number, number]> = [];
		const numRows = Math.ceil(Math.sqrt(numPosts));
		const numCols = Math.ceil(numPosts / numRows);

		for (let i = 0; i < numPosts; i++) {
			const row = Math.floor(i / numCols);
			const col = i % numCols;

			const x = xMin + (xMax - xMin) * (col / (numCols - 1));
			const y = yMin + (yMax - yMin) * (row / (numRows - 1));
			const z = zMin;

			positions.push([x, y, z]);
		}

		return positions;
	};

	const positions = calculatePositions(data.posts.length);
</script>

{#each data.posts as post, i}
	<MenuItem position={positions[i]} htmlContent={post.meta.title} href={post.path} />
{/each}
