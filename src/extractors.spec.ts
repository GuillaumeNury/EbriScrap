import { FieldConfig } from './types';
import { extract } from './extractors';
import { parseDOM } from 'htmlparser2';

describe('Extractors', () => {
	it('should work when extract = text', () => {
		const nodes = parseDOM(`<h1>Title</h1>`);

		const config = {
			extractor: { name: 'text', args: [] },
			selector: 'h1',
		} as FieldConfig;

		const result = extract(nodes, config);

		expect(result).toEqual('Title');
	});
	it('should work when extract = text and when selector do not match anything', () => {
		const nodes = parseDOM(`<h1>Title</h1>`);

		const config = {
			extractor: { name: 'text', args: [] },
			selector: 'p',
		} as FieldConfig;

		const result = extract(nodes, config);

		expect(result).toEqual('');
	});
	it('should work when extract = prop', () => {
		const nodes = parseDOM(`<a href="a-super-link">Link</a>`);

		const config = {
			extractor: { name: 'prop', args: ['href'] },
			selector: 'a',
		} as FieldConfig;

		const result = extract(nodes, config);

		expect(result).toEqual('a-super-link');
	});
	it('should work when extract = html', () => {
		const nodes = parseDOM(
			`<div><a href="a-super-link">Link</a></div>`,
		);

		const config = {
			extractor: { name: 'html', args: [] },
			selector: 'div',
		} as FieldConfig;

		const result = extract(nodes, config);

		expect(result).toEqual('<a href="a-super-link">Link</a>');
	});
	it('should work when extract = html and when selector do not match anything', () => {
		const nodes = parseDOM(
			`<div><a href="a-super-link">Link</a></div>`,
		);

		const config = {
			extractor: { name: 'html', args: [] },
			selector: 'h1',
		} as FieldConfig;

		const result = extract(nodes, config);

		expect(result).toEqual('');
	});
	it('should work when extract = outerHtml', () => {
		const nodes = parseDOM(
			`<div><a href="a-super-link">Link</a></div>`,
		);

		const config = {
			extractor: { name: 'outerHtml', args: [] },
			selector: 'div',
		} as FieldConfig;

		const result = extract(nodes, config);

		expect(result).toEqual('<div><a href="a-super-link">Link</a></div>');
	});
	it('should work when extract = outerHtml and when selector do not match anything', () => {
		const nodes = parseDOM(
			`<div><a href="a-super-link">Link</a></div>`,
		);

		const config = {
			extractor: { name: 'outerHtml', args: [] },
			selector: 'h1',
		} as FieldConfig;

		const result = extract(nodes, config);

		expect(result).toEqual('');
	});
	it('should work when extract = css', () => {
		const nodes = parseDOM(`<div style="color: white"></div>`);

		const config = {
			extractor: { name: 'css', args: ['color'] },
			selector: 'div',
		} as FieldConfig;

		const result = extract(nodes, config);

		expect(result).toEqual('white');
	});
	it('should work when extract = css and no style', () => {
		const nodes = parseDOM(`<div></div>`);

		const config = {
			extractor: { name: 'css', args: ['color'] },
			selector: 'div',
		} as FieldConfig;

		const result = extract(nodes, config);

		expect(result).toEqual('');
	});
	it('should throw when extract = not existing', () => {
		const nodes = parseDOM(`<h1>Title</h1>`);

		const config = {
			extractor: { name: 'not exising', args: ['color'] },
			selector: 'h1',
		} as FieldConfig;

		expect(() => extract(nodes, config)).toThrowError(
			'Invalid extract property in configuration. Supported values are: html, outerHtml, text, prop, css',
		);
	});
});
