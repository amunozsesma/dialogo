import React, { Component } from 'react';
import Countdown from './Countdown';
import getVideoStreamService from '../../lib/VideoStreamService';
import { getProgress } from './CountdownUtils';
import { Circle } from 'progressbar.js';

import './discussion-countdown.less'

export default class DiscussionCountdown extends Component {
	constructor() {
		super();
		this.countdown = new Countdown();
		this.state = {ttl: '00:00'};

		this.circleProgresBar = null;
	}

	componentDidMount() {
		getVideoStreamService().on('conversationInfo',
			info => {
				this.animateVisualComponent(info.discussionTTL);
				this.countdown.startTimer(
					info.discussionTTL,
					this.props.showHours,
					ttl => this.setState({ttl: ttl})
				);
			}
		);

		this.drawVisualComponent();
	}

	animateVisualComponent(discussionTTL) {
		const percent = getProgress(discussionTTL, this.props.roomTTL);
		if (percent !== 1) {
			const initialProgress = (discussionTTL === 0) ? 0 : 1 - percent;
			this.circleProgresBar.set(initialProgress);
		}

		this.circleProgresBar.animate(percent, {duration: discussionTTL});
	}

	drawVisualComponent() {
		this.circleProgresBar = new Circle(this.refs.visual, {
			color: 'white',
			strokeWidth: 50,
			svgStyle: {
				display: 'block',
				width: '100%',
				background: 'radial-gradient(circle at center, #95C11F 30%, #3AAA35 55%)',
				'border-radius': '50%'
			}
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
