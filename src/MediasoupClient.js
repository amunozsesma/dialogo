import WebRTCClientImplementation from './WebRTCClientImplementation';
import AppConfig from './AppConfig';
import Constants from './Constants';
import io from 'socket.io-client';

export default class MediasoupClient extends WebRTCClientImplementation {
	constructor(config) {
		super(config);

		this.peerConnection = null;
		this.connection = io.connect(AppConfig['SIGNALING_SERVER_URL']);
	}

	onConnectionStablished() {
		this.createPeerConnection();
		this.joinMediaRoom();
	}

	onOfferReceived(offer) {
		// TODO probably removed as this shouldn't happen
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
			this.sendAnswer(this.peerConnection.localDescription);
		}.bind(this))

		.catch(this.mediaError);
	}

	onAnswerReceived() {
		// Do nothing as mediasoup initiates the coomunication
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
				setTimeout(() => this.sendSignalingEvent('offerMe'));
			}

			this.addLocalMedia(side, stream);
		}.bind(this))

		.catch(this.mediaError);
	}

	onRemoveLocalStream() {
		//TODO remove track from the stream I guess
	}

	createPeerConnection() {
		this.peerConnection = new RTCPeerConnection(AppConfig['PEER_CONNECTION_CONFIG']);

		this.peerConnection.onaddstream = function(evt) {
			this.remoteStreamReceived(evt.stream);
		}.bind(this);

		this.peerConnection.onremovestream = function(evt) {
			//TODO check what we receive
			// this.remoteStreamRemoved(evt);
		}.bind(this);
	}

	joinMediaRoom() {
		this.peerConnection.createOffer({
			offerToReceiveVideo: 1,
			offerToReceiveAudio: 1
		})

		.then(function (offer) {
			this.sendSignalingEvent('join', Constants['VIDEO_ROOMNAME'], offer);
		}.bind(this))

		.catch(this.mediaError);
	}
}
