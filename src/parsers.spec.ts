import { parse } from './parsers';

describe('Field parser', () => {
	describe('Extract types', () => {
		it('should work when extract = text', () => {
			const html = `<h1>Title</h1>`;

			const config = 'h1';

			const result = parse(html, config);

			expect(result).toEqual('Title');
		});
		it('should work when extract = prop', () => {
			const html = `<a href="a-super-link">Link</a>`;

			const config = 'a | extract:prop:href';

			const result = parse(html, config);

			expect(result).toEqual('a-super-link');
		});
		it('should work when extract = html', () => {
			const html = `<div><a href="a-super-link">Link</a></div>`;

			const config = 'div | extract:html';

			const result = parse(html, config);

			expect(result).toEqual('<a href="a-super-link">Link</a>');
		});
		it('should work when extract = css', () => {
			const html = `<div style="color: white"></div>`;

			const config = 'div | extract:css:color';

			const result = parse(html, config);

			expect(result).toEqual('white');
		});
	});
	describe('Format types', () => {
		it('should work when format = string', () => {
			const html = `<div>A Text</div>`;

			const config = 'div | format:string';

			const result = parse(html, config);

			expect(result).toEqual('A Text');
		});
		it('should work when format = one-line-string', () => {
			const html = `
				<div>
					<p>A</p>	
					<p>multiline</p>	
					<p>text</p>	
				</div>`;

			const config = 'div | format:one-line-string';

			const result = parse(html, config);

			expect(result).toEqual('A multiline text');
		});
		it('should work when format = number', () => {
			const html = `<div>12 345.67 €</div>`;

			const config = 'div | format:number';

			const result = parse(html, config);

			expect(result).toEqual(12345.67);
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

		const config = [
			{
				containerSelector: 'ul',
				itemSelector: 'li',
				data: 'li',
			},
		];

		const result = parse(html, config);

		expect(result).toEqual(['Value 1', 'Value 2', 'Value 3']);
	});
	it('should work when children has a type = group', () => {
		const html = `
			<ul>
				<li><a href="/value-1">Value 1</a></li>
				<li><a href="/value-2">Value 2</a></li>
				<li><a href="/value-3">Value 3</a></li>
			</ul>`;

		const config = [
			{
				containerSelector: 'ul',
				itemSelector: 'li',
				data: {
					name: 'a',
					link: 'a | extract:prop:href',
				},
			},
		];

		const result = parse(html, config);

		expect(result).toEqual([
			{ name: 'Value 1', link: '/value-1' },
			{ name: 'Value 2', link: '/value-2' },
			{ name: 'Value 3', link: '/value-3' },
		]);
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

		const config = [
			{
				containerSelector: 'ul',
				itemSelector: 'li',
				data: [
					{
						containerSelector: 'li',
						itemSelector: 'p',
						data: 'p',
					},
				],
			},
		];

		const result = parse(html, config);

		expect(result).toEqual([
			['Value 1.1', 'Value 1.2'],
			['Value 2.1', 'Value 2.2'],
			['Value 3.1', 'Value 3.2'],
		]);
	});
	it('should work when using includeSiblings', () => {
		const html = `
			<body>
				<section>
					<h1>Title 1</h1>
					<p>Text 1.1</p>
					<p>Text 1.2</p>
					<p>Text 1.3</p>
					<h1>Title 2</h1>
					<p>Text 2.1</p>
					<p>Text 2.2</p>
					<p>Text 2.3</p>
				</section>
				<footer>Not this text</footer>
			</body>
		`;

		const config = [
			{
				containerSelector: 'section',
				itemSelector: 'h1',
				includeSiblings: true,
				data: {
					title: 'h1',
					text: 'p'
				},
			},
		];

		const result = parse(html, config);

		expect(result).toEqual(
			[
				{ title: 'Title 1', text: 'Text 1.1Text 1.2Text 1.3' },
				{ title: 'Title 2', text: 'Text 2.1Text 2.2Text 2.3' },
			]
		);
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
			header: 'h3',
			value: 'p',
		};

		const result = parse(html, config);

		expect(result).toEqual({
			header: 'Header',
			value: 'Value',
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
			header: 'h3',
			values: {
				val1: 'p:nth-of-type(1)',
				val2: 'p:nth-of-type(2)',
				val3: 'p:nth-of-type(3)',
			},
		};

		const result = parse(html, config);

		expect(result).toEqual({
			header: 'Header',
			values: { val1: 'Value 1', val2: 'Value 2', val3: 'Value 3' },
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
			header: 'h3',
			values: [
				{
					containerSelector: 'div',
					itemSelector: 'p',
					data: 'p',
				},
			],
		};

		const result = parse(html, config);

		expect(result).toEqual({
			header: 'Header',
			values: ['Value 1', 'Value 2', 'Value 3'],
		});
	});
});
