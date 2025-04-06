/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Extracts the last word (only alphabetical characters) from a given text
 */
function extractLastWord(text: string): string {
	const matches = text.match(/[a-zA-Z]+\s*$/);
	return matches ? matches[0].trim() : '';
}

/**
 * Extracts the current word at cursor position from the document
 * Improved to handle different selection scenarios on mobile
 */
export function extractCurrentWord(doc: any, pos: number): string {
	// For mobile, we might need to look further back to find words
	// since touch selection can be less precise
	const lookbackDistance = window.innerWidth < 768 ? 200 : 100;
	const textBefore = doc.textBetween(Math.max(0, pos - lookbackDistance), pos);

	// First try with standard pattern
	const word = extractLastWord(textBefore);

	// If standard pattern fails, try a more lenient pattern for mobile
	if (!word && window.innerWidth < 768) {
		const lenientMatches = textBefore.match(/[a-zA-Z]+(?:\s+[a-zA-Z]+)*\s*$/);
		return lenientMatches ? lenientMatches[0].trim().split(/\s+/).pop() || '' : '';
	}

	return word;
}

/**
 * Extracts the last word from a selected text range
 * Improved to handle imprecise selections on mobile
 */
export function extractSelectedWord(doc: any, from: number, to: number): string {
	// On mobile, selections might include extra spaces
	const isMobile = window.innerWidth < 768;
	const selectedText = doc.textBetween(from, to, ' ');

	if (isMobile && selectedText.trim()) {
		// For mobile, take the largest word in the selection
		const words = selectedText.trim().split(/\s+/);
		if (words.length > 0) {
			// Find the longest word in selection (mobile users often select multiple words)
			return words.reduce((longest: string, current: string) =>
				current.length > longest.length ? current : longest, '');
		}
	}

	return extractLastWord(selectedText);
}
