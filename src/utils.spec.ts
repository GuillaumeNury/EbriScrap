import { stringEnumValues } from './utils';

enum TestEnum {
	A = 'a',
	B = 'b',
	C = 'c',
}

describe('Utils', () => {
	describe('stringEnumValues', () => {
		it('should return [a, b, c]', () => {
			expect(stringEnumValues(TestEnum)).toEqual(['a', 'b', 'c']);
		});
	});
});
