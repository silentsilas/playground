import { getModel } from '$lib/utils/search';
import { building } from '$app/environment';

if (!building) {
	getModel().catch((error) => {
		console.error('Failed to load the TensorFlow model at startup:', error);
	});

	console.log('Model loaded successfully!');
}
