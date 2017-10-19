import Emitr from './emitr';
import AppConfig from './AppConfig';
import Constants from './Constants';
import io from 'socket.io-client';
import Localmedia from 'localmedia';

export default class WebRTCHandler extends Emitr {
	constructor() {
		super();

		this.peerConnection = null;
		this.connection = io.connect(AppConfig['SIGNALING_SERVER_URL']); 
		this.localMedia = new Localmedia();
	}

	init() {
		this.connection.on('connect', function() {
			this.createPeer();
			joinMediaRoom.call(this);
		}.bind(this));

		this.connection.on('offer', function(offer) {
			if (!this.peerConnection) {
				this.createPeer();
			}

			console.log(offer);
			console.log('ice: ' + this.peerConnection.iceConnectionState)

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
		this.peerConnection.onnegotiationneeded = onnegotiationneeded.bind(this);
		this.peerConnection.onremovestream = function() {debugger;};
		this.peerConnection.onaddstream = function() {debugger;};
		this.peerConnection.ontrack = function() {debugger;};
		this.peerConnection.oniceconnectionstatechange = function() {console.log('ice: ' + this.peerConnection.iceConnectionState)}
	}

	destroy() {
	}

	joinRoom() {
	}

	leaveRoom() {
	}

	startConversation(callback) {
		navigator.mediaDevices.getUserMedia({ audio: true, video: true })
			.then(function (stream) {
				callback(stream);
		        // selfView.srcObject = stream;
		        debugger;
		        // this.peerConnection.addTrack(stream.getAudioTracks()[0], stream);
		        // this.peerConnection.addTrack(stream.getVideoTracks()[0], stream);
				try {
			        this.peerConnection.addStream(stream);
				} catch(e) {
					debugger;
				}

		    }.bind(this))
	        .catch(logError);
	}

	// Sends leave notification but stays in the room
	endConversation() {
		
	}

}

function joinMediaRoom() {
	this.peerConnection.createOffer().then(function (offer) {
		this.connection.emit('join', Constants['VIDEO_ROOMNAME'], offer);
	}.bind(this))
	.catch(logError);
}

function onnegotiationneeded() {
	debugger;
	this.connection.emit('onnegotiationneeded');
}

function logError(error) {
    console.log(error.name + ": " + error.message);
}

