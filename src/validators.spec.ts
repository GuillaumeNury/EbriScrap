import { config as githubConfig } from '../examples/github';
import { validateConfig } from './validators';
import { config as wikipediaConfig } from '../examples/wikipedia';

describe('Validators', () => {
	describe('Examples', () => {
		it('should work for wikipedia config', () => {
			expect(() => validateConfig(wikipediaConfig)).not.toThrowError();
		});
		it('should work for github config', () => {
			expect(() => validateConfig(githubConfig)).not.toThrowError();
		});
	});
});
