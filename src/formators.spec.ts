import { FormatTypes } from './types';
import { format } from './formators';

describe('Formators', () => {
	it('should work when format = undefined', () => {
		const rawValue = `A Text`;

		const result = format(rawValue, { format: undefined } as any);

		expect(result).toEqual('A Text');
	});
	it('should work when format = string', () => {
		const rawValue = `A Text`;

		const result = format(rawValue, {
			format: FormatTypes.STRING,
		} as any);

		expect(result).toEqual('A Text');
	});
	it('should work when format = one-line-string', () => {
		const rawValue = `
			
				A
				multiline
				text
			`;

		const result = format(rawValue, {
			format: FormatTypes.ONE_LINE_STRING,
		} as any);

		expect(result).toEqual('A multiline text');
	});
	it('should work when format = number', () => {
		const rawValue = `<div>12 345.67 €</div>`;

		const result = format(rawValue, {
			format: FormatTypes.NUMBER,
		} as any);

		expect(result).toEqual(12345.67);
	});
	it('should work when format = html-to-text', () => {
		const rawValue = 'A<br><p>multiline</p><div>text</div>!';

		const result = format(rawValue, {
			format: FormatTypes.HTML_TO_TEXT,
		} as any);

		expect(result).toEqual('A\n\nmultiline\n\ntext\n!');
	});
	it('should work when format = url with string config', () => {
		const rawValue = '/a-path/other-things';

		const result = format(rawValue, {
			format: FormatTypes.URL,
		} as any);

		expect(result).toEqual(rawValue);
	});
	it('should work when format = url with object config', () => {
		const rawValue = '/a-path/other-things';

		const result = format(rawValue, {
			format: { type: FormatTypes.URL },
		} as any);

		expect(result).toEqual(rawValue);
	});
	it('should work when format = url with base url', () => {
		const rawValue = '/a-path/other-things';

		const result = format(rawValue, {
			format: {
				type: FormatTypes.URL,
				baseUrl: 'https://www.toto.com',
			},
		} as any);

		expect(result).toEqual('https://www.toto.com/a-path/other-things');
	});
	it('should work when format = url with base url, without leading /', () => {
		const rawValue = 'a-path/other-things';

		const result = format(rawValue, {
			format: {
				type: FormatTypes.URL,
				baseUrl: 'https://www.toto.com',
			},
		} as any);

		expect(result).toEqual('https://www.toto.com/a-path/other-things');
	});
	it('should throw when format = not existing', () => {
		const rawValue = `<h1>Title</h1>`;

		expect(() =>
			format(rawValue, { format: 'not-existing' } as any),
		).toThrowError(
			'Invalid format config. Allowed values are string, number and date',
		);
	});
});
