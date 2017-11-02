import getVideoStreamService from '../lib/VideoStreamService';

export default class QueueMessageHandler {
	constructor(connection) {
		this.connection = connection;
	}

	init() {
		this.connection.on('server-queue-message', this.processMessage.bind(this));

		getVideoStreamService().on(
			'startconversation',
			side => this.connection.emit('client-queue-message', {type: 'addMeToQueue', payload: side}),
			this
		);
	}

	processMessage(message) {
		switch(message.type) {
			case 'positionInQueue':
				break;
			case 'remoteStreamInfo':
				break;
			default:
				console.log(`Message type not implemented ${message.type}`);
				break;
		}
	}

}