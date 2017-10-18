const AppConfig = {
	SIGNALING_SERVER_URL: 'http://localhost:8888',
	PEER_CONNECTION_CONFIG: {
		iceServers: [{'urls': 'stun:stun.l.google.com:19302'}]
	},
	PEER_CONNECTION_CONSTRAINTS: {
		optional: []
	}
};

export default AppConfig;