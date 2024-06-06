<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { searchResults } from '$lib/store';
	import type { SearchResult } from '$lib/utils/search';

	let results: SearchResult[] = [];

	searchResults.subscribe((value: SearchResult[]) => {
		results = value ? value : [];
	});

	type Greeting = {
		greeting: string;
		language: string;
		romanisation?: string;
	};
	const GREETINGS: Greeting[] = [
		{ greeting: '你好', language: 'Mandarin', romanisation: 'Nǐ hǎo' },
		{ greeting: 'नमस्ते', language: 'Hindi', romanisation: 'Namaste' },
		{ greeting: 'Hola', language: 'Spanish' },
		{ greeting: 'হ্যালো', language: 'Bengali', romanisation: 'Hyālō' },
		{ greeting: 'ہیلو', language: 'Urdu', romanisation: 'Hello' },
		{ greeting: 'Oi', language: 'Portuguese' },
		{ greeting: 'Здравствуйте', language: 'Russian', romanisation: 'Zdravstvuyte' },
		{ greeting: 'こんにちは', language: 'Japanese', romanisation: "Kon'nichiwa" },
		{ greeting: 'Merhaba', language: 'Turkish' },
		{ greeting: '안녕하세요', language: 'Korean', romanisation: 'Annyeonghaseyo' },
		{ greeting: 'Hallo', language: 'German' },
		{ greeting: 'สวัสดี', language: 'Thai', romanisation: 'S̄wạs̄dī' },
		{ greeting: 'مرحبا', language: 'Arabic', romanisation: 'Marhaba' },
		{ greeting: 'היי', language: 'Hebrew', romanisation: 'Hi' },
		{ greeting: 'Helo', language: 'Welsh' },
		{ greeting: 'Pozdrav', language: 'Croatian' },
		{ greeting: 'Hej', language: 'Swedish' },
		{ greeting: 'Hyālō', language: 'Bengali' },
		{ greeting: 'Salut', language: 'French' },
		{ greeting: 'Ciao', language: 'Italian' }
	];

	let greetings = [...GREETINGS];

	let currentGreeting: Greeting = { greeting: 'Hello', language: 'English' };
	let visible = false;

	onMount(() => {
		visible = true;
		searchResults.set([]);
		const interval = setInterval(getRandomGreeting, 3000);
		return () => clearInterval(interval);
	});

	async function getRandomGreeting() {
		visible = false;
		await new Promise((r) => setTimeout(r, 1000));

		if (greetings.length === 0) {
			greetings = [...GREETINGS];
		}

		const greetingIndex = Math.floor(Math.random() * greetings.length);
		const greeting = greetings[greetingIndex];
		greetings = greetings.filter((_, index) => index !== greetingIndex);
		currentGreeting = greeting;
		visible = true;

		return greeting;
	}
</script>

<svelte:head>
	<title>silentsilas - Home</title>
</svelte:head>

{#if results.length <= 0}
	<div class="mx-auto container flex flex-col flex-1 my-4">
		<div class="my-4 text-center" style="height: 60px">
			{#if visible && currentGreeting}
				<div transition:fade={{ duration: 1200 }}>
					<span class="font-bold text-primary">{currentGreeting.greeting}</span>
					{#if currentGreeting.romanisation}
						<span class="text-gray-500">( {currentGreeting.romanisation} )</span>
					{/if}
				</div>
				<p class="text-gray-300" transition:fade={{ delay: 400, duration: 400 }}>
					That's {currentGreeting.language} for hello!
				</p>
			{/if}
		</div>
		<div class="prose p-4" style="align-self: center">
			<p>
				The name's Silas. I write code for a living, and sometimes for fun. I use <a
					href="https://elixir-lang.org/"
					target="_blank"
					class="link-primary">Elixir</a
				>
				at my day job, and recently have been messing around with
				<a href="https://www.rust-lang.org/" target="_blank" class="link-primary">Rust</a>,
				<a href="https://kit.svelte.dev/" target="_blank" class="link-primary">Svelte</a>, and
				<a href="https://threejs.org/" target="_blank" class="link-primary">three.js</a>
			</p>
			<p>
				Here you can browse my shower <a href="/thoughts" class="link-primary">thoughts</a> and bad
				<a href="/poetry" class="link-primary">poetry</a>. Opinions are personally mine and not
				endorsed by my employer.
			</p>
			<p>
				I tend to start a lot of <a href="/projects" class="link-primary">projects</a>, but I'm
				trying to finish more. This will also host any weird web experiments that I think others
				might find interesting.
			</p>
			<p>
				I self-host a lot of <a href="/services" class="link-primary">services</a> I find useful. None
				of them run any analytics or log your activity, but the software/servers may be outdated, so
				use at your own risk.
			</p>
			<p class="text-center">Shalom.</p>
		</div>
	</div>
{/if}
