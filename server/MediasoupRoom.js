const AppRoom = require('./AppRoom');

class MediasoupRoom extends AppRoom {
	join(client) {
		const participant = super.join(client);
		participant.on('ready', () => this.emit('join', participant));
	}
}

module.exports = MediasoupRoom;