import {
	CssFieldConfig,
	FieldConfig,
	HtmlFieldConfig,
	IArrayConfig,
	IEbriScrapConfig,
	IGroupConfig,
	PropFieldConfig,
	TextFieldConfig,
} from './types';
import { validateConfig, validateGenericConfig } from './validators';

import { config as githubConfig } from '../examples/github';
import { config as wikipediaConfig } from '../examples/wikipedia';

describe('Validators', () => {
	describe('Examples', () => {
		it('should work for wikipedia config', () => {
			expect(() => validateConfig(wikipediaConfig)).not.toThrowError();
		});
		it('should work for github config', () => {
			expect(() => validateConfig(githubConfig)).not.toThrowError();
		});
	});
	describe('Config types', () => {
		it('should pass if type=field', () => {
			const config = {
				type: 'field',
				selector: 'h1',
				extract: 'text',
			} as FieldConfig;

			expect(() => validateGenericConfig(config)).not.toThrowError();
		});
		it('should pass if type=group', () => {
			const config = {
				type: 'group',
				containerSelector: 'tr',
				children: {},
			} as IGroupConfig;

			expect(() => validateGenericConfig(config)).not.toThrowError();
		});
		it('should pass if type=array', () => {
			const config = {
				type: 'array',
				containerSelector: 'tr',
				itemSelector: 'td',
				children: {
					type: 'field',
					selector: 'td',
					extract: 'text',
				},
			} as IArrayConfig;

			expect(() => validateGenericConfig(config)).not.toThrowError();
		});
		it('should not pass if type=poney', () => {
			const config = {
				type: 'poney' as any,
			} as FieldConfig;

			expect(() => validateGenericConfig(config)).toThrowError(
				'Invalid configuration: "type" must be one of [array, group, field]',
			);
		});
	});
	describe('Field configs', () => {
		describe('Valid', () => {
			it('TextFieldConfig', () => {
				const config = {
					type: 'field',
					selector: 'h1',
					extract: 'text',
				} as TextFieldConfig;

				expect(() => validateGenericConfig(config)).not.toThrowError();
			});
			it('PropFieldConfig', () => {
				const config = {
					type: 'field',
					selector: 'a',
					extract: 'prop',
					propertyName: 'href',
				} as PropFieldConfig;

				expect(() => validateGenericConfig(config)).not.toThrowError();
			});
			it('PropFieldConfig with format as string', () => {
				const config = {
					type: 'field',
					selector: 'a',
					extract: 'prop',
					propertyName: 'href',
					format: 'url',
				} as PropFieldConfig;

				expect(() => validateGenericConfig(config)).not.toThrowError();
			});
			it('PropFieldConfig with format as object', () => {
				const config = {
					type: 'field',
					selector: 'a',
					extract: 'prop',
					propertyName: 'href',
					format: { type: 'url' },
				} as PropFieldConfig;

				expect(() => validateGenericConfig(config)).not.toThrowError();
			});
			it('PropFieldConfig with format as object, with baseUrl', () => {
				const config = {
					type: 'field',
					selector: 'a',
					extract: 'prop',
					propertyName: 'href',
					format: { type: 'url', baseUrl: 'www.toto.com' },
				} as PropFieldConfig;

				expect(() => validateGenericConfig(config)).not.toThrowError();
			});
			it('CssFieldConfig', () => {
				const config = {
					type: 'field',
					selector: 'h1',
					extract: 'css',
					propertyName: 'color',
				} as CssFieldConfig;

				expect(() => validateGenericConfig(config)).not.toThrowError();
			});
			it('HtmlFieldConfig', () => {
				const config = {
					type: 'field',
					selector: 'h1',
					extract: 'html',
				} as HtmlFieldConfig;

				expect(() => validateGenericConfig(config)).not.toThrowError();
			});
		});
		describe('Invalid', () => {
			it('should fail when config is not an object', () => {
				const config = 42 as any;

				expect(() => validateGenericConfig(config)).toThrowError(
					'Invalid configuration: "value" must be an object',
				);
			});
			it('should fail when config is null', () => {
				const config = null as any;

				expect(() => validateGenericConfig(config)).toThrowError(
					'Invalid configuration: "value" must be an object',
				);
			});
			it('should fail when missing selector', () => {
				const config = {
					type: 'field',
					extract: 'text',
				} as TextFieldConfig;

				expect(() => validateGenericConfig(config)).toThrowError(
					'Invalid configuration: "selector" is required',
				);
			});
			it('should fail when missing extract value', () => {
				const config = {
					type: 'field',
					selector: 'h1',
				} as TextFieldConfig;

				expect(() => validateGenericConfig(config)).toThrowError(
					'Invalid configuration: "extract" is required',
				);
			});
			it('should fail when invalid extract value', () => {
				const config = {
					type: 'field',
					selector: 'h1',
					extract: 'poney' as any,
				} as TextFieldConfig;

				expect(() => validateGenericConfig(config)).toThrowError(
					'Invalid configuration: "extract" must be one of [html, text, prop, css]',
				);
			});
			it('should fail when invalid format value', () => {
				const config = {
					type: 'field',
					selector: 'h1',
					extract: 'text',
					format: 'poney' as any,
				} as TextFieldConfig;

				expect(() => validateGenericConfig(config)).toThrowError(
					'Invalid configuration: "format" must be one of [string, one-line-string, html-to-text, number, url, regex]',
				);
			});
			it('should fail when CssFieldConfig without propertyName', () => {
				const config = {
					type: 'field',
					selector: 'h1',
					extract: 'css',
				} as CssFieldConfig;

				expect(() => validateGenericConfig(config)).toThrowError(
					'Invalid configuration: "propertyName" is required',
				);
			});
			it('should fail when PropFieldConfig without propertyName', () => {
				const config = {
					type: 'field',
					selector: 'h1',
					extract: 'prop',
				} as PropFieldConfig;

				expect(() => validateGenericConfig(config)).toThrowError(
					'Invalid configuration: "propertyName" is required',
				);
			});
		});
	});
	describe('Group config', () => {
		describe('Valid', () => {
			it('should work if one child', () => {
				const config = {
					type: 'group',
					containerSelector: 'tr',
					children: {
						child1: {
							type: 'field',
							selector: 'h1',
							extract: 'text',
						},
					},
				} as IGroupConfig;

				expect(() => validateGenericConfig(config)).not.toThrowError();
			});
		});
		describe('Invalid', () => {
			it('should not work if one child with error', () => {
				const config = {
					type: 'group',
					containerSelector: 'tr',
					children: {
						child1: {
							type: 'field',
							selector: 'h1',
							// extract: 'text', Missing extract
						} as FieldConfig,
					},
				} as IGroupConfig;

				expect(() => validateGenericConfig(config)).toThrowError(
					'Invalid configuration > children > child1: "extract" is required',
				);
			});
			it('should not work if one child whith one child with error', () => {
				const config = {
					type: 'group',
					containerSelector: 'tr',
					children: {
						child: {
							type: 'group',
							containerSelector: 'tr',
							children: {
								grandchild: {
									type: 'field',
									selector: 'h1',
									// extract: 'text', Missing extract
								} as FieldConfig,
							},
						},
					},
				} as IGroupConfig;

				expect(() => validateGenericConfig(config)).toThrowError(
					'Invalid configuration > children > child > children > grandchild: "extract" is required',
				);
			});
		});
	});
	describe('Array config', () => {
		describe('Valid', () => {
			it('should work if one child', () => {
				const config = {
					type: 'array',
					containerSelector: 'tr',
					itemSelector: 'tr',
					children: {
						type: 'field',
						selector: 'h1',
						extract: 'text',
					},
				} as IArrayConfig;

				expect(() => validateGenericConfig(config)).not.toThrowError();
			});
		});
		describe('Invalid', () => {
			it('should not work if one child with error', () => {
				const config = {
					type: 'array',
					containerSelector: 'tr',
					itemSelector: 'td',
					children: {
						type: 'field',
						selector: 'h1',
						// extract: 'text', Missing extract
					} as FieldConfig,
				} as IArrayConfig;

				expect(() => validateGenericConfig(config)).toThrowError(
					'Invalid configuration > children: "extract" is required',
				);
			});
			it('should not work if one child whith one child with error', () => {
				const config = {
					type: 'array',
					containerSelector: 'tr',
					itemSelector: 'td',
					children: {
						type: 'array',
						itemSelector: 'td',
						containerSelector: 'tr',
						children: {
							type: 'field',
							selector: 'h1',
							// extract: 'text', Missing extract
						} as FieldConfig,
					},
				} as IArrayConfig;

				expect(() => validateGenericConfig(config)).toThrowError(
					'Invalid configuration > children > children: "extract" is required',
				);
			});
		});
	});
	describe('Whole config validation', () => {
		it('should be ok if valid config', () => {
			const config = {
				field1: {
					type: 'field',
					selector: 'h1',
					extract: 'text',
				},
				field2: {
					type: 'group',
					containerSelector: 'table',
					children: {
						field21: {
							type: 'field',
							selector: 'th',
							extract: 'text',
						},
					},
				},
				field3: {
					type: 'array',
					containerSelector: 'table',
					itemSelector: 'thead',
					children: {
						type: 'field',
						selector: 'th',
						extract: 'text',
					},
				},
			} as IEbriScrapConfig;

			expect(() => validateConfig(config)).not.toThrowError();
		});
	});
});
