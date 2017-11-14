import Emitr from './emitr';
import AppConfig from './AppConfig';

let videoStreamService = null;

class VideoStreamService extends Emitr {
	constructor() {
		super();

		this.remoteIDsToSides = {};
	}

	updateRoomInfo(roomInfo) {
		if (roomInfo.streams) {
			roomInfo.streams.forEach(peerInfo =>
				this.remoteIDsToSides[peerInfo.id] = peerInfo.side
			);
		}

		this.trigger('roomInfo', roomInfo)
	}

	updateConversationInfo(conversationInfo) {
		console.log(`received conversation info with ttl ${conversationInfo.discussionTTL}`);
		this.trigger('conversationInfo', conversationInfo);
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
		this.trigger('removeVideoStream', side, true);
	}

	updatePositionInQueue(side, position) {
		this.trigger('updatePositionInQueue', side, position);
	}

	remoteStreamInfo(side, ttl) {
		this.trigger('remoteStreamInfo', side, ttl);
	}

	audioStreamChanged(side, isAudioEnabled) {
		this.trigger('audioStreamChanged', side, isAudioEnabled);
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
