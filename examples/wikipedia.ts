import { IEbriScrapConfig, parse } from '../index';

import fetch from 'node-fetch';

const config = {
	title: {
		type: 'field',
		selector: '#firstHeading',
		extract: 'text',
	},
	frameworks: {
		type: 'array',
		containerSelector: '.colonnes ul',
		itemSelector: 'li',
		field: {
			type: 'field',
			selector: 'li',
			extract: 'text',
		},
	},
} as IEbriScrapConfig;

const url = 'https://fr.wikipedia.org/wiki/Node.js';

fetch(url)
	.then(d => d.text())
	.then(d => parse(d, config))
	.then(d => console.log('Result', d));

/**
 * OUTPUT
 *
 * Result { title: 'Node.js',
 *  frameworks:
 *   [ 'Express',
 *     'kraken.js',
 *     'Hapi.js',
 *     'Koa.js',
 *     'TotalJS',
 *     'Locomotive',
 *     'TWEE.IO',
 *     'Flatiron',
 *     'diet.js',
 *     'SailsJS',
 *     'Nodal',
 *     'Adonis',
 *     'Trails',
 *     'Strapi',
 *     'RhapsodyJS',
 *     'Compound.js',
 *     'ThinkJS',
 *     'Geddy',
 *     'Meteor',
 *     'DerbyJS',
 *     'GeddyJS',
 *     'TowerJS',
 *     'Mean.js et Mean.io',
 *     'Mojito',
 *     'Feathers',
 *     'Keystone',
 *     'Knockout.js',
 *     'SocketStream',
 *     'seneca.js',
 *     'Catberry',
 *     'AllcountJS.',
 *     'Flatiron',
 *     'Connect',
 *     'Socket.IO',
 *     'Noda',
 *     'RESTify',
 *     'Frisby',
 *     'Partial.js',
 *     'Raddish',
 *     'Fortune.js',
 *     'percolator',
 *     'Ionic',
 *     'Devisjs (en)' ] }
 *
 */
