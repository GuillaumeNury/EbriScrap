import { selectAll } from 'css-select';
import { Node } from "domhandler";

import { parseConfig } from './config-parsers';
import { extract } from './extractors';
import { format } from './formators';
import {
	ArrayConfig,
	ConfigTypes,
	EbriScrapConfig,
	FieldConfig,
	GroupConfig,
	IArrayConfig,
	IGroupConfig,
} from './types';
import { parseDOM } from 'htmlparser2';

export function parse<T = any>(
	html: string,
	config: EbriScrapConfig,
): T {
	const parsedConfig = parseConfig(config);
	const nodes = parseDOM(html);
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
			...selectAll(config.itemSelector, container)
				.map(item => genericParse([item], config.data))
		], []);
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
