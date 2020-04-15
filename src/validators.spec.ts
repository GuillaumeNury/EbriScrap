import { validateConfig } from './validators';

const wikipediaConfig = {
	title: '#firstHeading',
	frameworks: [
		{
			containerSelector: '.colonnes ul',
			itemSelector: 'li',
			data: 'li',
		},
	],
};

const githubConfig = {
	repository: '.pagehead .public | format:one-line-string',
	topics: [
		{
			containerSelector: '.list-topics-container',
			itemSelector: 'a',
			data: {
				name: 'a | format:one-line-string',
				link: 'a | extract:prop:href',
			},
		},
	],
	contributors:
		'.numbers-summary li:nth-child(4) span | format:number',
};

describe('Validators', () => {
	describe('Examples', () => {
		it('should work for wikipedia config', () => {
			expect(() => validateConfig(wikipediaConfig)).not.toThrowError();
		});
		it('should work for github config', () => {
			expect(() => validateConfig(githubConfig)).not.toThrowError();
		});
	});
});
