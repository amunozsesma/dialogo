import React, { Component } from 'react';
import Labels from './Labels';
import getVideoStreamService from '../lib/VideoStreamService';

import './video-room-info.less';

export default class VideoRoomInfo extends Component {

	constructor() {
		super();

		this.state = {
			ttl: 0
		};
	}

	componentDidMount() {
		getVideoStreamService().on('remoteStreamInfo',
			(side, ttl) => {
				if (side === this.props.data.side) {
					this.startTimer(ttl);
				}
			}
		);
	}

	startTimer(ttl) {
		if (this.interval) {
			window.clearInterval(this.interval);
		}
		console.log('setting new ttl');
		this.setState({
			ttl: parseInt(ttl, 10)
		});
		this.interval = window.setInterval(function() {
			const ttl = parseInt(this.state.ttl, 10);
			if (ttl === 0) {
				window.clearInterval(this.interval);
				this.interval = null;
			} else {
				this.setState({
					ttl: ttl - 1000
				});
			}
		}.bind(this), 1000);
	}

	render() {
		return (
			<div className="info-container">
				<div className="info-traffic-light">
					<div className="info-traffic-light-inactive"></div>
					<div className="info-traffic-light-active"></div>
				</div>
				<div className="info-online">
					<span className="info-label">{Labels['Info_Online']}</span>
					<span className="info-timer">{formatTtl(this.state.ttl)}</span>
				</div>
			</div>
		);
	}
}

function formatTtl(ttl) {
	const minutes = Math.floor(ttl / 60000);
	const seconds = ((ttl % 60000) / 1000).toFixed(0);
	return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}