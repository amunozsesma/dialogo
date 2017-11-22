import React, { Component } from 'react';
import Countdown from './Countdown';
import getVideoStreamService from '../../lib/VideoStreamService';
import { Line } from 'react-progressbar.js';

import './turn-countdown.less';

export default class TurnCountdown extends Component {
	constructor() {
		super();
		this.countdown = new Countdown();
		this.state = {ttl: 0};
	}

	componentDidMount() {
	}

	render() {
        return (
        	<div className="turn-countdown">
        	</div>
        );
	}
}

function getProgress(elapsedTTL, turnTTL) {
	return (totalTTL) ? parseFloat((parseFloat(elapsedTTL, 10) / parseFloat(totalTTL, 10))) : 1;	
}