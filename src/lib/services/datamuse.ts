export type Suggestion = {
	word: string;
	score: number;
};

export const datamuseApi = {
	async getSuggestions(word: string): Promise<Suggestion[]> {
		if (!word || word.length < 2) return [];
		return fetch(`https://api.datamuse.com/sug?s=${encodeURIComponent(word)}`)
			.then((res) => (res.ok ? res.json() : []))
			.catch((error) => {
				console.error('Error fetching suggestions:', error);
				return [];
			});
	},

	async getRhymes(word: string): Promise<Suggestion[]> {
		if (!word) return [];
		return fetch(`https://api.datamuse.com/words?rel_rhy=${encodeURIComponent(word)}`)
			.then((res) => (res.ok ? res.json() : []))
			.catch((error) => {
				console.error('Error fetching rhymes:', error);
				return [];
			});
	}
};
