import * as joi from 'joi';

import { ConfigTypes, ExtractTypes, FormatTypes } from './types';

import { stringEnumValues } from './utils';

const coreConfigItem = joi.object().keys({
	type: joi
		.string()
		.required()
		.valid(...stringEnumValues(ConfigTypes)),
});

const fieldConfig = coreConfigItem.keys({
	selector: joi.string().required(),
	format: [
		joi.string().valid(...stringEnumValues(FormatTypes)),
		joi.object().keys({
			type: joi.string().valid(...stringEnumValues(FormatTypes)),
			baseUrl: joi.string().optional(),
		}),
	],
	extract: joi
		.string()
		.required()
		.valid(...stringEnumValues(ExtractTypes)),
	propertyName: joi.string().when('extract', {
		is: joi.valid(ExtractTypes.CSS, ExtractTypes.PROP),
		then: joi.required(),
		otherwise: joi.forbidden(),
	}),
});

const arrayConfig = coreConfigItem.keys({
	containerSelector: joi.string().required(),
	itemSelector: joi.string().required(),
	children: joi.object().required(),
});

const groupConfig = coreConfigItem.keys({
	containerSelector: joi.string().required(),
	children: joi.object().required(),
});

export function validateConfig(config: any): void {
	validate(config, joi.object());
	validateMapOfConfig(config);
}

export function validateGenericConfig(
	config: any,
	path: string = '',
): void {
	validate(config, coreConfigItem.unknown(), path);

	let schema: joi.Schema = null;
	let childrenValidator: (config: any, path: string) => void;

	if (config.type === ConfigTypes.FIELD) {
		schema = fieldConfig;
	} else if (config.type === ConfigTypes.GROUP) {
		schema = groupConfig;
		childrenValidator = validateMapOfConfig;
	} else if (config.type === ConfigTypes.ARRAY) {
		schema = arrayConfig;
		childrenValidator = validateGenericConfig;
	}

	validate(config, schema, path);

	if (!!childrenValidator) {
		childrenValidator(config.children, `${path} > children`);
	}
}

function validateMapOfConfig(config: any, path: string = ''): void {
	Object.keys(config).forEach(childKey =>
		validateGenericConfig(config[childKey], `${path} > ${childKey}`),
	);
}

function validate(
	config: any,
	joiConfig: joi.Schema,
	path: string = '',
): void {
	const { error } = joi.validate(config, joiConfig);

	if (!!error) {
		const { message } = error.details[0];

		throw new Error(`Invalid configuration${path}: ${message}`);
	}
}
