
import io from 'socket.io-client';
import AppConfig from './AppConfig';
import Constants from './Constants';

export default class WebRTCClientImplementation {
	constructor(config) {
		this.connection = io.connect(AppConfig['SIGNALING_SERVER_URL']);

		this.mediaChanged = config.mediaChanged;
		this.mediaError = config.mediaError;

		this.remoteIDsToSides = {};
		this.remoteInfoReceived = false;

		this.pendingStreams = [];
	}

	init() {
		this.connection.on('connect', () => {

			this.connection.emit('requestRemoteIDs', Constants['VIDEO_ROOMNAME']);

			this.connection.on('offer', this.onOfferReceived.bind(this));

			this.connection.on('answer', this.onAnswerReceived.bind(this));

			this.connection.on('remoteStreamInfo', this.onRemoteStreamInfo.bind(this));

			this.connection.on('sendLocalStream', this.onSendLocalStream.bind(this));

			this.connection.on('removeLocalStream', this.onRemoveLocalStream.bind(this));
		});

	}

	sendAnswer(answer) {
		this.connection.emit('answer', answer);
	}

	sendOffer(offer) {
		this.connection.emit('offer', offer);
	}

	requestLocalMedia(side) {
		this.connection.emit('addMeToQueue', side);
	}

	addLocalMedia(side, stream) {
		this.mediaChanged(side, {
			type: 'addStream',
			payload: {
				stream: stream,
				isLocal: true
			}
		});
	}

	removeLocalMedia() {
		// TODO implement
	}

	remoteStreamReceived(stream) {
		const side = this.remoteIDsToSides[stream.id];

		if (side) {
			this.mediaChanged(side, {
				type: 'addStream',
				payload: {stream: stream}
			});
		} else {
			this.pendingStreams.push(stream);
		}
	}

	// TODO check what is sent
	remoteStreamRemoved(stream) {
		const side = this.remoteIDsToSides[stream.id];
		if (side) {
			this.mediaChanged(side, {
				type: 'removeStream'
			});
		}

		delete this.remoteIDsToSides[stream.id];
	}

	onConnectionStablished() {}

	onOfferReceived() {}

	onAnswerReceived() {}

	onSendLocalStream() {}

	onRemoveLocalStream(side) {
		this.mediaChanged(side, {
			type: 'removeStream'
		});
	}

	initMediaConnection() {
	}

	onRemoteStreamInfo(message) {
		switch(message.type) {
			case 'assignRemoteIDs':
				message.payload.forEach(remotePeerInfo =>
					this.remoteIDsToSides[remotePeerInfo.id] = remotePeerInfo.side
				);

				this.flushPendingStreams();

				if (!this.remoteInfoReceived) {
					this.onConnectionStablished();
					this.remoteInfoReceived = true;
				}
				break;
			default:
				throw new Error('Message type unknown: ' + message.type);
				break;
		}
	}

	sendSignalingEvent(eventName, ...payload) {
		this.connection.emit(eventName, ...payload);
	}

	flushPendingStreams() {
		let streamIndexesRemoved = [];

		this.pendingStreams.forEach((stream, index) => {
			const side = this.remoteIDsToSides[stream.id];

			if (side) {
				this.mediaChanged(side, {
					type: 'removeStream'
				});
				streamIndexesRemoved.push(index)
			}
		});

		streamIndexesRemoved.forEach(index => this.pendingStreams.splice(index, 1));
	}

}