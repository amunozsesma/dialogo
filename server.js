const path = require('path');
const webpack = require('webpack');
const express = require('express');
const wbpconfig = require('./webpack.config');
const yetify = require('yetify');
const config = require('getconfig');
const fs = require('fs');
const SignalServer = require('./server/SignalServer');
const mediaserver = require('./server/MediasoupServer');
const port = parseInt(process.env.PORT || config.server.port, 10);
const server_handler = function (req, res) {
	res.writeHead(404);
	res.end();
};

const compiler = webpack(wbpconfig);
const server = express()
	.use(require('webpack-dev-middleware')(compiler, {
		publicPath: wbpconfig.output.publicPath
	}))
	.use(require('webpack-hot-middleware')(compiler))
	.get('*', function(req, res) {
		res.sendFile(path.join(__dirname, 'index.html'));
	})
	.listen(port, function(err) {
		if (err) {
			return console.error(err);
		}
	});


const signalServer = new SignalServer(server, config);
mediaserver(signalServer);

console.log('started on localhost:' + port);
