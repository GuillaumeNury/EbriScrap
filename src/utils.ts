export function stringEnumValues(_enum: {
	[key: number]: string;
}): string[] {
	return Object.keys(_enum).map(key => _enum[key as any]);
}
