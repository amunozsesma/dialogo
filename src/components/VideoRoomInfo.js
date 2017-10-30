import React, { Component } from 'react';
import Labels from './Labels';

import './video-room-info.less';

export default class VideoRoomInfo extends Component {

	render() {
		return (
			<div className="info-container">
				<div className="info-traffic-light">
					<div className="info-traffic-light-inactive"></div>
					<div className="info-traffic-light-active"></div>
				</div>
				<div className="info-time-left">
					<span className="info-label">{Labels['Info_Time_Left']}</span>
					<span className="info-timer">00:00</span>
				</div>
				<div className="info-online">
					<span className="info-label">{Labels['Info_Online']}</span>
					<span className="info-timer">02:24</span>
				</div>
			</div>
		);
	}
}