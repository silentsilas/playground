import type { RequestEvent } from '@sveltejs/kit';
import { clearChatHistory } from '$lib/store';

export async function POST({ locals }: RequestEvent) {
	const sessionId = locals.sessionId;
	clearChatHistory(sessionId);
	return new Response(null, { status: 204 });
}
