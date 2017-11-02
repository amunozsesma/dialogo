import Emitr from './emitr';
import AppConfig from './AppConfig';

let videoStreamService = null;

class VideoStreamService extends Emitr {
	constructor() {
		super();

		this.remoteIDsToSides = {};
	}

	updateRoomInfo(roomInfo) {
		roomInfo.forEach(peerInfo =>
			this.remoteIDsToSides[peerInfo.id] = peerInfo.side
		);
	}

	startConversation(side) {
		this.trigger('startconversation', side);
	}

	addStream(stream, isLocal) {
		const side = this.remoteIDsToSides[stream.id];

		if (side) {
			this.trigger('addVideoStream', side, stream, isLocal);
		}
	}

	addLocalStream(side, stream) {
		this.trigger('addVideoStream', side, stream, true);
	}

	removeStream(stream) {
		const side = this.remoteIDsToSides[stream.id];

		if (side) {
			this.trigger('removeVideoStream', side);
			delete this.remoteIDsToSides[stream.id];
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
