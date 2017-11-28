import React, { Component } from 'react';
import Countdown from './Countdown';
import getVideoStreamService from '../../lib/VideoStreamService';
import { getProgress } from './CountdownUtils';
import { Line } from 'progressbar.js';

import './turn-countdown.less';

export default class TurnCountdown extends Component {
	constructor() {
		super();
		this.lineProgresBar = null;
	}

	componentDidMount() {
		getVideoStreamService().on('conversationInfo',
			info => {
			}
		);

	}

	render() {
		return(
			<div className="turn-countdown">
			</div>
		);
	}
}