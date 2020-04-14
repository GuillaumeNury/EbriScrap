import { Element, Node } from 'domhandler';
import { ExtractTypes, FieldConfig } from './types';

import { enumAsString } from './utils';
import { getText, getAttributeValue, getInnerHTML } from 'domutils';
import { selectAll } from 'css-select';

function getAttribute(nodes: Node[], attribute: string): string {
	for (const node of nodes) {
		if (node && node instanceof Element) {
			return getAttributeValue(node, attribute)
		}
	}

	return '';
}

function getStyleProperty(nodes: Node[], property: string) {
	for (const node of nodes) {
		const expressions = getAttribute([node], 'style')
			.split(';')
			.map(expression => expression.trim());

		for (const expression of expressions) {
			const colonPosition = expression.indexOf(':');

			if (colonPosition >= 0 && expression.slice(0, colonPosition).trim() === property) {
				return expression.slice(colonPosition + 1).trim();
			}
		}
	}

	return '';
}

export function extract(
	nodes: Node[],
	config: FieldConfig,
): string {
	const matchingNodes = selectAll(config.selector, nodes);

	switch (config.extractor.name) {
		case ExtractTypes.HTML:
			return matchingNodes.map(node => getInnerHTML(node)).join() || '';
		case ExtractTypes.TEXT:
			return getText(matchingNodes) || '';
		case ExtractTypes.PROP:
			return getAttribute(matchingNodes, config.extractor.args[0]);
		case ExtractTypes.CSS:
			return getStyleProperty(matchingNodes, config.extractor.args[0]);
		default:
			throw new Error(
				`Invalid extract property in configuration. Supported values are: ${enumAsString(
					ExtractTypes,
				)}`,
			);
	}
}
