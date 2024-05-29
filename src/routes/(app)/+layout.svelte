<script>
	import '../../app.css';
</script>

<div class="flex flex-col h-screen">
	<div class="navbar bg-base-300 sticky top-0 z-50">
		<div class="navbar-start">
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
					class="menu menu-sm dropdown-content mt-3 z-10 p-2 shadow bg-base-300 rounded-box w-52"
				>
					<li><a href="/thoughts">Thoughts</a></li>
					<li><a href="/poetry">Poetry</a></li>
					<li><a href="/projects">Projects</a></li>
					<li><a href="/experiments">Experiments</a></li>
					<li><a href="/services">Services</a></li>
				</ul>
			</div>
			<a class="link-primary text-xl" href="/">silentsilas</a>
		</div>
		<div class="navbar-end hidden lg:flex">
			<ul class="menu menu-horizontal px-1">
				<li><a href="/thoughts">Thoughts</a></li>
				<li><a href="/poetry">Poetry</a></li>
				<li><a href="/projects">Projects</a></li>
				<li><a href="/experiments">Experiments</a></li>
				<li><a href="/services">Services</a></li>
			</ul>
		</div>
	</div>

	<div class="flex flex-col items-center flex-1 overflow-auto">
		<slot />
	</div>
</div>
