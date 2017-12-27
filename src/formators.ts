import * as cheerio from 'cheerio';

import { FormatTypes } from './types';

const formattorsMap = {
	[FormatTypes.STRING]: formatString,
	[FormatTypes.HTML_TO_TEXT]: formatHtmlToText,
	[FormatTypes.ONE_LINE_STRING]: formatOneLineString,
	[FormatTypes.NUMBER]: formatNumber,
};

export function format(
	rawValue: string,
	format: FormatTypes = FormatTypes.STRING,
): any {
	const formator = formattorsMap[format];

	if (!formator) {
		throw new Error(
			'Invalid format config. Allowed values are string, number and date',
		);
	}

	return formator(rawValue);
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
