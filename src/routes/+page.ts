const models: Model[] = [
	{ title: 'Model 1' },
	{ title: 'Model 2' },
	{ title: 'Model 3' }
];

export type Model = { title: string}

export function load(): { models: Model[] } {
	return {
		models: models.map((model) => ({
			title: model.title
		}))
	};
}
