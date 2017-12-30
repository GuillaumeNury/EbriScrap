import {
	stringEnumContains,
	stringEnumToString,
	stringEnumValues,
} from './utils';

enum TestEnum {
	A = 'a',
	B = 'b',
	C = 'c',
}

describe('Utils', () => {
	describe('stringEnumToString', () => {
		it('should return a, b, c', () => {
			expect(stringEnumToString(TestEnum)).toBe('a, b, c');
		});
	});
	describe('stringEnumValues', () => {
		it('should return [a, b, c]', () => {
			expect(stringEnumValues(TestEnum)).toEqual(['a', 'b', 'c']);
		});
	});
	describe('stringEnumContains', () => {
		it('should return true if value = a', () => {
			expect(stringEnumContains(TestEnum, 'a')).toBe(true);
		});
		it('should return false if value = d', () => {
			expect(stringEnumContains(TestEnum, 'd')).toBe(false);
		});
	});
});
