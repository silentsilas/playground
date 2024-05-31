import { writable } from 'svelte/store';
import type { SearchResult } from './utils/search';

const initArray: SearchResult[] = [];
export const searchResults = writable(initArray);
