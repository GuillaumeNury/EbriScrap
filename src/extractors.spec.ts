import * as cheerio from 'cheerio';

import { FieldConfig, IEbriScrapConfig } from './types';

import { extract } from './extractors';

describe('Extractors', () => {
	it('should work when extract = text', () => {
		const $ = cheerio.load(`<h1>Title</h1>`);

		const config = {
			type: 'field',
			extract: 'text',
			selector: 'h1',
		} as FieldConfig;

		const result = extract($, config);

		expect(result).toEqual('Title');
	});
	it('should work when extract = text and when selector do not match anything', () => {
		const $ = cheerio.load(`<h1>Title</h1>`);

		const config = {
			type: 'field',
			extract: 'text',
			selector: 'p',
		} as FieldConfig;

		const result = extract($, config);

		expect(result).toEqual('');
	});
	it('should work when extract = prop', () => {
		const $ = cheerio.load(`<a href="a-super-link">Link</a>`);

		const config = {
			type: 'field',
			extract: 'prop',
			propertyName: 'href',
			selector: 'a',
		} as FieldConfig;

		const result = extract($, config);

		expect(result).toEqual('a-super-link');
	});
	it('should work when extract = html', () => {
		const $ = cheerio.load(
			`<div><a href="a-super-link">Link</a></div>`,
		);

		const config = {
			type: 'field',
			extract: 'html',
			selector: 'div',
		} as FieldConfig;

		const result = extract($, config);

		expect(result).toEqual('<a href="a-super-link">Link</a>');
	});
	it('should work when extract = html and when selector do not match anything', () => {
		const $ = cheerio.load(
			`<div><a href="a-super-link">Link</a></div>`,
		);

		const config = {
			type: 'field',
			extract: 'html',
			selector: 'h1',
		} as FieldConfig;

		const result = extract($, config);

		expect(result).toEqual('');
	});
	it('should work when extract = css', () => {
		const $ = cheerio.load(`<div style="color: white"></div>`);

		const config = {
			type: 'field',
			extract: 'css',
			propertyName: 'color',
			selector: 'div',
		} as FieldConfig;

		const result = extract($, config);

		expect(result).toEqual('white');
	});
	it('should throw when extract = not existing', () => {
		const $ = cheerio.load(`<h1>Title</h1>`);

		const config = {
			type: 'field',
			extract: 'not existing' as any,
			selector: 'h1',
		} as FieldConfig;

		expect(() => extract($, config)).toThrowError(
			'Invalid extract property in configuration. Supported values are: html, text and prop',
		);
	});
});
