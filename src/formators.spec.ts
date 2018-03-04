import { FormatTypes, IPipe } from './types';

import { format } from './formators';

describe('Formators', () => {
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
	it('should throw when format = not existing', () => {
		const rawValue = `<h1>Title</h1>`;

		expect(() =>
			format(rawValue, [
				{ name: 'not-existing', args: [] },
			] as IPipe[]),
		).toThrowError(
			'Unknown formattor "not-existing". Allowed formators are string, one-line-string, html-to-text, number, url, regex',
		);
	});
});
