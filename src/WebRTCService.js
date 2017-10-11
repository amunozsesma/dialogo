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
			remoteVideosEl: '',
			url: 'http://localhost:8888',
			debug: false,
			media: {
				audio: true,
				video: true
			}
		});

		this.initAllListeners();

		this.webrtc.on('connectionReady', function(sessionId) {
			console.log('connectionready with session: ' + sessionId);
			this.webrtc.joinRoom(Constants.VIDEO_ROOMNAME);
		}.bind(this));
	
		this.webrtc.on('createdPeer', function(peer) {
			console.log('createdpeer: ' + peer.id);
		});

		this.webrtc.on('leftRoom', function(name) {
			console.log('leftRoom ' + name);
		});

		this.webrtc.on('videoRemoved', function(peer) {
			console.log('videoRemoved ' + peer.id);
		});
	}



	destroy() {
		this.webrtc.disconnect();	
	}

	getVideoStream() {
	}

	requestToQueue(side) {
		if (!this.isLocalVideoPlaying) {
			
			const sidedContainer = this.videoContainerState[side].containerElement;

			cleanContainer(sidedContainer);
			this.webrtc.config.localVideoEl = sidedContainer;
			this.webrtc.startLocalVideo();
			this.webrtc.joinRoom(Constants.VIDEO_ROOMNAME);
			this.isLocalVideoPlaying = true;

			this.webrtc.on('localMediaAttached', function(video) {
				sidedContainer.children[0].className += ' video-element';
			}.bind(this));
			
			this.videoContainerState[side].isPlaying = true;
		}
	}

	initAllListeners() {
		this.webrtc.on('videoAdded', function (video, peer) {
			console.log('videoadded ' + peer.id);
			video.className += ' video-element';

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
	}

}

function cleanContainer(container) {
	Array.prototype.forEach.call(container.children, function(child) {
		container.removeChild(child);
	});
}
