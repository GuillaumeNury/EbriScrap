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
	NUMBER = 'number',
	DATE = 'date',
}

export type ValidTypes = string | number | Date;

export type AbstractPageConfig = IGroupConfig | IArrayConfig | FieldConfig;

export interface IEbriScrapConfig {
	[field: string]: AbstractPageConfig;
}

export interface IGroupConfig {
	type: ConfigTypes.GROUP;
	containerSelector: string;
	children: { [field: string]: AbstractPageConfig };
}

export interface IArrayConfig {
	type: ConfigTypes.ARRAY;
	containerSelector: string;
	itemSelector: string;
	field: AbstractPageConfig;
}

export type FieldConfig =
	| PropFieldConfig
	| HtmlFieldConfig
	| TextFieldConfig
	| CssFieldConfig;

export interface CoreFieldConfig {
	type: ConfigTypes.FIELD;
	selector: string;
	format?: FormatTypes;
}

export interface PropFieldConfig extends CoreFieldConfig {
	extract: ExtractTypes.PROP;
	propertyName: string;
}
export interface HtmlFieldConfig extends CoreFieldConfig {
	extract: ExtractTypes.HTML;
}
export interface TextFieldConfig extends CoreFieldConfig {
	extract: ExtractTypes.TEXT;
}
export interface CssFieldConfig extends CoreFieldConfig {
	extract: ExtractTypes.CSS;
	propertyName: string;
}
