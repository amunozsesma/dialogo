const Emitter = require('events');
const Participant = require('./Participant');

class AppRoom extends Emitter {
	constructor(name) {
		super();

		this.roomName = name;
		this.isRoomReady = false;
		this.pendingClientsToFlush = {};

		this.allParticipants = [];
		this.participantsInSideQueue = {
			'left': [],
			'right': []
		};

		this.leftConversation = null;
		this.rightConversation = null;
	}

	onRoomReady() {
		if (!this.isRoomReady) {
			this.isRoomReady = true;
			flushPendingClients.call(this);
		}
	}

	join(client, offer) {
		const participant = new Participant(client, offer);
		this.addParticipantListeners(participant);

		if (isParticipantInQueue(participant, this.allParticipants)) {
			return;
		}
		this.allParticipants.push(participant);

		if (this.isRoomReady) {
			this.emit('join', participant, participant.getRequest());
		} else {
			this.pendingClientsToFlush[client.id] = {};
			this.pendingClientsToFlush[client.id].participant = participant;
		}
	}

	removeClient(client) {
		const participant = this.getPariticipant(client);

		if (participant) {
			participant.leave();
			this.removeFromQueues(participant);
		}

	}

	addParticipantListeners(participant) {
		participant.on('addToQueue', side => {
			//TODO this will need some decision logic to indicate when to particpate
			this[side + 'Conversation'] = participant;
			participant.send({
				type: 'participate',
				payload: side
			});
		});
	}

	canParticipantQueueUp(participant, side) {
		return !isParticipantInQueue(participant, this.participantsInSideQueue['left'])
			&& !isParticipantInQueue(participant, this.participantsInSideQueue['right']);
	}

	sendRemoteIDsToClient(client) {
		let payload = [];
		const leftSideID = getSideRemoteID(this.leftConversation, 'left');
		const rightSideID = getSideRemoteID(this.rightConversation, 'right');

		leftSideID && payload.push(leftSideID);
		rightSideID && payload.push(rightSideID);

		client.emit('remoteStreamInfo', {
			type: 'assignRemoteIDs',
			payload: payload
		});
	}

	spreadRemoteIDInfo() {
		this.allParticipants.forEach(participant => this.sendRemoteIDsToClient(participant.client));
	}

	getPariticipant(client) {
		return this.allParticipants.reduce(function(acc, participant) {
			return (client.id === participant.username) ? participant : acc;
		}, null);
	}

	removeFromQueues(participant) {
		if (this.leftConversation === participant) {
			this.leftConversation = null;
		}
		if (this.rightConversation === participant) {
			this.rightConversation = null;
		}

		this.allParticipants.splice(this.allParticipants.indexOf(participant), 1);

		//TODO remove from side queue
	}

}

function getSideRemoteID(participant, side) {
	if (!participant) {
		return null;
	}

	const peer = participant.peerConnection.peer;
	const rtpParameters = peer.rtpReceivers[0].rtpParameters;
	if (!rtpParameters) {
		return null;
	}
	const mediaStreamId = rtpParameters.userParameters.msid.split(/\s/)[0];

	return {
		id: mediaStreamId,
		side: side
	};
}

function isParticipantInQueue(participant, queue) {
	return queue.some(function(queueParticipant) {
		return queueParticipant.username === participant.username;
	})
}

function flushPendingClients() {
	Object.keys(this.pendingClientsToFlush).forEach(clientId => {
		const pendingClient = this.pendingClientsToFlush[clientId];
		this.emit('join', pendingClient.participant, pendingClient.participant.getRequest());
	}, this);
	this.pendingClientsToFlush = {};
}

module.exports = AppRoom;