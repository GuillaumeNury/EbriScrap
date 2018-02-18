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

Go to [Examples](./examples) to see EbriScrap in action.

## Documentation

### Configuration

Root EbriScrap configuration is a dictionary in which values are Field / Group or Array configuration item.

### Configuration Item

#### Field

In order to extract a single value, you have to use a field configuartion item.

| Key          | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type         | It must be `field` in order to configure a Field item                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| selector     | It should be a valid [Cheerio](https://github.com/cheeriojs/cheerio) / CSS selector. Example: `h1`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| extract      | Possibilities are: <br/> `text`: extract the innerText of selected node <br/> `html`: get raw HTML of the selected node <br/> `prop`: extract a property for the selected node (ex: extract href from a link) <br/> `css`: extract a style property from selected node                                                                                                                                                                                                                                                                                                                                               |
| propertyName | Mandatory **only** when extract is `prop` or `css`.<br/> The property that need to be extracted.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| format?      | _(optional)_ Possibilities are: <br/> `number`: strip all non number characters and parse as float <br/> `regex`: find and replace text with a config object like `{ type: 'regex', regex: '/a(.*)b/', output: '$1'}` <br/> `url`: add a base url if a link is absolute, pass an object like `{ type: 'url', baseUrl: 'https://www.google.com' }`<br/> `string`: default parser, it returns raw extracted value <br/> `one-line-string`: replace all new lines (`\n`), tabs (`\t`) and multi spaces with a single space <br/> `html-to-text`: replace `<br>`, `<p>`, `<div>` with new lines, and then, extract text. |

#### Group

In order to get nested object in parsing result, you have to use a group configuration item.

| Key               | Value                                                                                                                                          |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| type              | It must be `group` in order to configure a group item                                                                                          |
| containerSelector | It should be a valid [Cheerio](https://github.com/cheeriojs/cheerio) / CSS selector. It will be the root node for all children configurations. |
| children          | It is a dictionary in which values should be Field / Array or Group configuration item.                                                        |

#### Array

In order to get array of values in parsing result, you have to use an array configuration item.

| Key               | Value                                                                                                                                          |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| type              | It must be `array` in order to configure a array item                                                                                          |
| containerSelector | It should be a valid [Cheerio](https://github.com/cheeriojs/cheerio) / CSS selector. It will be the root node for all children configurations. |
| children          | It is a single Field / Array or Group configuration item.                                                                                      |

### Example

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
{
  type: 'field',
  selector: 'title',
  extract: 'text'
}
```

#### Library name

One again, it is a regular text field. We want to extract the text in the first `<td>`:

```javascript
{
  type: 'field',
  selector: 'td:first-of-type',
  extract: 'text'
}
```

#### Library link

This time, we want to get the link in the `href` property of the `<a>` in the second `<td>`:

```javascript
{
  type: 'field',
  selector: 'td:nth-of-type(2) a',
  extract: 'prop',
  propertyName: 'href'
}
```

#### Library

Now that we have name and url, we want to create an object with two keys (`name` and `url`):

```javascript
{
  type: 'group',
  containerSelector: 'tr',
  children: {
    name: { /* Library name configuration item */ },
    link: { /* Library link configuration item */ }
  },
}
```

#### Libraries

We want to apply librairy configuration on every `<tr>` in `<tbody>`:

```javascript
{
  type: 'array',
  containerSelector: 'tbody',
  itemSelector: 'tr',
  children: { /* Library configuration item */ }
}
```

#### Resulting configuration

Here is the full configuration:

```javascript
{
  name: {
    type: 'field',
    selector: 'title',
    extract: 'text'
  },
  librairies: {
    type: 'array',
    containerSelector: 'tbody',
    itemSelector: 'tr',
    children: {
      type: 'group',
      containerSelector: 'tr',
      children: {
        name: {
          type: 'field',
          selector: 'td:first-of-type',
          extract: 'text'
        },
        link: {
          type: 'field',
          selector: 'td:nth-of-type(2) a',
          extract: 'prop',
          propertyName: 'href'
        }
      },
    }
  }
}
```
