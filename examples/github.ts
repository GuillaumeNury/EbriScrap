import fetch from 'node-fetch';
import { parse, TypedEbriScrapConfig } from '../index';

interface IGithubScrapResult {
	repository: string;
	topics: {
		name: string;
		link: string;
	}[];
	contributors: number;
}

export const config: TypedEbriScrapConfig<IGithubScrapResult> = {
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

const url = 'https://github.com/Microsoft/TypeScript';

fetch(url)
	.then(d => d.text())
	.then(d => parse(d, config))
	.then(d => console.log('Result', d));

/**
 * OUTPUT
 *
 * Result { repository: 'Microsoft/TypeScript',
 *  topics:
 *   [ { name: 'typescript', link: '/topics/typescript' },
 *     { name: 'javascript', link: '/topics/javascript' },
 *     { name: 'language', link: '/topics/language' },
 *     { name: 'typechecker', link: '/topics/typechecker' } ],
 *  contributors: 259 }
 *
 */
