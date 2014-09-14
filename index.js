// # index.js
// ### simple http server to serve static files and simple api
// specifically configured to serve Emebr source code to Traceur compiler
//
"use strict";
var http         = require('http'),
	url          = require('url'),
	cdn          = require('node-static'),
	pub_server   = new cdn.Server('./public', { cache: 0 }),
	lib_server   = new cdn.Server('./bower_components');

http.createServer(function (req, res) {
	var parsed   = url.parse(req.url),
		blocks   = parsed.pathname.split('/'),
		log_info = '',
		server   = lib_server,
		parts;

	function parse_main_parts (parts) {
		if (parts.length > 1) {
			parts[1] = parts.splice(1).join('/');
			if (parts[1].indexOf('.js') !== parts[1].length -3 ) {
				parts[1] += '.js';
			}
		} else {
			parts[1] = 'main.js';
			if (parts[0].indexOf('.js') === parts[0].length -3 ) {
				parts[0] = parts[0].substring(0, parts[0].length -3);
			}
		}
		return parts;
	}

	switch (blocks[1].toLowerCase()) {
		case 'lib':
			req.url = req.url.substring(4, req.url.length);
			log_info = "Lib request";
			break;
		case 'ember-lib':
			req.url = req.url.substring(10, req.url.length);
			/* falls through */
		case 'route-recognizer.js':
		case 'route-recognizer':
		case 'router':
			req.url = req.url.substring(1, req.url.length);

			parts = req.url.split('/');
			if (parts.length > 1) {
				parts[1] = parts.join('/');
			} else {
				parts[1] = parts[0];
			}

			if (parts[1].indexOf('.js') !== parts[1].length -3 ) {
				parts[1] += '.js';
			}
			if (parts[0].indexOf('.js') === parts[0].length -3 ) {
				parts[0] = parts[0].substring(0, parts[0].length -3);
			}
			if (parts[0] === 'router') {
				parts[0] += '.js';
			}
			req.url =  parts[0] + '/lib/' +  parts[1];
			log_info = 'Ember Lib Call';
			break;
		default:
			if (req.url.indexOf('/ember') === 0 || req.url.indexOf('/container') === 0) {
				parts = req.url.substring(1,req.url.length).split('/');
				parts = parse_main_parts(parts);
				log_info = 'Ember Lib Call';
				req.url = 'ember/packages/' + parts[0] + '/lib/'+ parts[1];
			} else if (req.url.indexOf('/morph') === 0) {
				parts = req.url.substring(1,req.url.length).split('/');
				parts = parse_main_parts(parts);
				req.url = 'htmlbars/packages/' + parts[0] + '/lib/'+ parts[1];
				log_info = 'Morph Lib Call';
			} else if (req.url.indexOf('/backburner') === 0) {
				parts = req.url.substring(1,req.url.length).split('/');
				if (parts.length > 1) {
					parts[1] = parts.splice(1).join('/');
					if (parts[1].indexOf('.js') !== parts[1].length -3 ) {
						parts[1] += '.js';
					}
				}
				req.url = 'backburner/lib/' + parts[0] + (parts[1]? '/' + parts[1]:'');
				log_info = 'Backburner Lib Call';
			} else {
				log_info = 'Static Call';
				server = pub_server;
			}
	}
	console.log(log_info, req.url);
	req.addListener('end', function () {
		server.serve(req, res);
	}).resume();

}).listen(3000);
