import { FormatTypes } from './types';
import { format } from './formators';

describe('Formators', () => {
	it('should work when format = undefined', () => {
		const rawValue = `A Text`;

		const result = format(rawValue, undefined);

		expect(result).toEqual('A Text');
	});
	it('should work when format = string', () => {
		const rawValue = `A Text`;

		const result = format(rawValue, FormatTypes.STRING);

		expect(result).toEqual('A Text');
	});
	it('should work when format = one-line-string', () => {
		const rawValue = `
			
				A
				multiline
				text
			`;

		const result = format(rawValue, FormatTypes.ONE_LINE_STRING);

		expect(result).toEqual('A multiline text');
	});
	it('should work when format = number', () => {
		const rawValue = `<div>12 345.67 €</div>`;

		const result = format(rawValue, FormatTypes.NUMBER);

		expect(result).toEqual(12345.67);
	});
	it('should work when format = html-to-text', () => {
		const rawValue = 'A<br><p>multiline</p><div>text</div>!';

		const result = format(rawValue, FormatTypes.HTML_TO_TEXT);

		expect(result).toEqual('A\n\nmultiline\n\ntext\n!');
	});
	it('should throw when format = not existing', () => {
		const rawValue = `<h1>Title</h1>`;

		expect(() => format(rawValue, 'not-existing' as any)).toThrowError(
			'Invalid format config. Allowed values are string, number and date',
		);
	});
});
