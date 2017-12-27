import { IEbriScrapConfig } from './types';
import { parse } from './parsers';

describe('Field parser', () => {
	describe('Extract types', () => {
		it('should work when extract = text', () => {
			const html = `<h1>Title</h1>`;

			const config = {
				title: {
					type: 'field',
					extract: 'text',
					selector: 'h1',
				},
			} as IEbriScrapConfig;

			const result = parse(html, config);

			expect(result).toEqual({ title: 'Title' });
		});
		it('should work when extract = prop', () => {
			const html = `<a href="a-super-link">Link</a>`;

			const config = {
				link: {
					type: 'field',
					extract: 'prop',
					propertyName: 'href',
					selector: 'a',
				},
			} as IEbriScrapConfig;

			const result = parse(html, config);

			expect(result).toEqual({ link: 'a-super-link' });
		});
		it('should work when extract = html', () => {
			const html = `<div><a href="a-super-link">Link</a></div>`;

			const config = {
				link: {
					type: 'field',
					extract: 'html',
					selector: 'div',
				},
			} as IEbriScrapConfig;

			const result = parse(html, config);

			expect(result).toEqual({
				link: '<a href="a-super-link">Link</a>',
			});
		});
		it('should work when extract = css', () => {
			const html = `<div style="color: white"></div>`;

			const config = {
				color: {
					type: 'field',
					extract: 'css',
					propertyName: 'color',
					selector: 'div',
				},
			} as IEbriScrapConfig;

			const result = parse(html, config);

			expect(result).toEqual({ color: 'white' });
		});
		it('should throw when extract = not existing', () => {
			const html = `<h1>Title</h1>`;

			const config = {
				title: {
					type: 'field',
					extract: 'not existing' as any,
					selector: 'h1',
				},
			} as IEbriScrapConfig;

			expect(() => parse(html, config)).toThrowError(
				'Invalid extract property in configuration. Supported values are: html, text and prop',
			);
		});
	});
	describe('Format types', () => {
		it('should work when format = undefined', () => {
			const html = `<div>A Text</div>`;

			const config = {
				value: {
					type: 'field',
					extract: 'text',
					selector: 'div',
					format: undefined,
				},
			} as IEbriScrapConfig;

			const result = parse(html, config);

			expect(result).toEqual({ value: 'A Text' });
		});
		it('should work when format = string', () => {
			const html = `<div>A Text</div>`;

			const config = {
				value: {
					type: 'field',
					extract: 'text',
					selector: 'div',
					format: 'string',
				},
			} as IEbriScrapConfig;

			const result = parse(html, config);

			expect(result).toEqual({ value: 'A Text' });
		});
		it('should work when format = one-line-string', () => {
			const html = `
				<div>
					<p>A</p>	
					<p>multiline</p>	
					<p>text</p>	
				</div>`;

			const config = {
				value: {
					type: 'field',
					extract: 'text',
					selector: 'div',
					format: 'one-line-string',
				},
			} as IEbriScrapConfig;

			const result = parse(html, config);

			expect(result).toEqual({ value: 'A multiline text' });
		});
		it('should work when format = number', () => {
			const html = `<div>12 345.67 €</div>`;

			const config = {
				value: {
					type: 'field',
					extract: 'text',
					selector: 'div',
					format: 'number',
				},
			} as IEbriScrapConfig;

			const result = parse(html, config);

			expect(result).toEqual({ value: 12345.67 });
		});
		it('should throw when format = not existing', () => {
			const html = `<h1>Title</h1>`;

			const config = {
				title: {
					type: 'field',
					extract: 'text',
					format: 'not existing' as any,
					selector: 'h1',
				},
			} as IEbriScrapConfig;

			expect(() => parse(html, config)).toThrowError(
				'Invalid format config. Allowed values are string, number and date',
			);
		});
	});
});

describe('Array parser', () => {
	it('should work when children has a type = field', () => {
		const html = `
			<ul>
				<li>Value 1</li>
				<li>Value 2</li>
				<li>Value 3</li>
			</ul>`;

		const config = {
			values: {
				type: 'array',
				containerSelector: 'ul',
				itemSelector: 'li',
				children: {
					type: 'field',
					selector: 'li',
					extract: 'text',
				},
			},
		} as IEbriScrapConfig;

		const result = parse(html, config);

		expect(result).toEqual({
			values: ['Value 1', 'Value 2', 'Value 3'],
		});
	});
	it('should work when children has a type = group', () => {
		const html = `
			<ul>
				<li><a href="/value-1">Value 1</a></li>
				<li><a href="/value-2">Value 2</a></li>
				<li><a href="/value-3">Value 3</a></li>
			</ul>`;

		const config = {
			values: {
				type: 'array',
				containerSelector: 'ul',
				itemSelector: 'li',
				children: {
					type: 'group',
					containerSelector: 'a',
					children: {
						name: {
							type: 'field',
							selector: 'a',
							extract: 'text',
						},
						link: {
							type: 'field',
							selector: 'a',
							extract: 'prop',
							propertyName: 'href',
						},
					},
				},
			},
		} as IEbriScrapConfig;

		const result = parse(html, config);

		expect(result).toEqual({
			values: [
				{ name: 'Value 1', link: '/value-1' },
				{ name: 'Value 2', link: '/value-2' },
				{ name: 'Value 3', link: '/value-3' },
			],
		});
	});
	it('should work when children has a type = array', () => {
		const html = `
			<ul>
				<li>
					<p>Value 1.1</p>
					<p>Value 1.2</p>
				</li>
				<li>
					<p>Value 2.1</p>
					<p>Value 2.2</p>
				</li>
				<li>
					<p>Value 3.1</p>
					<p>Value 3.2</p>
				</li>
			</ul>`;

		const config = {
			values: {
				type: 'array',
				containerSelector: 'ul',
				itemSelector: 'li',
				children: {
					type: 'array',
					containerSelector: 'li',
					itemSelector: 'p',
					children: {
						type: 'field',
						selector: 'p',
						extract: 'text',
					},
				},
			},
		} as IEbriScrapConfig;

		const result = parse(html, config);

		expect(result).toEqual({
			values: [
				['Value 1.1', 'Value 1.2'],
				['Value 2.1', 'Value 2.2'],
				['Value 3.1', 'Value 3.2'],
			],
		});
	});
});

describe('Group parser', () => {
	it('should work with children of type = field', () => {
		const html = `
			<div>
				<h3>Header</h3>
				<p>Value</p>
			</div>`;

		const config = {
			data: {
				type: 'group',
				containerSelector: 'div',
				children: {
					header: {
						type: 'field',
						selector: 'h3',
						extract: 'text',
					},
					value: {
						type: 'field',
						selector: 'p',
						extract: 'text',
					},
				},
			},
		} as IEbriScrapConfig;

		const result = parse(html, config);

		expect(result).toEqual({
			data: { header: 'Header', value: 'Value' },
		});
	});
	it('should work with children of type = group', () => {
		const html = `
			<div>
				<h3>Header</h3>
				<p>Value 1</p>
				<p>Value 2</p>
				<p>Value 3</p>
			</div>`;

		const config = {
			data: {
				type: 'group',
				containerSelector: 'div',
				children: {
					header: {
						type: 'field',
						selector: 'h3',
						extract: 'text',
					},
					values: {
						type: 'group',
						containerSelector: 'div',
						children: {
							val1: {
								type: 'field',
								selector: 'p:nth-of-type(1)',
								extract: 'text',
							},
							val2: {
								type: 'field',
								selector: 'p:nth-of-type(2)',
								extract: 'text',
							},
							val3: {
								type: 'field',
								selector: 'p:nth-of-type(3)',
								extract: 'text',
							},
						},
					},
				},
			},
		} as IEbriScrapConfig;

		const result = parse(html, config);

		expect(result).toEqual({
			data: {
				header: 'Header',
				values: { val1: 'Value 1', val2: 'Value 2', val3: 'Value 3' },
			},
		});
	});
	it('should work with children of type = array', () => {
		const html = `
			<div>
				<h3>Header</h3>
				<p>Value 1</p>
				<p>Value 2</p>
				<p>Value 3</p>
			</div>`;

		const config = {
			data: {
				type: 'group',
				containerSelector: 'div',
				children: {
					header: {
						type: 'field',
						selector: 'h3',
						extract: 'text',
					},
					values: {
						type: 'array',
						containerSelector: 'div',
						itemSelector: 'p',
						children: {
							type: 'field',
							selector: 'p',
							extract: 'text',
						},
					},
				},
			},
		} as IEbriScrapConfig;

		const result = parse(html, config);

		expect(result).toEqual({
			data: {
				header: 'Header',
				values: ['Value 1', 'Value 2', 'Value 3'],
			},
		});
	});
});

describe('Wrong type parser', () => {
	it('should throw when type = not existing', () => {
		const html = `<h1>Title</h1>`;

		const config = {
			title: {
				type: 'not existing' as any,
				extract: 'text',
				selector: 'h1',
			},
		} as IEbriScrapConfig;

		expect(() => parse(html, config)).toThrowError(
			'Invalid config type. Allowed values are: array, group, field',
		);
	});
});
