import * as cheerio from 'cheerio';

import {
	AbstractPageConfig,
	ConfigTypes,
	ExtractTypes,
	FieldConfig,
	FormatTypes,
	IArrayConfig,
	IEbriScrapConfig,
	IGroupConfig,
	ValidTypes,
} from './types';

export function parse<T = any>(html: string, config: IEbriScrapConfig): T {
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
		case ConfigTypes.ARRAY:
			return parseArray($, config);
		case ConfigTypes.GROUP:
			return parseGroup($, config);
		case ConfigTypes.FIELD:
			return parseField($, config);
		default:
			throw new Error(
				'Invalid config type. Allowed values are: array, group, field',
			);
	}
}

function parseField($: CheerioStatic, config: FieldConfig): ValidTypes {
	let rawValue: string;

	switch (config.extract) {
		case ExtractTypes.HTML:
			rawValue = $(config.selector).html() || '';
			break;
		case ExtractTypes.TEXT:
			rawValue = $(config.selector).text() || '';
			break;
		case ExtractTypes.PROP:
			rawValue = $(config.selector).attr(config.propertyName);
			break;
		case ExtractTypes.CSS:
			rawValue = $(config.selector).css(config.propertyName);
			break;
		default:
			throw new Error(
				'Invalid extract property in configuration. Supported values are: html, text and prop',
			);
	}

	switch (config.format || FormatTypes.STRING) {
		case FormatTypes.STRING:
			return rawValue;
		case FormatTypes.ONE_LINE_STRING:
			return rawValue.replace(/\n/g, '').trim();
		case FormatTypes.NUMBER:
			const sanitized = rawValue.replace(/[^\.\d]/g, '');

			return parseFloat(sanitized);
		case FormatTypes.DATE:
			throw new Error('Date Not implement');
		default:
			throw new Error(
				'Invalid format config. Allowed values are string, number and date',
			);
	}
}

function parseArray($: CheerioStatic, config: IArrayConfig): any {
	const result = [] as any[];

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
