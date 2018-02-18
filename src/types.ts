export enum ConfigTypes {
	ARRAY = 'array',
	GROUP = 'group',
	FIELD = 'field',
}

export enum ExtractTypes {
	HTML = 'html',
	TEXT = 'text',
	PROP = 'prop',
	CSS = 'css',
}

export enum FormatTypes {
	STRING = 'string',
	ONE_LINE_STRING = 'one-line-string',
	HTML_TO_TEXT = 'html-to-text',
	NUMBER = 'number',
	URL = 'url',
	REGEX = 'regex',
}

export type ValidTypes = string | number;

export type AbstractPageConfig =
	| IGroupConfig
	| IArrayConfig
	| FieldConfig;

export interface IEbriScrapConfig {
	[field: string]: AbstractPageConfig;
}

export interface IGroupConfig {
	type: 'group';
	containerSelector: string;
	children: { [field: string]: AbstractPageConfig };
}

export interface IArrayConfig {
	type: 'array';
	containerSelector: string;
	itemSelector: string;
	children: AbstractPageConfig;
}

export type FieldConfig =
	| PropFieldConfig
	| HtmlFieldConfig
	| TextFieldConfig
	| CssFieldConfig;

export interface CoreFieldConfig {
	type: 'field';
	selector: string;
	format?:
		| 'number'
		| 'one-line-string'
		| 'string'
		| 'html-to-text'
		| 'url'
		| FormatConfigs;
}

export interface PropFieldConfig extends CoreFieldConfig {
	extract: 'prop';
	propertyName: string;
}
export interface HtmlFieldConfig extends CoreFieldConfig {
	extract: 'html';
}
export interface TextFieldConfig extends CoreFieldConfig {
	extract: 'text';
}
export interface CssFieldConfig extends CoreFieldConfig {
	extract: 'css';
	propertyName: string;
}

export type FormatConfigs =
	| IFormatConfig
	| IUrlFormatConfig
	| IRegexFormatConfig;

export interface IFormatConfig {
	type:
		| 'number'
		| 'one-line-string'
		| 'string'
		| 'html-to-text'
		| 'url';
}

export interface IUrlFormatConfig {
	type: FormatTypes.URL;
	baseUrl?: string;
}

export interface IRegexFormatConfig {
	type: FormatTypes.REGEX;
	regex: string;
	output: string;
}
