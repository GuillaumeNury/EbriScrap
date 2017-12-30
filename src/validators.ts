import * as isObject from 'isobject';

import { ExtractTypes, FormatTypes } from './types';
import {
	stringEnumContains,
	stringEnumToString,
	stringEnumValues,
} from './utils';

import { extract } from './extractors';

const validExtractTypes = [];

export function validateFieldConfig(config: any): void {
	validateObjectType(config);

	const { extract, selector, type, format, propertyName } = config;

	validateExtract(extract);
	validateSelector(selector);
	validateFormat(format);
	validatePropertyName(extract, propertyName);
}

function validateObjectType(config: any): void {
	const isValidObject = !!config && isObject(config);
	if (!isValidObject) {
		throw new Error(
			'Invalid field config object. It should be an object.',
		);
	}
}

function validatePropertyName(
	extract: string,
	propertyName: string,
): void {
	const needPropertyName =
		extract === ExtractTypes.CSS || extract === ExtractTypes.PROP;
	const hasValidPropertyName = !needPropertyName || !!propertyName;

	if (!hasValidPropertyName) {
		throw new Error(
			`Missing propertyName. It is needed when extract=css or extract=prop.`,
		);
	}
}

function validateFormat(format: string): void {
	const hasValidFormat = format === undefined || format in FormatTypes;

	if (!hasValidFormat) {
		const formatTypes = stringEnumValues(FormatTypes).join(', ');
		throw new Error(
			`Invalid format value. Supported values are: undefined, ${formatTypes}. Received ${format}.`,
		);
	}
}

function validateSelector(selector: string): void {
	const hasValidSelector = selector !== null && selector !== undefined;

	if (!hasValidSelector) {
		throw new Error(
			`Invalid selector. It cannot be null or undefined.`,
		);
	}
}

function validateExtract(extract: string): void {
	const hasValidExtract = stringEnumContains(ExtractTypes, extract);

	if (!hasValidExtract) {
		throw new Error(
			`Invalid extract value. Supported values are: ${stringEnumToString(
				ExtractTypes,
			)}. Received ${extract}.`,
		);
	}
}
