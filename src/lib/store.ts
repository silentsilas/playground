import { writable } from 'svelte/store';
import type { SearchResult } from './utils/search';
import { goto } from '$app/navigation';

function createSearchStore() {
	const { subscribe, set } = writable<SearchResult[]>([]);

	return {
		subscribe,
		set: (results: SearchResult[]) => {
			set(results);
			if (results.length > 0) {
				goto('/search');
			}
		},
		clear: () => {
			set([]);
		}
	};
}

export const searchResults = createSearchStore();
