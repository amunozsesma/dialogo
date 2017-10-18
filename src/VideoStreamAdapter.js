import Emitr from './emitr';
import WebRTCHandler from './WebRTCHandler';

export default class VideoStreamAdapter extends Emitr {
	init() {
		this.webRTCHandler = new WebRTCHandler();
		this.webRTCHandler.init();
	}

	startConversation(side) {
	}

	endConversation(side) {
	}

	addListeners() {
	}

	addVideo(videoEl) {
	}

	removeVideo(videoEl) {
	}

	getNextAvailableSide() {
	}

	whichSideIsVideoPlaying(videoEl) {
	}
}
