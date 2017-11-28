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

		let info = {};
		Object.keys(roomInfo).forEach(key => {
			if (key !== 'streams') {
				info[key] = roomInfo[key];
			}
		});
		this.trigger('roomInfo', info)
	}

	updateConversationInfo(conversationInfo) {
		this.trigger('conversationInfo', conversationInfo);
	}

	updateTurnInfo(turnInfo) {
		this.trigger('turnInfo', turnInfo);
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

	turnChange(side) {
		this.trigger('turnChange', side);
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
