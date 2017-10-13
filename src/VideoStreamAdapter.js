import Emitr from './emitr';
import Constants from './Constants';
import SimpleWebRTC from 'simplewebrtc';
import AppConfig from './AppConfig';

import './video-stream-adapter.less'

export default class VideoStreamAdapter extends Emitr {
	init() {
		this.localVideoContainer = document.createElement('div');
		this.localVideoContainer.className = 'local video-stream-adapter-placeholder';
		this.remoteVideoContainer = document.createElement('div');
		this.remoteVideoContainer.className = 'remote video-stream-adapter-placeholder';
		this.videoInRoom = {
			'left': null,
			'right': null
		};
		this.isLocalVideoPlaying = false;

		document.body.appendChild(this.localVideoContainer);
		document.body.appendChild(this.remoteVideoContainer);

		this.webrtc = new SimpleWebRTC({
			localVideoEl: this.localVideoContainer,
			remoteVideosEl: this.remoteVideoContainer,
			autoRequestMedia: true,
			url: AppConfig.SIGNALING_SERVER_URL,
			debug: false,
			media: {
				audio: true,
				video: true
			}
		});

		this.webrtc.on('readyToCall', function () {
			this.webrtc.joinRoom(Constants.VIDEO_ROOMNAME);
			this.webrtc.pauseVideo();

			this.addListeners();
		}.bind(this));
	}

	startConversation(side) {
		if (!this.videoInRoom[side]) {
			this.webrtc.resumeVideo();

			this.videoInRoom[side] = this.localVideoContainer.children[0];
			this.trigger('addVideoStream', this.videoInRoom[side], side);
			this.videoInRoom[side].srcObject = this.webrtc.webrtc.localStreams[0];
			this.isLocalVideoPlaying = true;
		}
	}

	endConversation(side) {
		this.localVideoContainer.appendChild(this.videoInRoom[side]);
		this.videoInRoom[side] = null;
		this.webrtc.pauseVideo();
		this.isLocalVideoPlaying = false;
	}

	addListeners() {
		this.webrtc.on('videoAdded', function (videoEl, peer) {
	        //There is a blink that happens when one of the sides has no video 
	        // and a peer joins. This is because we cannot know if the peer
	        // is playing unless we receive a mute. We will need to do this
	        // via signaling server.
	        // So atm, to know if the peer is playing this is what will happen:
	        // 1. videoAdded we add video to the container (wether is playing or not)
	        // 2. mute / nothing: We remove or leave the video.
	        // So if we had received a mute, that means that the video was not playing,
	        // but it was appended showing a black screen.

			this.addVideo(videoEl);
		}.bind(this));

		this.webrtc.on('videoRemoved', function (_, peer) {
			const videoEl = document.getElementById(peer.id + '_video_incoming');
			this.removeVideo(videoEl);
		}.bind(this));

		this.webrtc.on('mute', function (data) {
			const videoEl = document.getElementById(data.id + '_video_incoming');
			this.removeVideo(videoEl);
		}.bind(this));

		this.webrtc.on('unmute', function (data) {
			const videoEl = document.getElementById(data.id + '_video_incoming');
			if (!videoEl) {
				return;
			}

			this.addVideo(videoEl);

		}.bind(this));

	}

	addVideo(videoEl) {
		const nextAvailableSide = this.getNextAvailableSide();
		const srcObject = videoEl.srcObject;

		if (nextAvailableSide) {
			this.videoInRoom[nextAvailableSide] = videoEl;
			this.trigger('addVideoStream', videoEl, nextAvailableSide);
			videoEl.srcObject = srcObject;
		}
	}

	removeVideo(videoEl) {
		const side = this.whichSideIsVideoPlaying(videoEl);
		if (side) {
			this.remoteVideoContainer.appendChild(videoEl);
			this.videoInRoom[side] = null;
			this.trigger('removeVideoStream', side);
		}
	}

	getNextAvailableSide() {
		return Object.keys(this.videoInRoom).reduce(function(acc, side) {
			return this.videoInRoom[side] === null && !acc ? side : acc;
		}.bind(this), null);
	}

	whichSideIsVideoPlaying(videoEl) {
		return Object.keys(this.videoInRoom).reduce(function(acc, side) {
			return this.videoInRoom[side] === videoEl && !acc ? side : acc;
		}.bind(this), null);
	}
}

// Doesn't work properly
function isVideoPlaying(videoEl) {
	return videoEl.currentTime > 0 && !videoEl.paused && !videoEl.ended && videoEl.readyState > 2;
}
