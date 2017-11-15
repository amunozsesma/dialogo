import React, { Component } from 'react';
import Countdown from './Countdown';
import getVideoStreamService from '../../lib/VideoStreamService';
import circliful from 'jquery-circliful';
import $ from 'jquery';

import './discussion-countdown.less'

export default class DiscussionCountdown extends Component {
	constructor() {
		super();
		this.countdown = new Countdown();
		this.state = {ttl: 0};
	}

	componentDidMount() {
		getVideoStreamService().on('conversationInfo',
			info => this.countdown.startTimer(
				info.discussionTTL,
				this.props.showHours,
				ttl => this.setState({ttl: ttl}))
		);
		this.redrawTimer();
	}

	componentDidUpdate() {
		this.redrawTimer();
	}

	redrawTimer() {
		const percent = getPercent(toMilis(this.state.ttl), this.props.roomTTL);
		const foregroundColor = (percent === 0 || percent === 100) ? 'green' : 'white';
		const backgroundColor = (percent >= 75 ) ? 'red' : 'green';

		$(this.refs.visual).empty().removeData().circliful({
			animation: 0,
			foregroundBorderWidth: 80,
			backgroundBorderWidth: 80,
			foregroundColor: foregroundColor,
			backgroundColor: backgroundColor,
			fillColor: 'white',
			percent: percent,
			textStyle: 'font-size: 18px;',
			textColor: '#666',
			multiPercentage: 1,
			replacePercentageByText: ''
		});
	}

	render() {
		return(
			<div className="discussion-countdown">
				<div ref="visual" className="discussion-countdown-visual"></div>
				<div className="discussion-countdown-timer">{this.state.ttl}</div>
			</div>
		);
	}
}

function getPercent(elapsedTTL, totalTTL) {
	return (totalTTL) ? 100 - parseInt((parseFloat(elapsedTTL, 10) / parseFloat(totalTTL, 10)) * 100, 10) : 0;
}

function toMilis(ttl) {
	let secs = 0

	if (ttl !== 0) {
		const parts = ttl.split(':').map(part => parseInt(part, 10));

		if (parts.length === 2) {
			secs = parts[0] * 60 + parts[1];
		} else {
			secs = parts[0] * 3600 + parts[1] * 60 + parts[0];
		}
	}

	return secs * 1000;
}