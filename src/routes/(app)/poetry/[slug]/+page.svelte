<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	const { title, date: _date, Content, categories: _ } = data;
</script>

<div class="container mx-auto flex flex-col items-center py-10">
	<div class="prose">
		<h1 class="py-6">{title}</h1>
	</div>
	<div class="prose">
		<Content />
	</div>
	<a href="/poetry" class="link mt-10">Back to Poetry</a>
</div>
