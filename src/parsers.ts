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

import { extract } from './extractors';
import { format } from './formators';

export function parse<T = any>(
	html: string,
	config: IEbriScrapConfig,
): T {
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

function genericParse(
	$: CheerioStatic,
	config: AbstractPageConfig,
): any {
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

function parseField(
	$: CheerioStatic,
	config: FieldConfig,
): ValidTypes {
	const rawValue = extract($, config);
	const formatted = format(rawValue, config.format as FormatTypes);

	return formatted;
}

function parseArray($: CheerioStatic, config: IArrayConfig): any {
	const result = [] as any[];

	$(config.containerSelector)
		.find(config.itemSelector)
		.map((_idx, $elem) => {
			const item = genericParse(cheerio.load($elem), config.children);

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
