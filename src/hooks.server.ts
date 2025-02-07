import { getModel } from '$lib/utils/search';
import { building } from '$app/environment';
import type { Handle, RequestEvent } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import { DARK_VISITORS_TOKEN } from '$env/static/private';

async function sendAnalytics(event: RequestEvent) {
	try {
		const headers = Object.fromEntries(event.request.headers.entries());

		void fetch('https://api.darkvisitors.com/visits', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${DARK_VISITORS_TOKEN}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				request_path: event.url.pathname,
				request_method: event.request.method,
				request_headers: headers
			})
		});
	} catch (e) {
		// Silent fail
	}
}

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
		event.cookies.set('sessionId', sessionId, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 7
		}); // 1 week
	}
	// Add sessionId to locals for easy access in routes
	event.locals = { ...event.locals, sessionId };

	if (import.meta.env.PROD) {
		sendAnalytics(event);
	}

	return resolve(event);
};
