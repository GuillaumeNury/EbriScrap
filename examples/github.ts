import { IEbriScrapConfig, parse } from '../index';

import fetch from 'node-fetch';

const config = {
	repository: {
		type: 'field',
		selector: '.pagehead .public',
		extract: 'text',
		format: 'one-line-string',
	},
	topics: {
		type: 'array',
		containerSelector: '.list-topics-container',
		itemSelector: 'a',
		children: {
			type: 'group',
			containerSelector: 'a',
			children: {
				name: {
					type: 'field',
					selector: 'a',
					extract: 'text',
					format: 'one-line-string',
				},
				link: {
					type: 'field',
					selector: 'a',
					extract: 'prop',
					propertyName: 'href',
				},
			},
		},
	},
	contributors: {
		type: 'field',
		selector: '.numbers-summary li:nth-child(4) span',
		extract: 'text',
		format: 'number',
	},
} as IEbriScrapConfig;

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
