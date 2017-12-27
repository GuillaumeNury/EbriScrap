import { ExtractTypes, FieldConfig } from './types';

export function extract(
	$: CheerioStatic,
	config: FieldConfig,
): string {
	switch (config.extract) {
		case ExtractTypes.HTML:
			return $(config.selector).html() || '';
		case ExtractTypes.TEXT:
			return $(config.selector).text() || '';
		case ExtractTypes.PROP:
			return $(config.selector).attr(config.propertyName);
		case ExtractTypes.CSS:
			return $(config.selector).css(config.propertyName);
		default:
			throw new Error(
				'Invalid extract property in configuration. Supported values are: html, text and prop',
			);
	}
}
