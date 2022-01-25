export function enumAsString(_enum: {
	[key: number]: string;
}): string {
	return stringEnumValues(_enum).join(', ');
}

export function stringEnumValues(_enum: {
	[key: number]: string;
}): string[] {
	return Object.keys(_enum).map(key => _enum[key as any]);
}

function trim(str: string, char: string) {
	const fromIndex = str.startsWith(char) ? 1 : 0;
	const toIndex = str.endsWith(char) ? -1 : str.length;

	return str.slice(fromIndex, toIndex);
}

export function urlJoin(...urlParts: string[]): string {
	return urlParts.map(part => trim(part, '/')).join('/');
}
