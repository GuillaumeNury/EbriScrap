import { ExtractTypes, FieldConfig } from './types';

import { enumAsString } from './utils';

export function extract(
	$: CheerioStatic,
	config: FieldConfig,
): string {
	switch (config.extractor.name) {
		case ExtractTypes.HTML:
			return $(config.selector).html() || '';
		case ExtractTypes.TEXT:
			return $(config.selector).text() || '';
		case ExtractTypes.PROP:
			return $(config.selector).attr(config.extractor.args[0]);
		case ExtractTypes.CSS:
			return $(config.selector).css(config.extractor.args[0]);
		default:
			throw new Error(
				`Invalid extract property in configuration. Supported values are: ${enumAsString(
					ExtractTypes,
				)}`,
			);
	}
}
