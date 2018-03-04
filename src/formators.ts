import * as cheerio from 'cheerio';

import { FieldConfig, FormatTypes, IPipe } from './types';
import { enumAsString, urlJoin } from './utils';

import { reduce } from 'lodash';

const formattorsMap = {
	[FormatTypes.STRING]: formatString,
	[FormatTypes.HTML_TO_TEXT]: formatHtmlToText,
	[FormatTypes.ONE_LINE_STRING]: formatOneLineString,
	[FormatTypes.NUMBER]: formatNumber,
	[FormatTypes.URL]: formatUrl,
	[FormatTypes.REGEX]: formatRegex,
} as { [format: string]: FormatFunc };

type FormatFunc = (
	rawValue: string,
	...args: string[]
) => string | number;

export function format(rawValue: any, formators: IPipe[] = []): any {
	const formattedValue = reduce(
		formators,
		(acc, formatorConfig) => {
			const formator = formattorsMap[formatorConfig.name];

			if (!formator) {
				throw new Error(
					`Unknown formattor "${
						formatorConfig.name
					}". Allowed formators are ${enumAsString(FormatTypes)}`,
				);
			}

			return formator(acc, ...formatorConfig.args);
		},
		rawValue,
	);

	return formattedValue;
}

function formatHtmlToText(rawValue: string): string {
	const sanitizedHtml = rawValue
		.trim()
		.replace(/<br>/g, '\n')
		.replace(/<p>(.*?)<\/p>/g, (_, match) => `\n${match}\n`)
		.replace(/<div>(.*?)<\/div>/g, (_, match) => `\n${match}\n`);

	return cheerio
		.load(sanitizedHtml)
		.root()
		.text();
}

function formatOneLineString(rawValue: string): string {
	return rawValue.replace(/\s\s+/g, ' ').trim();
}

function formatNumber(rawValue: string): number {
	const sanitized = rawValue.replace(/[^\.\d]/g, '');

	return parseFloat(sanitized);
}

function formatString(rawValue: string): string {
	return rawValue;
}

function formatUrl(rawValue: string, baseUrl: string): string {
	return baseUrl ? urlJoin(baseUrl, rawValue) : rawValue;
}

function formatRegex(
	rawValue: string,
	strRegex: string,
	output: string,
): string {
	if (!strRegex) {
		throw new Error(
			'Cannot use regex formattor. Missing first parameter. Use selector | regex:(.*):$1',
		);
	}
	if (!output) {
		throw new Error(
			'Cannot use regex formattor. Missing second parameter. Use selector | regex:(.*):$1',
		);
	}

	const regex = new RegExp(strRegex);
	const matches = (rawValue || '').match(regex);

	return output.replace(
		/\$([0-9]+)/g,
		(match, matchGroupIndex) =>
			matches ? matches[matchGroupIndex] : match,
	);
}
