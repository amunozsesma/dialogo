import React, { Component } from 'react';
import SimpleWebRTC from 'simplewebrtc';
import VideoRoom from './VideoRoom';
import Constants from './Constants';
import WebRTCService from './WebRTCService';
import './app.css';

export default class App extends Component {
	constructor() {
		super();

		this.registeredRemoteVideoElements = [];
		this.webRTCService = new WebRTCService();

		this.state = {
			left: this.createSide('left'),
			right: this.createSide('right')
		}
	}

	onReadyToGetVideo(remoteVideoEl) {
		this.registeredRemoteVideoElements.push(remoteVideoEl);
		if (this.registeredRemoteVideoElements.length === 2) {
			this.webRTCService.init(this.registeredRemoteVideoElements);
		}
	}

	onButtonClicked(side) {
		this.modifySide(side, {
			roomState: Constants.ROOM_STATE_ACTIVE
		});
	}	

	modifySide(side, newState) {
		let newSideState = {};
		newSideState[side] = Object.assign({}, this.state[side], newState);
		this.setState(Object.assign(this.state, newSideState));
	}

	createSide(side) {
		const buttonClicked = this.onButtonClicked.bind(this);
		const onReadyToGetVideo = this.onReadyToGetVideo.bind(this);
		return {
			roomState: Constants.ROOM_STATE_INACTIVE,
			side: side,
			onButtonClicked: buttonClicked,
			onReadyToGetVideo: onReadyToGetVideo
		}
	}

	render() {
		return (
			<div className="app-container">
				<VideoRoom data={this.state.left} webrtc={this.webRTCService} />
				<VideoRoom data={this.state.right} webrtc={this.webRTCService} />
			</div>
		);
	}

}
