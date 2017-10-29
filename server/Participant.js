const Emitter = require('events');

class Participant extends Emitter {
	constructor(client, offer) {
		super();
		this.client = client;
		this.username = client.id;
		this.usePlanB = true;
		this.capabilities = offer.sdp;
		this.peerConnection = null;

		this.addClientListeners();
	}

	addClientListeners() {
		this.client.on('answer', data => this.emit('answer', data));
		this.client.on('offer', data => this.emit('offer', data));
		this.client.on('offerMe', () => this.emit('offerMe'));
		this.client.on('addMeToQueue', side => this.emit('addToQueue', side));
	}

	send(message) {
		switch(message.type) {
			case 'offer':
				this.client.emit('offer', message.payload);
				break;
			case 'answer':
				break;
			case 'participate':
				this.client.emit('sendLocalStream', message.payload);
				break;
			default:
				throw new Error('Unknown message type: ' + message.type);
				break;
		}


	}

	getRequest() {
		return this.client.conn.transport;
	}

	setPeerConnection(peerConnection) {
		this.peerConnection = peerConnection;
	}

	leave() {
		this.emit('leave');
	}
}

module.exports = Participant;