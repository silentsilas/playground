<script lang="ts">
	import Editor from '$lib/components/pad/Editor.svelte';

	const INITIAL_HTML_CONTENT = `<h1>Simple editor</h1><p>What's written here will be saved to your local storage. Highlight a word to see suggested rhymes.</p>`;
</script>

<svelte:head>
	<title>silentsilas - Pad</title>
	<meta name="description" content="A text editor with rhyming and word suggestions" />
</svelte:head>

<Editor initialContent={INITIAL_HTML_CONTENT} />
