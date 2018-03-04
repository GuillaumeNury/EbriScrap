import {
	ArrayConfig,
	ConfigTypes,
	FieldConfig,
	GroupConfig,
	IArrayConfig,
	IFieldConfig,
	IGroupConfig,
	IPipe,
} from './types';
import {
	FormatTypes,
	IRawArrayConfig,
	IRawGroupConfig,
} from './types';
import {
	each,
	groupBy,
	includes,
	isArray,
	isObject,
	isString,
	reduce,
} from 'lodash';
import { enumAsString, stringEnumValues } from './utils';

import { ExtractTypes } from '..';

type RawConfigItem =
	| IRawSelectorConfig
	| IRawFormatorConfig
	| IRawExtractorConfig;

interface IRawSelectorConfig {
	type: 'selector';
	raw: string;
}

interface IRawFormatorConfig extends IPipe {
	type: 'format';
	raw: string;
}

interface IRawExtractorConfig extends IPipe {
	type: 'extract';
	raw: string;
}

export function parseConfig(rawConfig: any): ConfigTypes {
	if (isString(rawConfig)) {
		return parseFieldConfig(rawConfig);
	}
	if (isArray(rawConfig)) {
		return parseArrayConfig(rawConfig);
	}
	if (isObject(rawConfig)) {
		return parseGroupConfig(rawConfig);
	}

	throw new Error(
		`Cannot parse configuration: ${rawConfig}. It should be a string, an object or an array.`,
	);
}

function parseGroupConfig(rawConfig: IRawGroupConfig): IGroupConfig {
	const keys = Object.keys(rawConfig);

	return reduce(
		keys,
		(acc, key) => {
			acc[key] = parseConfig(rawConfig[key]);

			return acc;
		},
		new GroupConfig(),
	);
}

function parseArrayConfig(rawConfig: IRawArrayConfig): IArrayConfig {
	const rawConfigItem = rawConfig[0];

	if (!rawConfigItem) {
		throw new Error(
			'Cannot parse array configuration as it is empty.',
		);
	}

	const { data, containerSelector, itemSelector } = rawConfigItem;

	const errorMessage = (property: string) =>
		`Missing property '${property}' in array configuration: ${JSON.stringify(
			rawConfig,
		)}`;

	if (!data) {
		throw new Error(errorMessage('data'));
	}
	if (!containerSelector) {
		throw new Error(errorMessage('containerSelector'));
	}
	if (!itemSelector) {
		throw new Error(errorMessage('itemSelector'));
	}

	const config = new ArrayConfig();
	config.containerSelector = containerSelector;
	config.itemSelector = itemSelector;
	config.data = parseConfig(data);

	return config;
}

function parseFieldConfig(rawConfig: string): IFieldConfig {
	try {
		const parts = getRawConfigItems(rawConfig);

		const config = new FieldConfig();
		const groups = groupBy(parts, p => p.type);

		config.selector = getSelector(
			groups.selector as IRawSelectorConfig[],
		);
		config.extractor = getExtractor(
			groups.extract as IRawExtractorConfig[],
		);
		config.formators = getFormators(
			groups.format as IRawFormatorConfig[],
		);
		config.raw = rawConfig;

		return config;
	} catch (error) {
		throw new Error(`Error while parsing "${rawConfig}". ${error}`);
	}
}

function getRawConfigItems(rawConfig: string): RawConfigItem[] {
	return splitByPipe(rawConfig).map(part => {
		if (part.startsWith('format')) {
			return {
				type: 'format',
				raw: part,
				...formatPipe(part),
			} as IRawFormatorConfig;
		}
		if (part.startsWith('extract')) {
			return {
				type: 'extract',
				raw: part,
				...formatPipe(part),
			} as IRawExtractorConfig;
		}

		return { type: 'selector', raw: part } as IRawSelectorConfig;
	});
}

function getSelector(selectors: IRawSelectorConfig[] = []): string {
	if (!selectors.length) {
		throw new Error(`Missing selector.`);
	} else if (selectors.length > 1) {
		throw new Error(
			`Too many selectors (only one selector allowed). Received: ${selectors
				.map(s => s.raw)
				.join(', ')}.`,
		);
	}

	return selectors[0].raw;
}

function getExtractor(extractors: IRawExtractorConfig[] = []): IPipe {
	if (extractors && extractors.length > 1) {
		throw new Error(
			`Too many extractors (only one extractor allowed). Received: ${extractors
				.map(e => e.raw)
				.join(', ')}.`,
		);
	}

	if (extractors[0]) {
		const isValid = includes(
			stringEnumValues(ExtractTypes),
			extractors[0].name,
		);

		if (!isValid) {
			throw new Error(
				`Invalid extractor "${
					extractors[0].name
				}". Allowed extractors are ${enumAsString(ExtractTypes)}.`,
			);
		}
	}

	return extractors[0] || { name: 'text', args: [] };
}

function getFormators(formators: IRawFormatorConfig[] = []): IPipe[] {
	each(formators, f => {
		const isValid = includes(stringEnumValues(FormatTypes), f.name);

		if (!isValid) {
			throw new Error(
				`Invalid formator "${
					f.name
				}". Allowed formators are ${enumAsString(FormatTypes)}.`,
			);
		}
	});

	return formators;
}

function formatPipe(part: string): IPipe {
	const parts = splitByColonsIgnoringQuotes(part);
	const sanitized = parts.map(p =>
		removeLeadingAndEndingChar(p, "'", '"'),
	);

	const [, name, ...args] = sanitized;

	return { name, args };
}

function removeLeadingAndEndingChar(text: string, ...chars: string[]) {
	for (const char of chars) {
		if (text.startsWith(char) && text.endsWith(char)) {
			return text.slice(char.length, -char.length);
		}
	}

	return text;
}

function splitByColonsIgnoringQuotes(text: string): string[] {
	const regex = new RegExp(`('[^']*?')|("[^"]*?")|[^ *: *]+`, 'g');
	const matches = text.match(regex) || [];

	return matches.map(part => part.trim());
}

function splitByPipe(text: string): string[] {
	return text
		.replace(
			/ *\| */g,
			(match, index, str) => (str[index - 1] === '\\' ? match : '|'),
		)
		.match(/([^\\\][^\|]|\\\|)+/g)
		.map(p => p.replace(/\\\|/g, '|')); // Replace ignored pipe with pipe
}
