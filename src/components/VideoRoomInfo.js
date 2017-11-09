import React, { Component } from 'react';
import Labels from './Labels';
import getVideoStreamService from '../lib/VideoStreamService';
import CountdownTimer from './CountdownTimer';

import './video-room-info.less';

export default class VideoRoomInfo extends Component {

	constructor() {
		super();
		this.state = {
			ttl: 0
		}
	}

	componentDidMount() {
	}

	startTimer() {
	}

	render() {
		return (
			<div className="info-container">
				<CountdownTimer initialTimeRemaining={this.state.ttl} showHours={false}/>
			</div>
		);
	}
}

