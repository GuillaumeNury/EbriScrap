import * as cheerio from 'cheerio';

import {
	AbstractPageConfig,
	FieldConfig,
	IArrayConfig,
	IEbriScrapConfig,
	IGroupConfig,
} from './types';

export function parse(html: string, config: IEbriScrapConfig): any {
	const $ = cheerio.load(html);
	const keys = Object.keys(config) || [];

	return keys.reduce(
		(acc, key) => {
			const child = config[key];

			acc[key] = genericParse($, child);

			return acc;
		},
		{} as any,
	);
}

function genericParse($: CheerioStatic, config: AbstractPageConfig): any {
	switch (config.type) {
		case 'array':
			return parseArray($, config);
		case 'group':
			return parseGroup($, config);
		case 'field':
			return parseField($, config);
		default:
			throw new Error(
				'Invalid config type. Allowed values are: array, group, field',
			);
	}
}

function parseField($: CheerioStatic, config: FieldConfig): any {
	let rawValue: string;

	switch (config.extract) {
		case 'html':
			rawValue = $(config.selector).html() || '';
			break;
		case 'text':
			rawValue = $(config.selector).text() || '';
			break;
		case 'prop':
			rawValue = $(config.selector).attr(config.propertyName);
			break;
		case 'css':
			rawValue = $(config.selector).css(config.propertyName);
			break;
		default:
			throw new Error(
				'Invalid extract property in configuration. Supported values are: html, text and prop',
			);
	}

	switch (config.format || 'string') {
		case 'string':
			return rawValue;
		case 'one-line-string':
			return rawValue.replace(/\n/g, '').trim();
		case 'number':
			const sanitized = rawValue.replace(/[^\.\d]/g, '');

			return parseFloat(sanitized);
		case 'date':
			throw new Error('Date Not implement');
		default:
			throw new Error(
				'Invalid format config. Allowed values are string, number and date',
			);
	}
}

function parseArray($: CheerioStatic, config: IArrayConfig): string[] {
	const result = [] as string[];

	$(config.containerSelector)
		.find(config.itemSelector)
		.map((_idx, $elem) => {
			const item = genericParse(cheerio.load($elem), config.field);

			result.push(item);
		});

	return result;
}

function parseGroup($: CheerioStatic, config: IGroupConfig): any {
	const container$ = $(config.containerSelector);

	const keys = Object.keys(config.children) || [];

	return keys.reduce(
		(acc, key) => {
			const child = config.children[key];

			const child$ = container$[0];

			acc[key] = genericParse(cheerio.load(child$), child);

			return acc;
		},
		{} as any,
	);
}
