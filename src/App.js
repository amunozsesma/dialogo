import React, { Component } from 'react';
import SimpleWebRTC from 'simplewebrtc';
import VideoRoom from './VideoRoom';
import Constants from './Constants';
import VideoStreamAdapter from './VideoStreamAdapter';
import './app.less';

export default class App extends Component {
	constructor() {
		super();

		this.registeredRemoteVideoElements = [];
		this.videoStreamAdapter = new VideoStreamAdapter();

		this.state = {
			left: this.createSide('left'),
			right: this.createSide('right')
		}
	}

	componentDidMount() {
		this.videoStreamAdapter.init();
	}

	onButtonClicked(side) {
		if (this.state[side].roomState === Constants.ROOM_STATE_INACTIVE) {
			this.modifyStateForSide(side, {
				roomState: Constants.ROOM_STATE_ACTIVE
			});

			this.videoStreamAdapter.startConversation(side);
		}
	}	

	modifyStateForSide(side, newState) {
		let newSideState = {};
		newSideState[side] = Object.assign({}, this.state[side], newState);
		this.setState(Object.assign(this.state, newSideState));
	}

	createSide(side) {
		const buttonClicked = this.onButtonClicked.bind(this);
		return {
			roomState: Constants.ROOM_STATE_INACTIVE,
			side: side,
			onButtonClicked: buttonClicked
		}
	}

	render() {
		return (
			<div className="app-container">
				<VideoRoom data={this.state.left} videoadapter={this.videoStreamAdapter} />
				<VideoRoom data={this.state.right} videoadapter={this.videoStreamAdapter} />
			</div>
		);
	}

}
