import {
	ArrayConfig,
	FieldConfig,
	GroupConfig,
	IFieldConfig,
	IRawArrayConfigItem,
} from './types';

import { parseConfig } from './config-parsers';

describe('Config parsers', () => {
	describe('Field parser', () => {
		it('should work when simple text', () => {
			const result = parseConfig('p') as FieldConfig;

			expect(result instanceof FieldConfig).toBe(true);
			expect(result.selector).toBe('p');
			expect(result.extractor.name).toEqual('text');
			expect(result.formators).toEqual([]);
		});
		it('should work when simple text with extractor', () => {
			const result = parseConfig('p | extract:html') as FieldConfig;

			expect(result instanceof FieldConfig).toBe(true);
			expect(result.selector).toBe('p');
			expect(result.extractor.name).toEqual('html');
			expect(result.formators).toEqual([]);
		});
		it('should work when simple text with formator', () => {
			const result = parseConfig('p | format:number') as FieldConfig;

			expect(result instanceof FieldConfig).toBe(true);
			expect(result.selector).toBe('p');
			expect(result.extractor.name).toEqual('text');
			expect(result.formators.length).toBe(1);
			expect(result.formators[0].name).toBe('number');
		});
		it('should work when simple text with two formators', () => {
			const result = parseConfig(
				'p | format:number | format:string',
			) as FieldConfig;

			expect(result instanceof FieldConfig).toBe(true);
			expect(result.selector).toBe('p');
			expect(result.extractor.name).toBe('text');
			expect(result.formators.length).toBe(2);
			expect(result.formators[0].name).toBe('number');
			expect(result.formators[1].name).toBe('string');
		});
		it('should work when simple text with extractor with no spaces', () => {
			const result = parseConfig('p|extract:html') as FieldConfig;

			expect(result instanceof FieldConfig).toBe(true);
			expect(result.selector).toBe('p');
			expect(result.extractor.name).toBe('html');
			expect(result.formators).toEqual([]);
		});
		it('should work when simple text with extractor with spaces', () => {
			const result = parseConfig('p | extract : html') as FieldConfig;

			expect(result instanceof FieldConfig).toBe(true);
			expect(result.selector).toBe('p');
			expect(result.extractor.name).toBe('html');
			expect(result.formators).toEqual([]);
		});
		it('should work when simple text with pipe/colons in single quotes', () => {
			const result = parseConfig(
				"p | format : regex : 'https://' : \\|$1\\|",
			) as FieldConfig;

			expect(result instanceof FieldConfig).toBe(true);
			expect(result.selector).toBe('p');
			expect(result.formators[0].name).toBe('regex');
			expect(result.formators[0].args).toEqual(['https://', '|$1|']);
		});
		it('should work when simple text with pipe/colons in double quotes', () => {
			const result = parseConfig(
				'p | format:regex:"https://":\\|$1\\|',
			) as FieldConfig;

			expect(result instanceof FieldConfig).toBe(true);
			expect(result.selector).toBe('p');
			expect(result.formators[0].name).toBe('regex');
			expect(result.formators[0].args).toEqual(['https://', '|$1|']);
		});
	});
	describe('Parsing errors', () => {
		it('should throw when no selector', () => {
			const config = 'extract: text';

			expect(() => parseConfig(config)).toThrowError(
				'Error while parsing "extract: text". Error: Missing selector.',
			);
		});
		it('should throw when too many selectors', () => {
			const config = 'h1 | h2';

			expect(() => parseConfig(config)).toThrowError(
				'Error while parsing "h1 | h2". Error: Too many selectors (only one selector allowed). Received: h1, h2.',
			);
		});
		it('should throw when format = not existing', () => {
			const config = 'h1 | format:not-existing';

			expect(() => parseConfig(config)).toThrowError(
				'Error while parsing "h1 | format:not-existing". Error: Invalid formator "not-existing". Allowed formators are string, one-line-string, html-to-text, number, url, regex.',
			);
		});
		it('should throw when extract = not existing', () => {
			const config = 'h1 | extract:not-existing';

			expect(() => parseConfig(config)).toThrowError(
				'Error while parsing "h1 | extract:not-existing". Error: Invalid extractor "not-existing". Allowed extractors are html, text, prop, css.',
			);
		});
		it('should throw when two extractors', () => {
			const config = 'h1 | extract:html | extract:text';

			expect(() => parseConfig(config)).toThrowError(
				'Error while parsing "h1 | extract:html | extract:text". Error: Too many extractors (only one extractor allowed). Received: extract:html, extract:text',
			);
		});
		it('should throw on empty config', () => {
			const result = () => parseConfig(null);

			expect(result).toThrowError(
				'Cannot parse configuration: null. It should be a string, an object or an array.',
			);
		});
		it('should throw on invalid object type config', () => {
			const result = () => parseConfig(42);

			expect(result).toThrowError(
				'Cannot parse configuration: 42. It should be a string, an object or an array.',
			);
		});
	});
	describe('Array parsers', () => {
		it('should work with a simple exmaple', () => {
			const config = [
				{
					itemSelector: 'li',
					containerSelector: 'ul',
					data: 'p',
				} as IRawArrayConfigItem,
			];
			const result = parseConfig(config) as ArrayConfig<IFieldConfig>;

			expect(result instanceof ArrayConfig).toBe(true);
			expect(result.data.selector).toBe('p');
			expect(result.data.extractor.name).toBe('text');
			expect(result.containerSelector).toBe('ul');
			expect(result.itemSelector).toBe('li');
		});
		it('should throw on missing data property', () => {
			const config = [
				{
					itemSelector: 'li',
					containerSelector: 'ul',
				} as IRawArrayConfigItem,
			];

			const result = () => parseConfig(config);

			expect(result).toThrowError(
				`Missing property 'data' in array configuration: [{"itemSelector":"li","containerSelector":"ul"}]`,
			);
		});
		it('should throw on missing containerSelector property', () => {
			const config = [
				{
					itemSelector: 'li',
					data: 'p',
				} as IRawArrayConfigItem,
			];

			const result = () => parseConfig(config);

			expect(result).toThrowError(
				`Missing property 'containerSelector' in array configuration: [{"itemSelector":"li","data":"p"}]`,
			);
		});
		it('should throw on missing itemSelector property', () => {
			const config = [
				{
					containerSelector: 'ul',
					data: 'p',
				} as IRawArrayConfigItem,
			];

			const result = () => parseConfig(config);

			expect(result).toThrowError(
				`Missing property 'itemSelector' in array configuration: [{"containerSelector":"ul","data":"p"}]`,
			);
		});
		it('should throw if config is empty array', () => {
			const config = [] as any;

			const result = () => parseConfig(config);

			expect(result).toThrowError(
				`Cannot parse array configuration as it is empty.`,
			);
		});
	});
	describe('Group parsers', () => {
		it('should work with a simple exmaple', () => {
			const config = {
				a: 'p',
			};

			const result = parseConfig(config) as GroupConfig;
			const aConfig = result.a as FieldConfig;

			expect(result instanceof GroupConfig).toBe(true);
			expect(aConfig instanceof FieldConfig).toBe(true);
			expect(aConfig.selector).toBe('p');
			expect(aConfig.extractor.name).toBe('text');
		});
	});
});
