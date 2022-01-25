import { selectAll } from 'css-select';
import { Element, Node, NodeWithChildren } from "domhandler";
import { parseDocument, ElementType } from 'htmlparser2';

import { parseConfig } from './config-parsers';
import { extract } from './extractors';
import { format } from './formators';
import {
	ArrayConfig,
	ConfigTypes,
	DebugStep,
	FieldConfig,
	GroupConfig,
	IArrayConfig,
	IGroupConfig,
	EbriScrapConfig,
	EbriScrapData,
	EbriscrapDebugResult,
	EbriscrapDebugStep,
} from './types';

export function parse<T extends EbriScrapConfig>(html: string, config: T): EbriScrapData<T> {
	const parsedConfig = parseConfig(config);
	const doc = parseDocument(html, { decodeEntities: true });
	return genericParse(doc.children, parsedConfig, null, '');
}

export function parseWithDebug<T extends EbriScrapConfig>(html: string, config: T): EbriscrapDebugResult<T> {
	const parsedConfig = parseConfig(config);
	const doc = parseDocument(html, { decodeEntities: true });
	const debug: DebugStep[] = [];
	const result = genericParse(doc.children, parsedConfig, debug, '');
	return { result, debug: parseDebug(debug) };
}

function getNodeSelector(node: Node): string[] {
	if (node.type !== ElementType.Tag) return [];
	if (!node.parent) return node instanceof Element ? [node.tagName] : [];

	// nth-child selector index starts at 1
	let childIndex = 1;
	let index = 0;

	while (index < node.parent.children.length) {
		const child = node.parent.children[index];
		if (child === node) break;
		if (child.type === ElementType.Tag) childIndex++;
		index++;
	}

	return [...getNodeSelector(node.parent), `:nth-child(${childIndex})`];
}

function parseDebug(steps: DebugStep[]): EbriscrapDebugStep[] {
	return steps.map(step => ({
		selectors: step.nodes
			.filter(n => n.type === ElementType.Tag)
			.map(n => getNodeSelector(n).join(' > ')),
		path: step.path
	}));
}

function genericParse(
	nodes: Node[],
	config: ConfigTypes,
	debug: DebugStep[],
	path: string,
): any {
	debug && debug.push({ nodes, config, path });

	if (config instanceof FieldConfig) {
		return parseField(nodes, config);
	}
	if (config instanceof GroupConfig) {
		return parseGroup(nodes, config, debug, path);
	}
	if (config instanceof ArrayConfig) {
		return parseArray(nodes, config, debug, path);
	}
}

function parseField(
	nodes: Node[],
	config: FieldConfig
): any {
	const rawValue = extract(nodes, config);
	const parsed = format(rawValue, config.formators);
	return parsed;
}

function parseArray(
	nodes: Node[],
	config: IArrayConfig,
	debug: DebugStep[],
	path: string,
): any {
	return selectAll(config.containerSelector, nodes)
		.reduce((acc, container, index) => {
			debug && debug.push({ nodes: [container], config, path: `${path}/${index}` });

			return [
			...acc,
			...parseArrayItems(config, container, debug, `${path}/${index}`),
			]
		}, []);
}

function parseArrayItems(
	config: IArrayConfig,
	container: Node,
	debug: DebugStep[],
	path: string,
): any {
	const items = selectAll(config.itemSelector, container);

	if (!config.includeSiblings || !(container instanceof NodeWithChildren)) {
		return items.map((item, itemIndex) => genericParse([item], config.data, debug, `${path}/${itemIndex}`));
	}
	
	return items.map((item, itemIndex) => {
		const { children } = container
		const fromIndex = children.indexOf(item);
		const toIndex = itemIndex === items.length - 1
			// Take all remaining children
			? children.length - 1
			// Find element just before next item
			: children.indexOf(items[itemIndex + 1]) - 1;

		return genericParse(children.slice(fromIndex, toIndex), config.data, debug, `${path}/${itemIndex}`);
	});
}

function parseGroup(
	nodes: Node[],
	config: IGroupConfig,
	debug: DebugStep[],
	path: string,
): any {
	const keys = getKeys(config);

	return keys.reduce(
		(acc, key) => {
			const child = config[key];

			acc[key] = genericParse(nodes, child, debug, `${path}/${key}`);

			return acc;
		},
		{} as any,
	);
}

function getKeys(object: Object): string[] {
	return (!!object && Object.keys(object)) || [];
}
