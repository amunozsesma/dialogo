const Emitter = require('events');
const ParticipantFactory = require('./ParticipantFactory');
const ParticipantQueue = require('./ParticipantQueue');

class AppRoom extends Emitter {
	constructor(name) {
		super();

		this.roomName = name;
		this.participantFactory = new ParticipantFactory();

		this.participants = {};
		this.sideQueues = {
			left: new ParticipantQueue(),
			right: new ParticipantQueue()
		};

		this.sideQueues['left'].start();
		this.sideQueues['right'].start();

	}

	join(client) {
		const participant = this.participantFactory.getParticipant(this, client);
		this.participants[client.id] = participant;

		this.sendRemoteIDsToClient(client);
		return participant;
	}

	addMe(participant, side) {
		this.sideQueues[side].add(participant, {
			onProcessing: function(opts) {
				Object.keys(this.participants).forEach(
					id => this.participants[id].streamInfo(side, opts.ttl)
				);

				participant.startConversation(side);
			}.bind(this),
			onFinished: function() {
				//TODO this is a workaround till can figure out why ontrackremoved is not working
				Object.keys(this.participants).forEach(
					id => this.participants[id].stopConversation(side)
				);
			}.bind(this),
			onError: function() {

			}
		});
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
		const participant = this.sideQueues[side].getCurrentParticipant();
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
		this.sideQueues['left'].remove(participant);
		this.sideQueues['right'].remove(participant);
	}

	spreadRemoteIDInfo() {
		Object.keys(this.participants).forEach(
			key => this.sendRemoteIDsToClient(this.participants[key].client)
		);
	}

	whichSide(participant) {
		if (this.sideQueues['left'].isParticipantInQueue(participant)) {
			return 'left';
		}
		if (this.sideQueues['right'].isParticipantInQueue(participant)) {
			return 'right';
		}
		return null;
	}

	spreadTurnInfo(side, isTalking) {
		this.sideQueues[side].getAllParticipants().forEach(
			participant => participant.turnInfo(side, isTalking)
		);
		this.sideQueues[oppositeSide(side)].getAllParticipants().forEach(
			participant => participant.turnInfo(oppositeSide(side), !isTalking)
		);
	}
}

function oppositeSide(side) {
	return side === 'left' ? 'right' : 'left';
}

module.exports = AppRoom;
