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
 */
export function extractCurrentWord(doc: any, pos: number): string {
	const textBefore = doc.textBetween(Math.max(0, pos - 100), pos);
	return extractLastWord(textBefore);
}

/**
 * Extracts the last word from a selected text range
 */
export function extractSelectedWord(doc: any, from: number, to: number): string {
	const selectedText = doc.textBetween(from, to, ' ');
	return extractLastWord(selectedText);
}
