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
		getVideoStreamService().on('turnInfo',
			info => {
				const sideInfo = info[this.props.side];
				if (sideInfo.isTalking) {
					this.animateVisualComponent(sideInfo.TTL);
				} else {
					this.resetVisualComponent();
				}
			}
		);

		this.drawVisualComponent();
	}

	resetVisualComponent() {
		this.lineProgresBar.set(0);
	}

	animateVisualComponent(ttl) {
		const percent = getProgress(ttl, this.props.turnTTL);
		this.lineProgresBar.animate(percent, {duration: ttl});
	}

	drawVisualComponent() {
		this.lineProgresBar = new Line(this.refs.visual, {
			color: 'white',
			strokeWidth: 10,
			svgStyle: {
				display: 'block',
				width: '100%',
				border: '1px solid',
				'border-radius': '10px',
				background: 'linear-gradient(270deg, #3AAA35 15%, #95C11F 45%)'
			}
		});

		this.resetVisualComponent();
	}

	render() {
		return(
			<div className="turn-countdown">
				<div ref="visual" className="turn-countdown-visual"></div>
			</div>
		);
	}
}