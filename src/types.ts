export type AbstractPageConfig = IGroupConfig | IArrayConfig | FieldConfig;

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
	field: AbstractPageConfig;
}

export type FieldConfig =
	| PropFieldConfig
	| HtmlFieldConfig
	| TextFieldConfig
	| CssFieldConfig;

export interface CoreFieldConfig {
	type: 'field';
	selector: string;
	format?: 'string' | 'one-line-string' | 'number' | 'date';
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
