import { Node } from "domhandler";

export enum ExtractTypes {
	HTML = 'html',
	OUTER_HTML = 'outerHtml',
	TEXT = 'text',
	PROP = 'prop',
	CSS = 'css',
}

export enum FormatTypes {
	STRING = 'string',
	SLICE = 'slice',
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
	public includeSiblings?: boolean;
}

export interface IArrayConfig {
	containerSelector: string;
	itemSelector: string;
	includeSiblings?: boolean;
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
	includeSiblings?: boolean;
	data: T;
}

export interface IRawGroupConfig {
	[key: string]: any;
}

export interface EbriscrapDebugStep {
	selectors: string[];
	path: string;
}

export interface DebugStep {
	nodes: Node[];
	config: ConfigTypes;
	path: string;
}

export interface EbriscrapDebugResult<T> {
	debug: EbriscrapDebugStep[];
	result: EbriScrapData<T>;
}

export type EbriScrapConfigArray<T> = IRawArrayConfigItem<EbriScrapConfig<T>>[];

export type EbriScrapConfigObject<T> = {
	[K in keyof T]: EbriScrapConfig<T[K]>
}

export type EbriScrapConfig<T = any> = T extends Array<any>
	? EbriScrapConfigArray<T[number]>
	: T extends object
		? EbriScrapConfigObject<T>
		: string;

export type EbriScrapData<TConfig> = TConfig extends string
	? string
	: TConfig extends Array<IRawArrayConfigItem<infer TArrayConfigData>>
		? EbriScrapData<TArrayConfigData>[]
		: TConfig extends object
			? { [K in keyof TConfig]: EbriScrapData<TConfig[K]> }
			: unknown;