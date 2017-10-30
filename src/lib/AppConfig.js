import WebRTCClientImplementation from './MediasoupClient';

const AppConfig = {
	WEBRTC_CLIENT_IMPLEMENTATION: WebRTCClientImplementation,
	SIGNALING_SERVER_URL: '',
	PEER_CONNECTION_CONFIG: {
		iceServers: [{'urls': 'stun:stun.l.google.com:19302'}]
	},
	PEER_CONNECTION_CONSTRAINTS: {
		optional: []
	},
	VIDEO_ROOM_NAME: 'dialogoalafuerza'
};

export default AppConfig;