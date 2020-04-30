import { selectAll } from 'css-select';
import { Node, NodeWithChildren } from "domhandler";
import { parseDOM } from 'htmlparser2';

import { parseConfig } from './config-parsers';
import { extract } from './extractors';
import { format } from './formators';
import {
	ArrayConfig,
	ConfigTypes,
	FieldConfig,
	GroupConfig,
	IArrayConfig,
	IGroupConfig,
	EbriScrapConfig,
	ɵEbriParseResult,
} from './types';

export function parse<T extends EbriScrapConfig>(html: string, config: T): ɵEbriParseResult<T>
export function parse<T>(html: string, config: EbriScrapConfig<T>): ɵEbriParseResult<T> {
	const parsedConfig = parseConfig(config);
	const nodes = parseDOM(html, { decodeEntities: true });
	return genericParse(nodes, parsedConfig);
}

function genericParse(
	nodes: Node[],
	config: ConfigTypes,
): any {
	if (config instanceof FieldConfig) {
		return parseField(nodes, config);
	}
	if (config instanceof GroupConfig) {
		return parseGroup(nodes, config);
	}
	if (config instanceof ArrayConfig) {
		return parseArray(nodes, config);
	}
}

function parseField(
	nodes: Node[],
	config: FieldConfig,
): any {
	const rawValue = extract(nodes, config);
	const parsed = format(rawValue, config.formators);
	return parsed;
}

function parseArray(
	nodes: Node[],
	config: IArrayConfig,
): any {
	return selectAll(config.containerSelector, nodes)
		.reduce((acc, container) => [
			...acc,
			...parseArrayItems(config, container),
		], []);
}

function parseArrayItems(
	config: IArrayConfig,
	container: Node
): any {
	const items = selectAll(config.itemSelector, container);

	if (!config.includeSiblings || !(container instanceof NodeWithChildren)) {
		return items.map(item => genericParse([item], config.data));
	}
	
	return items.map((item, itemIndex) => {
		const { children } = container
		const fromIndex = children.indexOf(item);
		const toIndex = itemIndex === items.length - 1
			// Take all remaining children
			? children.length - 1
			// Find element just before next item
			: children.indexOf(items[itemIndex + 1]) - 1;

		return genericParse(children.slice(fromIndex, toIndex), config.data);
	});
}

function parseGroup(
	nodes: Node[],
	config: IGroupConfig,
): any {
	const keys = getKeys(config);

	return keys.reduce(
		(acc, key) => {
			const child = config[key];

			acc[key] = genericParse(nodes, child);

			return acc;
		},
		{} as any,
	);
}

function getKeys(object: Object): string[] {
	return (!!object && Object.keys(object)) || [];
}
