# EbriScrap

EbriScrap is a tool that parse a HTML string, and return a JS object with all information that you need.

[![npm version](https://badge.fury.io/js/ebri-scrap.svg)](https://badge.fury.io/js/ebri-scrap)
[![Build Status](https://travis-ci.org/GuillaumeNury/EbriScrap.svg?branch=master)](https://travis-ci.org/GuillaumeNury/EbriScrap)
[![codecov](https://codecov.io/gh/GuillaumeNury/EbriScrap/branch/master/graph/badge.svg)](https://codecov.io/gh/GuillaumeNury/EbriScrap)
[![Known Vulnerabilities](https://snyk.io/test/github/guillaumenury/ebriscrap/badge.svg)](https://snyk.io/test/github/guillaumenury/ebriscrap)
[![Maintainability](https://api.codeclimate.com/v1/badges/46a9f88bc51242c708c6/maintainability)](https://codeclimate.com/github/GuillaumeNury/EbriScrap/maintainability)

## Installing

### With Yarn

`yarn add ebri-scrap`

### With NPM

`npm install ebri-scrap`

## Examples

Go to [Examples](./tests/cases) to see EbriScrap in action.

## Documentation

### Configuration

Root EbriScrap configuration can be a `string`, an `object`, or an `array`.

### Configuration Item

#### Field

In order to extract a single value, you have to use a field configuartion item.
You have to specify **one** selector, **up to one** extractor and **as many** formators as you want !

Here is an example: `"selector | extract:extractor1 | format:formator1 | format:formator2"`.

##### Selector

It should be a valid [Cheerio](https://github.com/cheeriojs/cheerio) / CSS selector. Example: `h1`.

##### Extractor

- `text` _(default)_: it calls `.innerText` on the HTML element matched by the selector.

  Example:

  ```javascript
  const html = '<div>Hello world</div>';

  const config = 'div'; // or const config = 'div | extract:text';

  parse(html, config); // Output: "Hello world"
  ```

- `html`: it returns the raw HTML of the HTML element matched by the selector.

  Example:

  ```javascript
  const html = '<div>Hello world</div>';

  const config = 'div | extract:html';

  parse(html, config); // Output: "<div>Hello world</div>"
  ```

- `prop`: it returns a property of the HTML element matched by the selector.

  Example:

  ```javascript
  const html = '<a href="/unicorn-world">Hello world</div>';

  const config = 'a | extract:prop:href';

  parse(html, config); // Output: "/unicorn-world"
  ```

- `css`: it returns a css of the HTML element matched by the selector. **Warning:** it only works with style property on the element !

  Example:

  ```javascript
  const html = '<div style="font-size: 42px">Hello world</div>';

  const config = 'a | extract:css:font-size';

  parse(html, config); // Output: "42px"
  ```

##### Formattors

- `number`: strip all no-digit characters and parse as float

  Example:

  ```javascript
  const html = '<div>42</div>';

  const config = 'div | format:number';

  parse(html, config); // Output: 42
  ```

- `regex`: find and replace with a text, using a regular expression.
  This formator needs two parameters: `format:<THE_REGEX>:<REPLACEMENT_STRING>`

  Example:

  ```javascript
  const html = '<div>42</div>';

  const config = 'div | format:regex:4(.*):$1';

  parse(html, config); // Output: 2
  ```

- `url`: add a base url if the path is relative
  This formator needs one parameter: `format:<BASE_URL>`

  Example:

  ```javascript
  const html = '<a href="/unicorn-world">Hello world</div>';

  /* WARNING: as https://one-fake-domain.com contains colons, quotes (single or double) are mandatory ! */
  const config =
   "a | extract:prop:href | format:url:'https://one-fake-domain.com'";

  parse(html, config); // Output: "https://one-fake-domain.com/unicorn-world"
  ```

- `html-to-text`: replace `<br>`, `<p>`, `<div>` with new lines, and then, returns text.

- `one-line-string`: replace all new lines (`\n`), tabs (`\t`) and multi spaces with a single space
- `trim`: remove leading and ending spaces

#### Group

A group configuration is a dictionary in which keys are the keys of the output object, and values are a piece of EbriScrapConfiguration (another group configuration, a field or an array configuration).

Example:

```javascript
const html = `
 <section>
  <h1>What a wonderful world</h1>
  <p>Lorem Ipsum...</p>
 </section>`;

const config = {
 title: 'h1',
 content: 'p',
};

parse(html, config); // Output: { title: 'What a wonderful world': content: 'Lorem Ipsum...' }
```

#### Array

Array configuration are a bit more complicated. It is an array, with a single item with additional information:

- `containerSelector`: the selector of the container (It should be a valid [Cheerio](https://github.com/cheeriojs/cheerio) / CSS selector.)
- `itemSelector`: the selector on which you want to iterate (It should be a valid [Cheerio](https://github.com/cheeriojs/cheerio) / CSS selector.)
- `data`: a Field/Group/Array configuration
- `includeSiblings`: _optional_ include siblings of selected item (see example below)

Example:

```javascript
const html = `
 <ul>
  <li>
   <p>Content 1</p>
  </li>
  <li>
   <p>Content 2</p>
  </li>
  <li>
   <p>Content 3</p>
  </li>
 </ul>`;

const config = [
 {
  containerSelector: 'ul',
  itemSelector: 'li',
  data: 'p',
 },
];

parse(html, config); // Output: ['Content 1', 'Content 2', 'Content 3']
```

```javascript
const html = `<body>
  <h1>Title 1</h1>
  <p>Text 1.1</p>
  <p>Text 1.2</p>
  <p>Text 1.3</p>

  <h1>Title 2</h1>
  <p>Text 2.1</p>
  <p>Text 2.2</p>
  <p>Text 2.3</p>
</body>`;

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

parse(html, config);
/* Output: [
  { title: 'Title 1', text: 'Text 1.1Text 1.2Text 1.3' },
  { title: 'Title 2', text: 'Text 2.1Text 2.2Text 2.3' },
] */
```

### Walkthrough example

Say we have the following HTML:

```html
<html>
  <head>
    <title>EbriScrap</title>
  </head>
  <body>
    <table>
      <thead>
        <tr>
          <th>JS Library</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Lodash</td>
          <td><a href="https://github.com/lodash/lodash">Github</a></td>
        </tr>
        <tr>
          <td>Cheerio</td>
          <td><a href="https://github.com/cheeriojs/cheerio">Github</a></td>
        </tr>
        <tr>
          <td>jQuery</td>
          <td><a href="https://github.com/jquery/jquery">Github</a></td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
```

And we want to get the following object:

```javascript
{
  name: 'EbriScrap',
  librairies: [
    {
      name: 'Lodash',
      link: 'https://github.com/lodash/lodash'
    },
    {
      name: 'Cheerio',
      link: 'https://github.com/cheeriojs/cheerio'
    },
    {
      name: 'jQuery',
      link: 'https://github.com/jquery/jquery'
    }
  ]
}
```

Here is what you have to do:

#### Name

It is a regular text field. We want to extract the text in `<title>`:

```javascript
const nameConfig = 'title';
```

#### Library name

One again, it is a regular text field. We want to extract the text in the first `<td>`:

```javascript
const libNameConfig = 'td:first-of-type';
```

#### Library link

This time, we want to get the link in the `href` property of the `<a>` in the second `<td>`:

```javascript
const libLinkConfig = 'td:nth-of-type(2) a | extract:prop:href';
```

#### Library

Now that we have name and url, we want to create an object with two keys (`name` and `url`):

```javascript
{
  name: /* Library name configuration item */,
  link: /* Library link configuration item */
}

// so we have:
{
  name: 'td:first-of-type',
  link: 'td:nth-of-type(2) a | extract:prop:href'
}
```

#### Libraries

We want to apply librairy configuration on every `<tr>` in `<tbody>`:

```javascript
[
  {
    containerSelector: 'tbody',
    itemSelector: 'tr',
    data: /* Library configuration item */
  }
]
```

#### Resulting configuration

Here is the full configuration:

```javascript
{
  name: 'title',
  librairies: [
      {
        containerSelector: 'tbody',
        itemSelector: 'tr',
        data: {
          name: 'td:first-of-type',
          link: 'td:nth-of-type(2) a | extract:prop:href'
        },
      }
  ]
}
```
