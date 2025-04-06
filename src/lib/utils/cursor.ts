import type { TipexEditor } from '@friendofsvelte/tipex';

export function calculateCursorPosition(editor: TipexEditor | undefined) {
	const selection = window.getSelection();
	if (!selection?.rangeCount) return { x: 0, y: 0 };

	const range = selection.getRangeAt(0);
	const rect = range.getBoundingClientRect();
	const editorRect = editor?.view.dom.getBoundingClientRect() || { left: 0, top: 0 };

	// Check if on mobile
	const isMobile = window.innerWidth < 768;

	if (isMobile) {
		// For mobile, position suggestions at the bottom center of the screen
		// to avoid issues with virtual keyboard and to make them more accessible
		return {
			x: window.innerWidth / 2,
			y: Math.min(rect.bottom - editorRect.top + window.scrollY, window.innerHeight - 250)
		};
	}

	// Desktop positioning
	const x = Math.min(
		Math.max(rect.left - editorRect.left + window.scrollX, 100),
		window.innerWidth - 300
	);
	const y = rect.bottom - editorRect.top + window.scrollY + 10;

	return { x, y };
}
