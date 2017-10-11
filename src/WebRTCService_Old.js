import Emitr from './emitr';
import Constants from './Constants';
import SimpleWebRTC from 'simplewebrtc';

const PLAYING_REMOTE = 'playing-remote';
const PLAYING_LOCAL = 'playing-local';
const NOT_PLAYING = 'not-playing';

// TODO rename to video managaer or smthing
export default class WebRTCService extends Emitr {
	constructor() {
		super();
		this.id = 0;
		
		this.videoContainerState = {
			'left': {
				containerElement: '',
				isPlaying: false
			},
			'right': {
				containerElement: '',
				isPlaying: NOT_PLAYING
			}
		};

		this.isLocalVideoPlaying = false;
	}

	init(containerElements) {
		Object.keys(this.videoContainerState).forEach(function(side, index) {
			this.videoContainerState[side]['containerElement'] = containerElements[index];
		}.bind(this));

		this.webrtc = new SimpleWebRTC({
			localVideoEl: '',
			// the id/element dom element that will hold remote videos
			remoteVideosEl: '',
			// immediately ask for camera access
			// autoRequestMedia: true,
			// url: 'https://a526d8e4.ngrok.io',
			url: 'http://localhost:8888',
			debug: false,
			media: {
				audio: true,
				video: true
			}
		});
		window.webrtc = this.webrtc;
		this.initAllListeners();

		this.webrtc.on('connectionReady', function() {
			this.webrtc.joinRoom(Constants.VIDEO_ROOMNAME);
		}.bind(this));

		// this.webrtc.on('readyToCall', function() {
		// 	this.webrtc.joinRoom(Constants.VIDEO_ROOMNAME);
		// 	this.webrtc.pause();

		// }.bind(this));
		
	}

	destroy() {
		this.webrtc.disconnect();	
	}

	getVideoStream() {
	}

	requestToQueue(side) {
		//TODO this will have to tell the server that I want to queue up, for the moment just join
		if (!this.isLocalVideoPlaying) {
			
			const sidedContainer = this.videoContainerState[side].containerElement;

			cleanContainer(sidedContainer);
			this.webrtc.config.localVideoEl = sidedContainer;
			// debugger;
			this.webrtc.startLocalVideo();
			// this.webrtc.resume();
			this.isLocalVideoPlaying = true;

			// this.webrtc.joinRoom(Constants.VIDEO_ROOMNAME);
			// this.webrtc.on('readyToCall', function() {
			// }.bind(this));

			this.webrtc.on('localMediaAttached', function(video) {
				sidedContainer.children[0].className += ' video-element';

				// this.webrtc.disconnect();
				// if (!this.hasJoinedRoom) {
				// 	this.webrtc.joinRoom(Constants.VIDEO_ROOMNAME);
				// 	this.hasJoinedRoom = true;
				// }

				// this.initAllListeners();
			}.bind(this));
			
			this.videoContainerState[side].isPlaying = true;
		}
	}

	initAllListeners() {
		this.webrtc.on('connectionReady', function() {
			
			// this.webrtc.joinRoom(Constants.VIDEO_ROOMNAME);
			this.webrtc.on('videoAdded', function (video, peer) {
				video.className += ' video-element';
				console.log('Video added');
				let videoAdded = false
				Object.keys(this.videoContainerState).forEach(function(side) {
					if (!this.videoContainerState[side].isPlaying && !videoAdded) {
	 					const sidedContainer = this.videoContainerState[side].containerElement;
						cleanContainer(sidedContainer);
						sidedContainer.appendChild(video);

						this.videoContainerState[side].isPlaying = true;
						videoAdded = true;
					}
				}.bind(this));

			}.bind(this));

		}.bind(this));
	}

}

function cleanContainer(container) {
	Array.prototype.forEach.call(container.children, function(child) {
		container.removeChild(child);
	});
}
