const Emitter = require('events');
const ParticipantFactory = require('./ParticipantFactory');

class AppRoom extends Emitter {
	constructor(name) {
		super();

		this.roomName = name;
		this.participantFactory = new ParticipantFactory();

		this.participants = {};
		this.currentConversation = {
			left: null,
			right: null
		};
	}

	join(client) {
		const participant = this.participantFactory.getParticipant(this, client);
		this.participants[client.id] = participant;

		this.sendRemoteIDsToClient(client);
		return participant;
	}

	addMe(participant, side) {
		this.currentConversation[side] = participant;

		// TODO QUEUE logic
		participant.startConversation(side);
	}

	sendRemoteIDsToClient(client) {
		let payload = [];
		const leftSideID = this.getSideRemoteID('left');
		const rightSideID = this.getSideRemoteID('right');

		leftSideID && payload.push(leftSideID);
		rightSideID && payload.push(rightSideID);

		client.emit('room-info', payload);
	}

	getSideRemoteID(side) {
		const participant = this.currentConversation[side];
		if (!participant) {
			return null;
		}

		return {
			id: participant.getMediaID(),
			side: side
		};
	}

	leave(client) {
		const participant = this.participants[client.id];

		if (participant) {
			participant.leave();
			this.removeFromQueues(participant);
			delete this.participants[client.id];
		}
	}

	removeFromQueues(participant) {
		if (this.leftConversation === participant) {
			this.leftConversation = null;
		}
		if (this.rightConversation === participant) {
			this.rightConversation = null;
		}
	}

	spreadRemoteIDInfo() {
		Object.keys(this.participants).forEach(
			key => this.sendRemoteIDsToClient(this.participants[key].client)
		);
	}
}

module.exports = AppRoom;
