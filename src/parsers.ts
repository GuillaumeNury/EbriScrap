import * as cheerio from 'cheerio';
import { parseConfig } from './config-parsers';
import { extract } from './extractors';
import { format } from './formators';
import {
	ArrayConfig,
	ConfigTypes,
	EbriScrapConfig,
	FieldConfig,
	GroupConfig,
	IArrayConfig,
	IArrayDebugInfo,
	IDebugInfo,
	IFieldDebugInfo,
	IGroupConfig,
	IGroupDebugInfo,
} from './types';

export function parse<T = any>(
	html: string,
	config: EbriScrapConfig,
): T {
	return parseWithDebugInfo<T>(html, config).parsed;
}

export function parseWithDebugInfo<T = any>(
	html: string,
	config: EbriScrapConfig,
): IDebugInfo<T> {
	const parsedConfig = parseConfig(config);
	const $ = cheerio.load(html);

	const debugInfo = {};
	const parsed = genericParse($, parsedConfig, debugInfo);

	return { debugInfo, parsed };
}

function genericParse(
	$: CheerioStatic,
	config: ConfigTypes,
	debugInfo: any,
): any {
	if (config instanceof FieldConfig) {
		return parseField($, config, debugInfo);
	}
	if (config instanceof GroupConfig) {
		return parseGroup($, config, debugInfo);
	}
	if (config instanceof ArrayConfig) {
		return parseArray($, config, debugInfo);
	}
}

function parseField(
	$: CheerioStatic,
	config: FieldConfig,
	debugInfo: IFieldDebugInfo,
): any {
	const rawValue = extract($, config);
	const parsed = format(rawValue, config.formators);

	debugInfo.raw = $.html();
	debugInfo.parsed = parsed;

	return parsed;
}

function parseArray(
	$: CheerioStatic,
	config: IArrayConfig,
	debugInfo: IArrayDebugInfo,
): any {
	const result = [] as any[];

	debugInfo.raw = $.html();
	debugInfo.parsed = [];

	$(config.containerSelector)
		.find(config.itemSelector)
		.map((_idx, $elem) => {
			const innerDebugInfo = {};

			const item = genericParse(
				cheerio.load($elem),
				config.data,
				innerDebugInfo,
			);

			debugInfo.parsed.push(innerDebugInfo);
			result.push(item);
		});

	return result;
}

function parseGroup(
	$: CheerioStatic,
	config: IGroupConfig,
	debugInfo: IGroupDebugInfo,
): any {
	const keys = getKeys(config);

	return keys.reduce(
		(acc, key) => {
			const child = config[key];

			debugInfo[key] = {};
			acc[key] = genericParse($, child, debugInfo[key]);

			return acc;
		},
		{} as any,
	);
}

function getKeys(object: Object): string[] {
	return (!!object && Object.keys(object)) || [];
}
