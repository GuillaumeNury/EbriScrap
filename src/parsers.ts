import * as cheerio from 'cheerio';

import {
	ArrayConfig,
	ConfigTypes,
	FieldConfig,
	GroupConfig,
	IArrayConfig,
	IGroupConfig,
} from './types';

import { EbriScrapConfig } from './types';
import { extract } from './extractors';
import { format } from './formators';
import { parseConfig } from './config-parsers';

export function parse<T = any>(
	html: string,
	config: EbriScrapConfig,
): T {
	const parsedConfig = parseConfig(config);
	const $ = cheerio.load(html);

	return genericParse($, parsedConfig);
}

function genericParse($: CheerioStatic, config: ConfigTypes): any {
	if (config instanceof FieldConfig) {
		return parseField($, config);
	}
	if (config instanceof GroupConfig) {
		return parseGroup($, config);
	}
	if (config instanceof ArrayConfig) {
		return parseArray($, config);
	}
}

function parseField($: CheerioStatic, config: FieldConfig): any {
	const rawValue = extract($, config);
	const formatted = format(rawValue, config.formators);

	return formatted;
}

function parseArray($: CheerioStatic, config: IArrayConfig): any {
	const result = [] as any[];

	$(config.containerSelector)
		.find(config.itemSelector)
		.map((_idx, $elem) => {
			const item = genericParse(cheerio.load($elem), config.data);

			result.push(item);
		});

	return result;
}

function parseGroup($: CheerioStatic, config: IGroupConfig): any {
	const keys = getKeys(config);

	return keys.reduce(
		(acc, key) => {
			const child = config[key];

			acc[key] = genericParse($, child);

			return acc;
		},
		{} as any,
	);
}

function getKeys(object: Object): string[] {
	return (!!object && Object.keys(object)) || [];
}
