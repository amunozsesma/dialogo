import Emitr from './emitr';
import AppConfig from './AppConfig';
import MediaSoupClient from './MediasoupClient';

let videoStreamService = null;

class VideoStreamService extends Emitr {
	constructor() {
		super();

		this.remoteIDsToSides = {};
	}

	initRoomInfo(roomInfo) {
		roomInfo.forEach(peerInfo =>
			this.remoteIDsToSides[peerInfo.id] = peerInfo.side
		);
	}

	startconversation(side) {
		this.trigger('startconversation', side);
	}

	addStream(stream, isLocal) {
		const side = this.remoteIDsToSides[stream.id];

		if (side) {
			this.trigger('addVideoStream', side, stream, isLocal);
		}
	}

	removeStream(stream) {
		const side = this.remoteIDsToSides[stream.id];

		if (side) {
			this.trigger('removeVideoStream', side);
			delete this.remoteIDsToSides[id];
		}
	}

	removeLocalStream(side) {
		this.trigger('removeVideoStream', side);
	}

	updatePositionInQueue(side, position) {

	}
}

function logError(err) {
	console.log('Error in VideoStreamService: ' + err);
}

export default function getVideoStreamService() {
	if (!videoStreamService) {
		videoStreamService = new VideoStreamService();
	}

	return videoStreamService;
}
