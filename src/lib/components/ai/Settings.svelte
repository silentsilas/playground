<script lang="ts">
	import { DEFAULT_SYSTEM_TEMPLATE } from './ChatManager';

	let { onClose, onSave } = $props<{
		onClose: () => void;
		onSave: () => void;
	}>();

	// we don't want to keep the API key in state, only localstorage
	// svelte-ignore non_reactive_update
	let apiKey = localStorage.getItem('anthropicApiKey') || '';
	// svelte-ignore non_reactive_update
	let systemPrompt = localStorage.getItem('anthropicSystemPrompt') || DEFAULT_SYSTEM_TEMPLATE;
	let showKey = $state(false);

	function saveSettings() {
		localStorage.setItem('anthropicApiKey', apiKey);
		localStorage.setItem('anthropicSystemPrompt', systemPrompt);
		onSave();
	}
</script>

<div class="modal modal-open">
	<div class="modal-box flex-grow flex-col">
		<h3 class="font-bold text-lg mb-4">API Key Setup</h3>
		<p class="mb-4">
			This Chatbot uses Anthropic, and you must bring your own Anthropic API key to use it. Your key
			won't be sent to our server, and is saved in your local storage. All calls to Anthropic will
			be made directly from your browser.
		</p>
		<div class="form-control mb-8">
			<label class="label">
				<span class="label-text">Anthropic API Key</span>
			</label>
			<div class="input-group flex flex-row">
				<input
					type={showKey ? 'text' : 'password'}
					bind:value={apiKey}
					class="input input-bordered flex-1"
					placeholder="Enter your API key"
				/>
				<button class="btn btn-outline flex-2" onclick={() => (showKey = !showKey)}>
					{showKey ? 'Hide' : 'Show'}
				</button>
			</div>
			<textarea
				rows="10"
				bind:value={systemPrompt}
				class="textarea textarea-bordered mt-4"
				placeholder="Enter your system prompt"
			></textarea>
		</div>

		<div>
			<button class="btn btn-block btn-primary mb-2" onclick={saveSettings}>Save</button>
			<button class="btn btn-block btn-outline" onclick={onClose}>Back</button>
		</div>
	</div>
</div>
