const Emitter = require('events');

class Participant extends Emitter {
	constructor(room, client) {
		super();

		this.room = room;
		this.client = client;
		this.client.on('client-queue-message', this.processQueueMessage.bind(this))
	}

	processQueueMessage(message) {
		switch(message.type) {
			case 'addMeToQueue':
				this.onAddMeToQueue(message.payload);
				break;
			default:
				//TODO add loggin
				break;
		}
	}

	onAddMeToQueue(side) {
		this.room.addMe(this, side);
	}

	startConversation(side) {
		this.client.emit('server-webrtc-message', {
			type: 'sendLocalStream',
			payload: side
		})
	}

	leave() {
		//TODO maybe send remove localstream
	};

}

module.exports = Participant;