<script lang="ts">
	import type { SearchResult } from '$lib/utils/search';
	import { searchResults } from '$lib/store';

	let searchQuery = '';

	async function handleSearch() {
		// const section = window.location.pathname.split('/')[1];
		const response = await fetch(`/api/poetry/search?q=${encodeURIComponent(searchQuery)}`);
		if (response.ok) {
			const data: SearchResult[] = await response.json();
			searchResults.set(data);
		} else {
			console.error('Failed to fetch search results');
			searchResults.set([]);
		}
	}
</script>

<div class="flex flex-col h-screen">
	<div class="navbar bg-base-300 sticky top-0 z-50 border-b border-primary">
		<div class="flex-1 pr-2">
			<div class="dropdown">
				<div tabindex="-1" class="btn btn-ghost text-primary lg:hidden">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h8m-8 6h16"
						/>
					</svg>
				</div>
				<ul
					tabindex="-1"
					class="menu menu-lg dropdown-content mt-3 z-10 p-2 shadow bg-base-300 rounded-box w-52"
				>
					<li><a href="/thoughts" class="link-primary">Thoughts</a></li>
					<li><a href="/poetry" class="link-primary">Poetry</a></li>
					<li><a href="/projects" class="link-primary">Projects</a></li>
					<li><a href="/services" class="link-primary">Services</a></li>
				</ul>
			</div>
			<a class="link-primary text-xl" href="/">silentsilas</a>
		</div>
		<div class="lg:hidden flex-none gap-2">
			<div class="form-control">
				<input
					type="text"
					placeholder="Search"
					class="input w-24 md:w-auto"
					bind:value={searchQuery}
					on:input={handleSearch}
				/>
			</div>
		</div>
		<div class="navbar-end hidden lg:flex">
			<div class="form-control">
				<input
					type="text"
					placeholder="Search"
					class="input md:w-auto"
					bind:value={searchQuery}
					on:input={handleSearch}
				/>
			</div>
			<ul class="menu menu-horizontal px-1">
				<li><a href="/thoughts" class="link-primary">Thoughts</a></li>
				<li><a href="/poetry" class="link-primary">Poetry</a></li>
				<li><a href="/projects" class="link-primary">Projects</a></li>
				<li><a href="/services" class="link-primary">Services</a></li>
			</ul>
		</div>
	</div>

	<slot />

	<slot name="footer" />
</div>
