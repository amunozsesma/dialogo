import io from 'socket.io-client';
import QueueMessageHandler from './QueueMessageHandler';
import WebRTCMessageHandler from './WebRTCMessageHandler';
import getVideoStreamService from '../lib/VideoStreamService';
import AppConfig from './AppConfig';

export default class VideoMessageManager {
	constructor() {
		this.connection = io.connect();

		this.handlers = [
			new QueueMessageHandler(this.connection),
			new WebRTCMessageHandler(this.connection)
		];

		this.initialised = false;
	}

	init() {
		this.connection.on('connect', () => {
			this.connection.on('room-info', initHandlers.bind(this));
			this.connection.emit('join', AppConfig['VIDEO_ROOM_NAME']);
		});
	}
}

function initHandlers(roomInfo) {
	getVideoStreamService().updateRoomInfo(roomInfo);
	if (!this.initialised) {
		this.handlers.forEach(handler => handler.init());
		this.initialised = true;
	}
}