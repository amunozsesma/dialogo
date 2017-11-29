const Emitter = require('events');

class Conversation extends Emitter {
	constructor(config) {
		super();
		this.config = config;
		
		this.participants = {
			'left': null,
			'right': null
		};

		this.intervalIds = {
			discussionTTL: null,
			left: {
				TTL: null
			},
			right: {
				TTL: null
			}
		};

		this.state = null;
		this.initState();
	}

	initState(conversationStart) {
		this.state = {
			discussionTTL: 0,
			left: {
				isTalking: false,
				TTL: 0
			},
			right: {
				isTalking: false,
				TTL: 0
			}
		};
		
		if (conversationStart) {
			const side = ['left', 'right'][Math.floor(Math.random()) + 1];

			this.state['discussionTTL'] = this.config.ttl;
			this.state['left'].TTL = this.config.turnTTL;
			this.state['right'].TTL = this.config.turnTTL;
			this.startTurnCounter(side);
		}
	}

	addPariticipant(side, participant) {
		this.participants[side] = participant;

		if (!this.config.waitForParticipants || (this.participants['left'] && this.participants['right'])) {
			this.startConversation();
		}		
	}

	removeParticipant(side) {
		if (side) {
			this.resetSide(side);
		}
		if (!this.participants['left'] && !this.participants['left']) {
			clearInterval(this.intervalIds['discussionTTL']);
			this.state['discussionTTL'] = 0;
		}
		this.emit('conversation-changed', this.getSnapshot());
		this.emit('turn-changed', this.getSnapshot());
		this.initState();
	}

	startConversation() {
		this.initState(true);
		this.startDiscussionCounter();

		this.participants['left'] && this.participants['left'].startConversation('left');
		this.participants['right'] && this.participants['right'].startConversation('right');
		this.emit('conversation-changed', this.getSnapshot());
	}

	getSnapshot() {
		return JSON.parse(JSON.stringify(this.state));
	}

	startDiscussionCounter() {
		clearInterval(this.intervalIds['discussionTTL']);
		this.intervalIds['discussionTTL'] = setInterval(() => this.state['discussionTTL'] -= 1000, 1000);
	}

	startTurnCounter(side) {
		this.state[side].isTalking = true;
		this.emit('turn-changed', this.getSnapshot());

		this.intervalIds[side]['TTL'] = setInterval(() => {
			this.state[side].TTL -= 1000;
			if (this.state[side].TTL <= 0) {
				this.state[side].TTL = this.config.turnTTL;
				clearInterval(this.intervalIds[side]['TTL']);
				this.state[side].isTalking = false;
				this.startTurnCounter(opositeSide(side));
			}
		}, 1000);


	}

	resetSide(side) {
		this.participants[side] = null;
		this.state[side].isTalking = false;
		this.state[side].TTL = 0;
		clearInterval(this.intervalIds[side]['TTL']);
	}

}

function opositeSide(side) {
	return side === 'left' ? 'right' : 'left';
}

module.exports = Conversation;
