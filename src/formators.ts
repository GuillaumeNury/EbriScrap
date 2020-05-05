import { FormatTypes, IPipe } from './types';
import { enumAsString, urlJoin } from './utils';
import { parseDOM } from 'htmlparser2';
import { getText } from 'domutils';

const formattorsMap = {
	[FormatTypes.STRING]: ignoreUndefined(formatString),
	[FormatTypes.HTML_TO_TEXT]: ignoreUndefined(formatHtmlToText),
	[FormatTypes.ONE_LINE_STRING]: ignoreUndefined(formatOneLineString),
	[FormatTypes.NUMBER]: ignoreUndefined(formatNumber),
	[FormatTypes.URL]: ignoreUndefined(formatUrl),
	[FormatTypes.REGEX]: ignoreUndefined(formatRegex),
	[FormatTypes.TRIM]: ignoreUndefined(formatTrim),
	[FormatTypes.SLICE]: ignoreUndefined(formatSlice),
} as { [format: string]: FormatFunc };

type FormatFunc = (
	rawValue: string,
	...args: string[]
) => string | number;

export function format(rawValue: any, formators: IPipe[] = []): any {
	const formattedValue = formators.reduce(
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

function ignoreUndefined(formattor: FormatFunc): FormatFunc {
	return (rawValue: string, ...args: string[]) =>
		rawValue === undefined ? rawValue : formattor(rawValue, ...args);
}

function formatHtmlToText(rawValue: string): string {
	const sanitizedHtml = rawValue
		.trim()
		.replace(/<br>/g, '\n')
		.replace(/<p>(.*?)<\/p>/g, (_, match) => `\n${match}\n`)
		.replace(/<div>(.*?)<\/div>/g, (_, match) => `\n${match}\n`);

	return getText(parseDOM(sanitizedHtml));
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

function formatTrim(rawValue: string): string {
	return rawValue.trim();
}

function formatSlice(rawValue: string, from: string, to: string): string {
	if (!from) {
		throw new Error(
			'Cannot use slice formattor. Missing first parameter. Use selector | format:slice:0:-1',
		);
	}
	const fromValue = parseInt(from, 10);

	if (isNaN(fromValue)) {
		throw new Error(
			'Cannot use slice formattor. Invalid first parameter. Should be an integer.',
		);
	}

	const toValue = to && parseInt(to);

	if (to && isNaN(toValue)) {
		throw new Error(
			'Cannot use slice formattor. Invalid second parameter. Should be an integer or nothing.',
		);
	}

	return to ? rawValue.slice(fromValue, toValue) : rawValue.slice(fromValue)
}
