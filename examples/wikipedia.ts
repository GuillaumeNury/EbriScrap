import fetch from 'node-fetch';
import { parse, TypedEbriScrapConfig } from '../index';

interface IWikipediaScrapResult {
	title: string;
	frameworks: string[];
}

export const config: TypedEbriScrapConfig<IWikipediaScrapResult> = {
	title: '#firstHeading',
	frameworks: [
		{
			containerSelector: '.colonnes ul',
			itemSelector: 'li',
			data: 'li',
		},
	],
};

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
