import * as cheerio from 'cheerio';

import {
	FieldConfig,
	FormatConfigs,
	FormatTypes,
	IUrlFormatConfig,
} from './types';
import { isObject, isString } from 'lodash';

import { urlJoin } from './utils';

const formattorsMap = {
	[FormatTypes.STRING]: formatString,
	[FormatTypes.HTML_TO_TEXT]: formatHtmlToText,
	[FormatTypes.ONE_LINE_STRING]: formatOneLineString,
	[FormatTypes.NUMBER]: formatNumber,
	[FormatTypes.URL]: formatUrl,
} as { [format: string]: FormatFunc };

type FormatFunc = (
	rawValue: string,
	config?:
		| 'number'
		| 'one-line-string'
		| 'string'
		| 'html-to-text'
		| 'url'
		| FormatConfigs,
) => string | number;

export function format(rawValue: string, config: FieldConfig): any {
	const formatConfig = isString(config.format)
		? config.format
		: config.format ? config.format.type : FormatTypes.STRING;

	const formator = formattorsMap[formatConfig];

	if (!formator) {
		throw new Error(
			'Invalid format config. Allowed values are string, number and date',
		);
	}

	return formator(rawValue, config.format);
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

function formatUrl(
	rawValue: string,
	config: IUrlFormatConfig,
): string {
	return config && isObject(config)
		? urlJoin(config.baseUrl, rawValue)
		: rawValue;
}
