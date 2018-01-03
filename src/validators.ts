import { ConfigTypes, ExtractTypes, FormatTypes } from './types';

import joi from 'joi';
import { stringEnumValues } from './utils';

const coreConfigItem = joi.object().keys({
	type: joi
		.string()
		.required()
		.valid(...stringEnumValues(ConfigTypes)),
});

const fieldConfig = coreConfigItem.keys({
	selector: joi.string().required(),
	format: joi.string().valid(...stringEnumValues(FormatTypes)),
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

	if (config.type === ConfigTypes.FIELD) {
		validate(config, fieldConfig, path);

		return;
	}
	if (config.type === ConfigTypes.GROUP) {
		validate(config, groupConfig, path);
		validateMapOfConfig(config.children, `${path} > children`);

		return;
	}
	if (config.type === ConfigTypes.ARRAY) {
		validate(config, arrayConfig, path);
		validateGenericConfig(config.children, `${path} > children`);

		return;
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
