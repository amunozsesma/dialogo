import io from 'socket.io-client';
import QueueMessageHandler from './QueueMessageHandler';
import WebRTCMessageHandler from './WebRTCMessageHandler';
import getVideoStreamService from '../lib/VideoStreamService';

export default class VideoMessageManager {
	constructor() {
		this.connection = io.connect();

		this.handlers = [
			new QueueMessageHandler(this.connection),
			new WebRTCMessageHandler(this.connection)
		];
	}

	init() {
		this.connection.on('connect', () => {
			this.connection.on('room-info', initHandlers.bind(this));
			this.connection.emit('join', AppConfig['VIDEO_ROOMNAME']);
		});
	}
}

function initHandlers(roomInfo) {
	getVideoStreamService().initRoomInfo(roomInfo);
	this.handlers.forEach(handler => handler.init(roomInfo));
}