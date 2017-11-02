const Participant = require('./Participant');

class MediasoupParticipant extends Participant {
	constructor(room, client) {
		super(room, client);

		this.client = client;
		this.client.on('client-webrtc-message', this.processWebRTCMessage.bind(this));

		// Mediasoup required properties
		this.username = client.id;
		this.usePlanB = true;
		this.capabilities = null;
		this.peerConnection = null;
		this.request = this.client.conn.transport;
	}

	processWebRTCMessage(message) {
		switch(message.type) {
			case 'join':
				this.onJoin(message.payload);
				break;
			case 'offerMe':
				this.onOfferMe();
				break;
			case 'answer':
				this.onAnswer(message.payload);
				break;
			default:
				//TODO add some logging
				break;
		}
	}

	getMediaID() {
		if (this.peerConnection) {
			const peer = this.peerConnection.peer;
			const rtpParameters = peer.rtpReceivers[0].rtpParameters;

			return (rtpParameters) ? rtpParameters.userParameters.msid.split(/\s/)[0] : null;
		}
	}

	onJoin(offer) {
		this.capabilities = offer.sdp;
		this.emit('ready', this);
	}

	onOfferMe() {
		this.emit('offerMe', this);
	}

	onAnswer(answer) {
		this.emit('answer', answer);
	}

	leave() {
		super.leave();
		this.emit('leave', this);
	}

	offer(offer) {
		this.client.emit('server-webrtc-message', {
			type: 'offer',
			payload: offer
		});
	}
}

module.exports = MediasoupParticipant;
