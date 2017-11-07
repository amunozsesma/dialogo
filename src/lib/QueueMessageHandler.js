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
				this.onPositionInQueue(message.payload);
				break;
			case 'remoteStreamInfo':
				this.onRemoteStreamInfo(message.payload);
				break;
			default:
				console.log(`Message type not implemented ${message.type}`);
				break;
		}
	}

	onPositionInQueue(payload) {
		getVideoStreamService().updatePositionInQueue(payload.side, payload.position);
	}

	onRemoteStreamInfo(payload) {
		getVideoStreamService().remoteStreamInfo(payload.side, payload.ttl);
	}

}