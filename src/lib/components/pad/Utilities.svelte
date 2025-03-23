<script lang="ts">
	import type { TipexEditor } from '@friendofsvelte/tipex';

	interface UtilitiesProps {
		editor: TipexEditor;
	}

	let { editor }: UtilitiesProps = $props();

	const copyHTML = () => {
		const html = editor?.getHTML();
		if (!html) return;
		navigator.clipboard.writeText(html);
		alert('HTML copied to clipboard!');
	};
</script>

<div class="tipex-utilities">
	<button
		class="tipex-edit-button tipex-button-extra tipex-button-rigid"
		type="button"
		aria-label="Copy HTML"
		onclick={copyHTML}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 448 512"
			width="0.7em"
			height="0.7em"
			class="h-4 w-4"
		>
			<path
				fill="currentColor"
				d="M208 0h124.1C344.8 0 357 5.1 366 14.1L433.9 82c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48M48 128h80v64H64v256h192v-32h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48"
			></path></svg
		></button
	>

	<button class="tipex-edit-button tipex-button-extra tipex-button-rigid" aria-label="Edit link"
		><svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 640 512"
			width="0.7em"
			height="0.7em"
			class="h-4 w-4"
			><path
				fill="currentColor"
				d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5l112.2-112.3c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0z"
			></path></svg
		>
	</button>
</div>
