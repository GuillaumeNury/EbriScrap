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
	TRIM = 'trim',
}

export interface IPipe {
	name: string;
	args: string[];
}

export type ConfigTypes = IArrayConfig | IGroupConfig | IFieldConfig;

export class ArrayConfig<TData extends ConfigTypes = ConfigTypes>
	implements IArrayConfig {
	public containerSelector: string;
	public itemSelector: string;
	public data: TData;
}

export interface IArrayConfig {
	containerSelector: string;
	itemSelector: string;
	data: ConfigTypes;
}

export class GroupConfig implements IGroupConfig {
	[key: string]: ConfigTypes;
}

export interface IGroupConfig {
	[key: string]: ConfigTypes;
}

export class FieldConfig implements IFieldConfig {
	public raw: string;
	public selector: string;
	public extractor: IPipe;
	public formators: IPipe[];
}

export interface IFieldConfig {
	raw: string;
	selector: string;
	extractor: IPipe;
	formators: IPipe[];
}

export interface IRawArrayConfig extends Array<IRawArrayConfigItem> {}

export interface IRawArrayConfigItem<T = any> {
	containerSelector: string;
	itemSelector: string;
	data: T;
}

export interface IRawGroupConfig {
	[key: string]: any;
}

export type EbriScrapConfig =
	| IRawArrayConfig
	| IRawGroupConfig
	| string;

interface TypedEbriScrapConfigArray<T>
	extends Array<IRawArrayConfigItem<TypedEbriScrapConfig<T>>> {}

export type TypedEbriScrapConfig<T> = T extends (
	| string
	| number
	| boolean)
	? string
	: T extends (infer U)[]
	? TypedEbriScrapConfigArray<U>
	: { [K in keyof T]: TypedEbriScrapConfig<T[K]> };
