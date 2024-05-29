<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

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

<div class="container mx-auto flex flex-col justify-center items-center flex-1">
	<div class="justify-center items-center text-center m-10">
		{#if visible && currentGreeting}
			<div
				transition:fade={{ duration: 1200 }}
			>
				<span class="font-bold">{currentGreeting.greeting}</span>
				{#if currentGreeting.romanisation}
					<span class="text-gray-500">( {currentGreeting.romanisation} )</span>
				{/if}
			</div>
			<p class="mt-2 text-gray-700" transition:fade={{ delay: 400, duration: 400 }}>
				That's {currentGreeting.language} for hello!
			</p>
		{/if}
	</div>
	<div class="text-center prose px-4">
		<p>
			The name's Silas. I write code for a living, and sometimes for fun. I use <a
				href="https://elixir-lang.org/"
				target="_blank">Elixir</a
			>
			at my day job, and recently have been messing around with
			<a href="https://elixir-lang.org/" target="_blank">Rust</a>,
			<a href="https://kit.svelte.dev/" target="_blank">Svelte</a>, and
			<a href="https://threejs.org/" target="_blank">three.js</a>
		</p>
		<p>
			Here you can browse my shower <a href="/thoughts" class="link">thoughts</a> and bad
			<a href="/poetry" class="link">poetry</a>. Opinions are personally mine and not endorsed by my
			employer.
		</p>
		<p>
			I tend to start a lot of <a href="/projects" class="link">projects</a>, but I'm trying to
			finish more. I also like to toy with weird web technologies and will host the
			<a href="/experiments" class="link">experiments</a> here.
		</p>
		<p>
			I self-host a lot of <a href="/services" class="link">services</a> I find useful. None of them
			run any analytics or log your activity, but the software/servers may be outdated, so use at your
			own risk.
		</p>
		<p>Shalom.</p>
	</div>
</div>
