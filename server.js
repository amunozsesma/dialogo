const path = require('path');
const webpack = require('webpack');
const express = require('express');
const wbpconfig = require('./webpack.config');
const yetify = require('yetify');
const config = require('getconfig');
const fs = require('fs');
// const http = require('http');
// const https = require('https');
const SignalServer = require('./server/SignalServer');
const mediaserver = require('./server/MediasoupServer');
const port = parseInt(process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || config.server.port, 10);
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

// const httpServer = http.createServer(server);
// const httpsServer = https.createServer(<dtls credentials>, server);


const signalServer = new SignalServer(server, config);
mediaserver(signalServer);

console.log('started on localhost:' + port);
