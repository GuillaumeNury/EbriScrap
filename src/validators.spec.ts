import {
	CssFieldConfig,
	FieldConfig,
	HtmlFieldConfig,
	PropFieldConfig,
	TextFieldConfig,
} from './types';

import { validateFieldConfig } from './validators';

describe('Validators', () => {
	describe('Field configs', () => {
		describe('Valid', () => {
			const shouldPass = (config: FieldConfig) =>
				expect(() => validateFieldConfig(config)).not.toThrowError();

			it('TextFieldConfig', () => {
				const config = {
					type: 'field',
					selector: 'h1',
					extract: 'text',
				} as TextFieldConfig;

				shouldPass(config);
			});
			it('PropFieldConfig', () => {
				const config = {
					type: 'field',
					selector: 'a',
					extract: 'prop',
					propertyName: 'href',
				} as PropFieldConfig;

				shouldPass(config);
			});
			it('CssFieldConfig', () => {
				const config = {
					type: 'field',
					selector: 'h1',
					extract: 'css',
					propertyName: 'color',
				} as CssFieldConfig;

				shouldPass(config);
			});
			it('HtmlFieldConfig', () => {
				const config = {
					type: 'field',
					selector: 'h1',
					extract: 'html',
				} as HtmlFieldConfig;

				shouldPass(config);
			});
		});
		describe('Invalid', () => {
			const shouldNotPass = (config: FieldConfig, message?: string) =>
				expect(() => validateFieldConfig(config)).toThrowError(
					message,
				);

			it('should fail when config is not an object', () => {
				const config = 42 as any;

				shouldNotPass(
					config,
					'Invalid field config object. It should be an object.',
				);
			});
			it('should fail when config is null', () => {
				const config = null as any;

				shouldNotPass(
					config,
					'Invalid field config object. It should be an object.',
				);
			});
			it('should fail when missing selector', () => {
				const config = {
					type: 'field',
					extract: 'text',
				} as TextFieldConfig;

				shouldNotPass(
					config,
					'Invalid selector. It cannot be null or undefined.',
				);
			});
			it('should fail when missing extract value', () => {
				const config = {
					type: 'field',
					selector: 'h1',
				} as TextFieldConfig;

				shouldNotPass(
					config,
					'Invalid extract value. Supported values are: html, text, prop, css. Received undefined.',
				);
			});
			it('should fail when invalid extract value', () => {
				const config = {
					type: 'field',
					selector: 'h1',
					extract: 'poney' as any,
				} as TextFieldConfig;

				shouldNotPass(
					config,
					'Invalid extract value. Supported values are: html, text, prop, css. Received poney.',
				);
			});
			it('should fail when invalid format value', () => {
				const config = {
					type: 'field',
					selector: 'h1',
					extract: 'text',
					format: 'poney' as any,
				} as TextFieldConfig;

				shouldNotPass(
					config,
					'Invalid format value. Supported values are: undefined, string, one-line-string, html-to-text, number. Received poney.',
				);
			});
			it('should fail when CssFieldConfig without propertyName', () => {
				const config = {
					type: 'field',
					selector: 'h1',
					extract: 'css',
				} as CssFieldConfig;

				shouldNotPass(
					config,
					'Missing propertyName. It is needed when extract=css or extract=prop.',
				);
			});
			it('should fail when PropFieldConfig without propertyName', () => {
				const config = {
					type: 'field',
					selector: 'h1',
					extract: 'prop',
				} as PropFieldConfig;

				shouldNotPass(
					config,
					'Missing propertyName. It is needed when extract=css or extract=prop.',
				);
			});
		});
	});
});
