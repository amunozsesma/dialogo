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
				TTL: null,
				turnTTL: null
			},
			right: {
				TTL: null,
				turnTTL: null
			}
		};

		this.state = this.createState();
	}

	createState(conversationStart) {
		let state = {
			discussionTTL: 0,
			left: {
				isTalking: false,
				TTL: 0,
				turnTTL: 0
			},
			right: {
				isTalking: false,
				TTL: 0,
				turnTTL: 0
			}
		};
		
		if (conversationStart) {
			const side = ['left', 'right'][Math.floor(Math.random()) + 1];
			state[side].isTalking = true;

			state['discussionTTL'] = this.config.ttl;
			state['left'].TTL = Math.floor(this.config.ttl / 2);
			state['right'].TTL = Math.floor(this.config.ttl / 2);
		}
		return state;
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

	}

	startConversation() {
		this.state = this.createState(true);
		this.createCounter(null, 'discussionTTL');

		this.participants['left'] && this.participants['left'].startConversation('left');
		this.participants['right'] && this.participants['right'].startConversation('right');
		this.emit('conversation-started', this.getSnapshot());
	}

	getSnapshot() {
		return JSON.parse(JSON.stringify(this.state));
	}

	createCounter(side, field) {
		if (side) {
			clearInterval(this.intervalIds[side][field]);
			this.intervalIds[side][field] = setInterval(() => this.state[side][field] -= 1000, 1000);
		} else {
			clearInterval(this.intervalIds[field]);
			this.intervalIds[field] = setInterval(() => this.state[field] -= 1000, 1000);
		}
	}

	resetSide(side) {
		this.participants[side] = null;
		this.state[side].isTalking = false;
		this.state[side].TTL = 0;
		this.state[side].turnTTL = 0;
		clearInterval(this.intervalIds[side]['TTL']);
		clearInterval(this.intervalIds[side]['turnTTL']);
	}

}

module.exports = Conversation;
