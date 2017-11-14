const Emitter = require('events');
const ParticipantFactory = require('./ParticipantFactory');
const ParticipantQueue = require('./ParticipantQueue');
const Conversation = require('./Conversation');

class AppRoom extends Emitter {
	constructor(name) {
		super();

		this.roomName = name;
		this.participantFactory = new ParticipantFactory();

		this.participants = {};

		const config = {
			waitForParticipants: true,
			ttl: 20000,
			queueCapacity: 20,
			turnTtl: 10000
		}

		this.sideQueues = {
			left: new ParticipantQueue(config),
			right: new ParticipantQueue(config)
		};

		this.conversation = new Conversation(config);
		this.conversation.on('conversation-started',
			conversationState => this.spread(participant => participant.conversationInfo(conversationState))
		);
	}

	join(client) {
		const participant = this.participantFactory.getParticipant(this, client);
		this.participants[client.id] = participant;

		this.sendRemoteIDsToClient(client);
		participant.conversationInfo(this.conversation.getSnapshot());
		return participant;
	}

	addMe(participant, side) {
		this.sideQueues[side].add(participant, {
			onProcessing: function(opts) {
				this.conversation.addPariticipant(side, participant);
			}.bind(this),
			onFinished: function() {
				//TODO this is a workaround till can figure out why ontrackremoved is not working 
				// should be done in the conversation
				this.conversation.removeParticipant(this.whichSide(participant));
				this.spread(participant => participant.stopConversation(side));

			}.bind(this),
			onError: function() {

			}
		});
	}

	sendRemoteIDsToClient(client) {
		const streams = [].concat(this.getSideRemoteID('left'), this.getSideRemoteID('right'));
		client.emit('room-info', {streams: streams});
	}

	getSideRemoteID(side) {
		const participant = this.sideQueues[side].getCurrentParticipant();
		if (participant) {
			const mediaID = participant.getMediaID();

			return mediaID.map(
				media => {return {id: media, side: side}}
			);
		} else {
			return [];
		}

	}

	leave(client) {
		const participant = this.participants[client.id];

		if (participant) {
			this.conversation.removeParticipant(this.whichSide(participant));
			participant.leave();
			this.removeFromQueues(participant);
			delete this.participants[client.id];
		}
	}

	removeFromQueues(participant) {
		this.sideQueues['left'].remove(participant);
		this.sideQueues['right'].remove(participant);
	}

	spread(spreadFunc) {
		Object.keys(this.participants).forEach(key => spreadFunc(this.participants[key]));
	}

	spreadRemoteIDInfo() {
		this.spread(participant => this.sendRemoteIDsToClient(participant.client));
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

}

function oppositeSide(side) {
	return side === 'left' ? 'right' : 'left';
}

module.exports = AppRoom;
