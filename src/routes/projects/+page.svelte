<script lang="ts">
	import MenuItem from '$lib/components/scenes/app/MenuItem.svelte';
	import App from '$lib/components/scenes/app/App.svelte';
	import CanvasContainer from '$lib/components/scenes/app/CanvasContainer.svelte';
	import '../../app.css';

	import type { SearchResult } from '$lib/utils/search';
	import { searchResults } from '$lib/store';
	import Overlay from '$lib/components/scenes/app/Overlay.svelte';

	let results: SearchResult[] = [];
	let open = false;
	let selected = -1;

	searchResults.subscribe((value: SearchResult[]) => {
		results = value ? value : [];
	});

	type Project = {
		title: string;
		path: string;
		source: string;
		position: [number, number, number];
		description: string;
	};

	const projects: Project[] = [
		{
			title: 'Visions',
			path: 'https://visions.silentsilas.com',
			source: 'https://github.com/silentsilas/visions',
			position: [0, -4, 0],
			description:
				'An experiment with vector math for a rudimentary simulation of gravity. You can change the strength of the gravity in the Controls menu.'
		},
		{
			title: 'Animation Editor',
			path: '/editor',
			source:
				'https://git.silentsilas.com/silentsilas/playground/src/branch/main/src/routes/editor',
			position: [4, 0, -4],
			description:
				'A 3D animation editor via Theatre.js. This is used internally by me for other ThreeJS projects.'
		},
		{
			title: 'Headbang',
			path: 'https://smash.silentsilas.com',
			source: '#',
			position: [-4, 0, 4],
			description:
				"Bash in the heads of my ol' coworkers to the sounds of Rezz. I don't own the copyright to the music. And I also lost the source code. Epilepsy warning."
		},
		{
			title: 'Intended Link',
			path: 'https://intended.link',
			source: 'https://git.silentsilas.com/silentsilas/Entendu',
			position: [-4, 4, -4],
			description:
				'Similar to Sure Dog, this is a service to securely share information to others without needing an account. Instead, you say which social media account can access the link, and only that account will be able to view what the link contains using the magic of OAuth.'
		},
		{
			title: 'Who Am I?',
			path: 'https://viz.silentsilas.com/',
			source: 'https://git.silentsilas.com/silentsilas/audio-visualizer',
			position: [4, 4, 4],
			description:
				'An audiovisual exhibit of a poem by the same name. I recorded myself reciting the poem, and parsed a subtitle track to sync it with the audio.'
		},
		{
			title: 'Sure Dog',
			path: 'https://sure.dog/',
			source: 'https://git.silentsilas.com/silentsilas/sure',
			position: [0, 8, 0],
			description:
				'Similar to Intended Link, this is a service to securely share information to others without needing an account. Instead, you send a link to whom you wish to request information from, and they can send back a link with the information you requested that only your device can view thanks to the magic of Public Key Cryptography.'
		}
	];

	const handleMenuClick = (index: number) => {
		open = true;
		selected = index;
	};
	const isExternal = (url: string) => {
		return url.startsWith('http');
	};
</script>

{#if results.length <= 0}
	<CanvasContainer>
		<App>
			{#each projects as project, i}
				<MenuItem
					clickHandler={() => handleMenuClick(i)}
					position={project.position}
					active={i === selected}>{project.title}</MenuItem
				>
			{/each}
		</App>
	</CanvasContainer>
	{#if open}
		<Overlay>
			<button
				type="button"
				class="close-button p-4 m-4 btn btn-outline"
				on:click={() => {
					open = false;
					selected = -1;
				}}>X</button
			>
			<div class="p-6">
				<h2 class="mt-0">{projects[selected].title}</h2>
				<p>{projects[selected].description}</p>
				<div class="flex justify-evenly">
					{#if projects[selected].source === '#'}
						<button class="btn btn-primary sm:btn-sm md:btn-wide" disabled
							>Source Code Unavailable</button
						>
					{:else}
						<a
							href={projects[selected].source}
							target={isExternal(projects[selected].source) ? '_blank' : ''}
						>
							<button class="btn btn-primary sm:btn-sm md:btn-wide">Source Code</button>
						</a>
					{/if}

					<a
						href={projects[selected].path}
						target={isExternal(projects[selected].path) ? '_blank' : ''}
					>
						<button class="btn btn-primary sm:btn-sm md:btn-wide">Visit</button></a
					>
				</div>
			</div>
		</Overlay>
	{/if}
{/if}

<style>
	:global(body) {
		margin: 0;
	}

	.canvas {
		width: 100%;
		height: 100%;
		background: rgb(0, 36, 6);
		background: linear-gradient(180deg, rgba(0, 36, 6, 1) 0%, rgba(0, 0, 0, 1) 100%);
		position: absolute;
		justify-content: center;
		align-items: center;
	}

	.close-button {
		position: absolute;
		top: 0;
		right: 0;
	}
</style>
