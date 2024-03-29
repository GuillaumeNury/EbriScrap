import { format } from './formators';
import { FormatTypes, IPipe } from './types';
import { stringEnumValues } from './utils';

describe('Formators', () => {
	it('should work when no formattors', () => {
		const rawValue = `A Text`;

		const result = format(rawValue);

		expect(result).toEqual(rawValue);
	});
	it('should work when format = string', () => {
		const rawValue = `A Text`;

		const result = format(rawValue, [
			{
				name: FormatTypes.STRING,
				args: [],
			},
		] as IPipe[]);

		expect(result).toEqual('A Text');
	});
	it('should work when format = one-line-string', () => {
		const rawValue = `
			
				A
				multiline
				text
			`;

		const result = format(rawValue, [
			{
				name: FormatTypes.ONE_LINE_STRING,
				args: [],
			},
		] as IPipe[]);

		expect(result).toEqual('A multiline text');
	});
	it('should work when format = number', () => {
		const rawValue = `<div>12 345.67 €</div>`;

		const result = format(rawValue, [
			{
				name: FormatTypes.NUMBER,
				args: [],
			},
		] as IPipe[]);

		expect(result).toEqual(12345.67);
	});
	it('should work when format = html-to-text', () => {
		const rawValue = 'A<br><p>multiline</p><div>text</div>!';

		const result = format(rawValue, [
			{
				name: FormatTypes.HTML_TO_TEXT,
				args: [],
			},
		] as IPipe[]);

		expect(result).toEqual('A\n\nmultiline\n\ntext\n!');
	});
	it('should work when format = url with string config', () => {
		const rawValue = '/a-path/other-things';

		const result = format(rawValue, [
			{
				name: FormatTypes.URL,
				args: [],
			},
		] as IPipe[]);

		expect(result).toEqual(rawValue);
	});
	it('should work when format = url with object config', () => {
		const rawValue = '/a-path/other-things';

		const result = format(rawValue, [
			{
				name: FormatTypes.URL,
				args: [],
			},
		] as IPipe[]);

		expect(result).toEqual(rawValue);
	});
	it('should work when format = url with base url', () => {
		const rawValue = '/a-path/other-things';

		const result = format(rawValue, [
			{
				name: FormatTypes.URL,
				args: ['https://www.toto.com'],
			},
		] as IPipe[]);

		expect(result).toEqual('https://www.toto.com/a-path/other-things');
	});
	it('should work when format = url with base url, without leading /', () => {
		const rawValue = 'a-path/other-things';

		const result = format(rawValue, [
			{
				name: FormatTypes.URL,
				args: ['https://www.toto.com'],
			},
		] as IPipe[]);

		expect(result).toEqual('https://www.toto.com/a-path/other-things');
	});
	it('should work when format = regex', () => {
		const rawValue = 'beforeWowThisIsAmazingafter';

		const result = format(rawValue, [
			{
				name: FormatTypes.REGEX,
				args: ['before(.*?)after', '$1'],
			},
		] as IPipe[]);

		expect(result).toEqual('WowThisIsAmazing');
	});
	it('should not fail if nothing is matched when format = regex', () => {
		const rawValue = 'beforeWowThisIsAmazingafter';

		const result = format(rawValue, [
			{
				name: FormatTypes.REGEX,
				args: ['(.*)unicorn(.*)', '$1poney$2'],
			},
		] as IPipe[]);

		expect(result).toEqual('$1poney$2');
	});
	it('should work when format = regex with multiple capturing groups', () => {
		const rawValue = 'WowThisIsABitAmazing';

		const result = format(rawValue, [
			{
				name: FormatTypes.REGEX,
				args: ['^(.*?)ABit(.*?)$', '$1Truly$2'],
			},
		] as IPipe[]);

		expect(result).toEqual('WowThisIsTrulyAmazing');
	});
	it('should return rawValue when format = regex without arguments', () => {
		const rawValue = 'beforeWowThisIsAmazingafter';

		const result = () =>
			format(rawValue, [
				{
					name: FormatTypes.REGEX,
					args: [],
				},
			] as IPipe[]);

		expect(result).toThrowError(
			'Cannot use regex formattor. Missing first parameter. Use selector | regex:(.*):$1',
		);
	});
	it('should return rawValue when format = regex with one missing argument', () => {
		const rawValue = 'beforeWowThisIsAmazingafter';

		const result = () =>
			format(rawValue, [
				{
					name: FormatTypes.REGEX,
					args: ['poney'],
				},
			] as IPipe[]);

		expect(result).toThrowError(
			'Cannot use regex formattor. Missing second parameter. Use selector | regex:(.*):$1',
		);
	});
	it('should return trimmed value when format = trim', () => {
		const rawValue =
			'                WowThisIsAmazing                 ';

		const result = format(rawValue, [
			{
				name: FormatTypes.TRIM,
				args: [],
			},
		] as IPipe[]);

		expect(result).toBe('WowThisIsAmazing');
	});
	it('should return sliced value when format = slice with two valid parameters', () => {
		const rawValue = 'WowThisIsAmazing((';

		const result = format(rawValue, [
			{
				name: FormatTypes.SLICE,
				args: ['0','-2'],
			},
		] as IPipe[]);

		expect(result).toBe('WowThisIsAmazing');
	});
	it('should return sliced value when format = slice with one valid parameter', () => {
		const rawValue = '((WowThisIsAmazing';

		const result = format(rawValue, [
			{
				name: FormatTypes.SLICE,
				args: ['2'],
			},
		] as IPipe[]);

		expect(result).toBe('WowThisIsAmazing');
	});
	it('should throw when format = slice without parameters', () => {
		const rawValue = '((WowThisIsAmazing';

		const result = () => format(rawValue, [
			{
				name: FormatTypes.SLICE,
				args: [],
			},
		] as IPipe[]);

		expect(result).toThrowError('Cannot use slice formattor. Missing first parameter. Use selector | format:slice:0:-1');
	});
	it('should throw when format = slice with invalid first parameter parameters', () => {
		const rawValue = '((WowThisIsAmazing';

		const result = () => format(rawValue, [
			{
				name: FormatTypes.SLICE,
				args: ['a'],
			},
		] as IPipe[]);

		expect(result).toThrowError('Cannot use slice formattor. Invalid first parameter. Should be an integer.');
	});
	it('should throw when format = slice with invalid second parameter parameters', () => {
		const rawValue = '((WowThisIsAmazing';

		const result = () => format(rawValue, [
			{
				name: FormatTypes.SLICE,
				args: ['0', 'a'],
			},
		] as IPipe[]);

		expect(result).toThrowError('Cannot use slice formattor. Invalid second parameter. Should be an integer or nothing.');
	});
	it('should return undefined when rawValue is undefined', () => {
		const rawValue: string = undefined;
		const formatTypes = stringEnumValues(FormatTypes);

		for (const formatType of formatTypes) {
			const result = format(rawValue, [
				{
					name: formatType,
					args: [],
				},
			] as IPipe[]);

			expect(result).toBe(undefined);
		}
	});
	it('should throw when format = not existing', () => {
		const rawValue = `<h1>Title</h1>`;

		expect(() =>
			format(rawValue, [
				{ name: 'not-existing', args: [] },
			] as IPipe[]),
		).toThrowError(
			'Unknown formattor "not-existing". Allowed formators are string, slice, one-line-string, html-to-text, number, url, regex',
		);
	});
});
