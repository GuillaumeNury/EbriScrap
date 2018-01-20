import { trim } from 'lodash';

export function stringEnumValues(_enum: {
	[key: number]: string;
}): string[] {
	return Object.keys(_enum).map(key => _enum[key as any]);
}

export function urlJoin(...urlParts: string[]): string {
	return urlParts.map(part => trim(part, '/')).join('/');
}
