/* eslint-disable @typescript-eslint/no-explicit-any */
export function createDebounce() {
	let timer: NodeJS.Timeout | null = null;

	return function debounce<T extends (...args: any[]) => any>(
		fn: T,
		delay: number
	): (...args: Parameters<T>) => void {
		return (...args: Parameters<T>) => {
			if (timer) clearTimeout(timer);
			timer = setTimeout(() => fn(...args), delay);
		};
	};
}
