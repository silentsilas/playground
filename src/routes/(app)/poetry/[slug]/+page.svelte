<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	const { title, date: _date, Content, categories: _ } = data;
</script>

<div class="container mx-auto flex flex-col items-center prose px-4">
	<h1 class="py-6">{title}</h1>
	<Content />
	<a href="/poetry" class="link py-10">Back to Poetry</a>
</div>
