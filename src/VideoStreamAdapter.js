import Emitr from './emitr';
import AppConfig from './AppConfig';
import MediaSoupClient from './MediasoupClient';

export default class VideoStreamAdapter extends Emitr {
	constructor() {
		super();
		this.webRTCClient = new AppConfig['WEBRTC_CLIENT_IMPLEMENTATION']({
			mediaChanged: this.onMediaChanged.bind(this),
			mediaError: logError,
		});
	}

	init() {
		this.webRTCClient.init();
	}

	startConversation(side) {
		this.webRTCClient.requestLocalMedia(side);
	}

	onMediaChanged(side, message) {
		switch (message.type) {
			case 'addStream':
				this.trigger('addVideoStream', message.payload.stream, side, message.payload.isLocal);
				break;
			case 'removeStream':
				this.trigger('removeVideoStream', side);
				break
		}
	}
}

function logError(err) {
	console.log('Error in VideoStreamAdapter: ' + err);
}