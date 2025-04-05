import type { TipexEditor } from '@friendofsvelte/tipex';

export function calculateCursorPosition(editor: TipexEditor | undefined) {
	const selection = window.getSelection();
	if (!selection?.rangeCount) return { x: 0, y: 0 };

	const range = selection.getRangeAt(0);
	const rect = range.getBoundingClientRect();
	const editorRect = editor?.view.dom.getBoundingClientRect() || { left: 0, top: 0 };

	const x = Math.min(
		Math.max(rect.left - editorRect.left + window.scrollX, 100),
		window.innerWidth - 300
	);
	const y = rect.bottom - editorRect.top + window.scrollY + 10;

	return { x, y };
}
