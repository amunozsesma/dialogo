import React, { Component } from 'react';
import Labels from './Labels';
import getVideoStreamService from '../lib/VideoStreamService';
import TurnCountdown from './countdown/TurnCountdown';

import './video-room-info.less';

export default class VideoRoomInfo extends Component {

	render() {
		return (
			<div className="room-info">
				<div className="room-info-mic"></div>
				<div className="room-info-turn">
					<TurnCountdown />
					<div className="room-info-turn-button"></div>
				</div>
			</div>
		);
	}
}

