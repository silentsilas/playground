<script lang="ts">
	import { Tipex, type TipexEditor } from '@friendofsvelte/tipex';
	import '@friendofsvelte/tipex/styles/Tipex.css';
	import '@friendofsvelte/tipex/styles/ProseMirror.css';
	import '@friendofsvelte/tipex/styles/Controls.css';
	import '@friendofsvelte/tipex/styles/EditLink.css';
	import '@friendofsvelte/tipex/styles/CodeBlock.css';
	const INITIAL_HTML_CONTENT = `<h1>Simple editor</h1><p>What's written here will be saved to your local storage, and won't be sent to the server.</p>`;
	let body = localStorage.getItem('tipex') || INITIAL_HTML_CONTENT;
	let editor: TipexEditor | undefined = $state();

	function handleUpdate() {
		const currentHtml = editor?.getHTML();
		localStorage.setItem('tipex', currentHtml || '');
	}
</script>

<svelte:head>
	<title>silentsilas - Pad</title>
</svelte:head>

<div class="container mx-auto my-8 dark">
	<Tipex {body} controls !focal class="h-[80vh]" bind:tipex={editor} onupdate={handleUpdate} />
</div>
