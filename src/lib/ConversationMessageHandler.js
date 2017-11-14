import getVideoStreamService from '../lib/VideoStreamService';

export default class ConversationMessageHandler {
	constructor(connection) {
		this.connection = connection;
	}

	init() {
		this.connection.on('server-conversation-message', this.processMessage.bind(this));
	}

	processMessage(message) {
		switch(message.type) {
			case 'conversationInfo':
				this.onConversationInfo(message.payload);
				break;
			default:
				console.log(`Message type not implemented ${message.type}`);
				break;
		}
	}

	onConversationInfo(payload) {
		getVideoStreamService().updateConversationInfo(payload);
	}
}