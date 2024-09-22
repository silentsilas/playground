import { getModel } from '$lib/utils/search';
import { building } from '$app/environment';
import type { Handle } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';

if (!building) {
	getModel().catch((error) => {
		console.error('Failed to load the TensorFlow model at startup:', error);
	});

	console.log('Model loaded successfully!');
}

export const handle: Handle = async ({ event, resolve }) => {
	// Check for existing session
	let sessionId = event.cookies.get('sessionId');

	// If no session exists, create a new one
	if (!sessionId) {
		sessionId = uuidv4();
		event.cookies.set('sessionId', sessionId, { path: '/', httpOnly: true, sameSite: 'strict', maxAge: 60 * 60 * 24 * 7 }); // 1 week
	}
	// Add sessionId to locals for easy access in routes
	event.locals = { ...event.locals, sessionId };

	return resolve(event);
};
