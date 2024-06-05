<div class="overlay container prose bg-base-300/80 border border-primary" id="overlay">
	<slot />
</div>

<style>
	.overlay {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
	}
</style>
