const socketIO = require('socket.io');
const uuid = require('node-uuid');
const crypto = require('crypto');
const Emitter = require('events');
const AppRoom = require('./MediasoupRoom');

class SignalServer extends Emitter {
	constructor(server, config, appRoomfactory) {
		super();

		this.clientsToRooms = {};
		this.rooms = {};

		const io = socketIO.listen(server);
		io.sockets.on('connection', function (client) {

			client.on('join', name => {
				const room = this.getRoom(name);
				room.join(client);
				this.clientsToRooms[client.id] = name;
			});

			client.on('disconnect', () => this.clientDisconnect(client));
			client.on('leave', () => this.clientDisconnect(client));

		}.bind(this));
	}

	getRoom(roomName) {
		if (!this.rooms[roomName]) {
			this.rooms[roomName] = new AppRoom(roomName);
			this.emit('newroom', this.rooms[roomName]);
		}

		return this.rooms[roomName];
	}

	clientDisconnect(client) {
		if (this.clientsToRooms[client.id]) {
			this.getRoom(this.clientsToRooms[client.id]).leave(client);
			delete this.clientsToRooms[client.id];
		}
	}
}

//TODO do we need this?
function notifyTURNAndSTUN(client, config) {
	client.emit('stunservers', config.stunservers || []);

	// create shared secret nonces for TURN authentication
	// the process is described in draft-uberti-behave-turn-rest
	var credentials = [];
	// allow selectively vending turn credentials based on origin.
	var origin = client.handshake.headers.origin;
	if (!config.turnorigins || config.turnorigins.indexOf(origin) !== -1) {
		config.turnservers.forEach(function (server) {
			var hmac = crypto.createHmac('sha1', server.secret);
			// default to 86400 seconds timeout unless specified
			var username = Math.floor(new Date().getTime() / 1000) + (parseInt(server.expiry || 86400, 10)) + "";
			hmac.update(username);
			credentials.push({
				username: username,
				credential: hmac.digest('base64'),
				urls: server.urls || server.url
			});
		});
	}
	client.emit('turnservers', credentials);
}

module.exports = SignalServer;
