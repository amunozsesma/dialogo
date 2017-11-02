import getVideoStreamService from '../lib/VideoStreamService';
import AppConfig from './AppConfig';

export default class WebRTCMessageHandler {
	constructor(connection) {
		this.connection = connection;
		this.peerConnection = null;
	}

	init() {
		this.connection.on('server-webrtc-message', this.processMessage.bind(this));

		this.createPeerConnection();
		this.joinMediaRoom();
	}

	createPeerConnection() {
		this.peerConnection = new RTCPeerConnection(AppConfig['PEER_CONNECTION_CONFIG']);

		this.peerConnection.onaddstream = function(evt) {
			this.remoteStreamReceived(evt.stream);
		}.bind(this);

		this.peerConnection.onremovestream = function(evt) {
			this.remoteStreamRemoved(evt.stream);
		}.bind(this);

		this.peerConnection.ontrack = function() {
		};

		this.peerConnection.onsignalingstatechange = function(evt) {
		};
	}

	remoteStreamReceived(stream) {
		getVideoStreamService().addStream(stream);
	}

	remoteStreamRemoved(stream) {
		getVideoStreamService().removeStream(stream)
	}

	joinMediaRoom() {
		this.peerConnection.createOffer({
			offerToReceiveVideo: 1,
			offerToReceiveAudio: 1
		})

		.then(function (offer) {
			this.connection.emit('client-webrtc-message', {
				type: 'join',
				payload: offer
			});
		}.bind(this))

		.catch(this.mediaError);
	}

	processMessage(message) {
		switch(message.type) {
			case 'offer':
				this.onOffer(message.payload);
				break;
			case 'sendLocalStream':
				this.onSendLocalStream(message.payload);
				break;
			case 'removeLocalStream':
				this.onRemoveLocalStream(message.payload);
				break;
			default:
				console.log(`Message type not implemented ${message.type}`);
				break;
		}
	}

	onOffer(offer) {
		if (!this.peerConnection) {
			this.createPeer();
		}

		this.peerConnection.setRemoteDescription(offer).then(function () {
			return this.peerConnection.createAnswer();
		}.bind(this))

		.then(function (answer) {
			return this.peerConnection.setLocalDescription(answer);
		}.bind(this))

		.then(function () {
			this.connection.emit('client-webrtc-message', {
				type: 'answer',
				payload: this.peerConnection.localDescription
			})
		}.bind(this))

		.catch(logError);
	}

	onSendLocalStream(side) {
		navigator.mediaDevices.getUserMedia({
			audio: true,
			video: true
		})

		.then(function (stream) {

			const newVideoTrack = stream.getVideoTracks()[0];
			stream.addTrack(newVideoTrack);

			if (this.peerConnection.addTrack) {
				this.peerConnection.addTrack(newVideoTrack, stream);
			} else {
				this.peerConnection.addStream(stream);
				setTimeout(() => this.connection.emit('client-webrtc-message', { type: 'offerMe' }));
			}

			const videoStreamService = getVideoStreamService();
			videoStreamService.addLocalStream(side, stream);
		}.bind(this))

		.catch(logError);
	}

	onRemoveLocalStream(side) {
		getVideoStreamService().removeLocalStream(side);
	}
}

function logError(err) {
	console.log(`Error in WebERTMessageHandler: ${err}`);
}