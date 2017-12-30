export function stringEnumToString(_enum: {
	[key: number]: string;
}): string {
	return stringEnumValues(_enum).join(', ');
}

export function stringEnumValues(_enum: {
	[key: number]: string;
}): string[] {
	return Object.keys(_enum).map(key => _enum[key as any]);
}

export function stringEnumContains(
	_enum: {
		[key: number]: string;
	},
	value: string,
): boolean {
	return (
		value !== null &&
		value !== undefined &&
		stringEnumValues(_enum).indexOf(value) !== -1
	);
}
