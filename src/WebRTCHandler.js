import Emitr from './emitr';
import AppConfig from './AppConfig';
import Constants from './Constants';
import io from 'socket.io-client';
import localmedia from 'localmedia';

export default class WebRTCHandler extends Emitr {
	constructor() {
		super();

		this.peerConnection = null;
		this.connection = io.connect(AppConfig['SIGNALING_SERVER_URL']); 
	}

	init() {
		this.connection.on('connect', function() {
			this.createPeer();
			onnegotiationneeded.call(this);
		}.bind(this));

		this.connection.on('offer', function(offer) {
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
				var str = JSON.stringify({ desc: this.peerConnection.localDescription });
				this.connection.emit('answer', str);
			}.bind(this))

			.catch(logError);

		}.bind(this));
	}

	createPeer() {
		this.peerConnection = new RTCPeerConnection(AppConfig['PEER_CONNECTION_CONFIG'], AppConfig['PEER_CONNECTION_CONSTRAINTS']);
		this.peerConnection.onnegotiationneeded = onnegotiationneeded.bind(this)
	}

	destroy() {
	}

	joinRoom() {
	}

	leaveRoom() {
	}

	startConversation() {
	}

	// Sends leave notification but stays in the room
	endConversation() {
		
	}

}

function onnegotiationneeded() {
	this.peerConnection.createOffer().then(function (offer) {
		this.connection.emit('join', Constants['VIDEO_ROOMNAME'], offer);
	}.bind(this))
	.catch(logError);
}

function logError(error) {
    console.log(error.name + ": " + error.message);
}

