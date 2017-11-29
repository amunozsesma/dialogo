import React, { Component } from 'react';
import Labels from './Labels';
import getVideoStreamService from '../lib/VideoStreamService';
import TurnCountdown from './countdown/TurnCountdown';
import classNames from 'classnames';

import './video-room-info.less';

export default class VideoRoomInfo extends Component {

	render() {
		const micClassName = classNames('room-info-mic', {
			'talking': this.props.data.isTalking
		});

		return (
			<div className="room-info">
				<div className={micClassName}></div>
				<div className="room-info-turn">
					<TurnCountdown turnTTL={this.props.shared.turnTTL} side={this.props.data.side}/>
					<div className="room-info-turn-button"></div>
				</div>
			</div>
		);
	}
}

