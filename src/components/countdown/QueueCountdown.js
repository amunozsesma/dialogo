import React, { Component } from 'react';
import Countdown from './Countdown';
import getVideoStreamService from '../../lib/VideoStreamService';

export default class QueueCountdown extends Component {
	constructor() {
		super();
		this.countdown = new Countdown();
		this.state = {ttl: 0};
	}

	componentDidMount() {
	}

	render() {
		return(
			<div className="queue-countdown">
				<div className="queue-countdown-timer">{this.state.ttl}</div>
			</div>
		);
	}
}
