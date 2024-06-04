<div class="overlay container" id="overlay">
	<slot name="overlay" />
</div>

<style>
	.overlay {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: rgba(16, 56, 30, 0.9);
	}
</style>
