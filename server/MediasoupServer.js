const mediasoup = require("mediasoup");
const RTCPeerConnection = mediasoup.webrtc.RTCPeerConnection;

module.exports = function(signalServer) {
	// Create a mediasoup Server.
	const mediaServer = mediasoup.Server({
		logLevel   : "debug",
		rtcIPv4    : true,
		rtcIPv6    : true,
		rtcMinPort : 40000,
		rtcMaxPort : 49999
	});

	// Room options.
	const roomOptions = {
		mediaCodecs : [
			{
				kind        : "audio",
				name        : "audio/opus",
				clockRate   : 48000,
				payloadType : 100
			},
			{
				kind        : "video",
				name        : "video/vp8",
				clockRate   : 90000,
				payloadType : 123
			}
		]
	};

	signalServer.on("newroom", (appRoom) => {
		mediaServer.createRoom(roomOptions)
			.then((mediaRoom) => {
				handleRoom(appRoom, mediaRoom);
		});
	});
	
	function handleRoom(appRoom, mediaRoom) {
		appRoom.on("join", (participant, request) => {
			handleParticipant(participant, request, appRoom, mediaRoom);
		});

		appRoom.onRoomReady();
	}

	function handleParticipant(participant, request, appRoom, mediaRoom) {
		let mediaPeer = mediaRoom.Peer(participant.username);
		let peerconnection = new RTCPeerConnection({
			peer     : mediaPeer,
			usePlanB : participant.usePlanB,
			peerTransport: {
				udp : true,
				tcp : true
			}
		});

		participant.setPeerConnection(peerconnection);

		peerconnection.setCapabilities(participant.capabilities)

		.then(() => {
			sendSdpOffer(participant, peerconnection, appRoom);
		})

		.catch((error) => {
			// request.reject(error);
			request.destroy();

			// And also close the RTCPeerConnection.
			peerconnection.close();
		});

		peerconnection.on("negotiationneeded", () => {
			sendSdpOffer(participant, peerconnection, appRoom);
		});

		participant.on("offerMe", () => {
			sendSdpOffer(participant, participant.peerConnection, appRoom);
		});

		participant.on('leave', () => {
			peerconnection.close();
		});

		participant.on('answer', (data) => {
			participant.peerConnection.setRemoteDescription(data);
		});

		mediaPeer.on('newrtpsender', (rtpSender) => {
			appRoom.spreadRemoteIDInfo();
		});

		mediaPeer.on('newrtpreceiver', (rtpReceiver) => {
			appRoom.spreadRemoteIDInfo();
		});
	}

	function sendSdpOffer(participant, peerconnection, appRoom) {
		peerconnection.createOffer({
			offerToReceiveAudio : 1,
			offerToReceiveVideo : 1
		})

		.then((desc) => {
			return peerconnection.setLocalDescription(desc);
		})

		.then(() => {
			return participant.send({
				type: 'offer',
				payload: peerconnection.localDescription.serialize()
			});
		})

		.catch((error) => {
			peerconnection.reset();
		});
	}
}
