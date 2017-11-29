import React, { Component } from 'react';
import Labels from './Labels';
import getVideoStreamService from '../lib/VideoStreamService';
import TurnCountdown from './countdown/TurnCountdown';
import Button from './Button';
import Constants from './Constants';
import classNames from 'classnames';

import './video-room-info.less';

export default class VideoRoomInfo extends Component {
	onButtonClicked() {
		if (isMySideTalking(this.props)) {
			getVideoStreamService().turnChange(this.props.data.side);
		}
	}

	render() {
		const micClassName = classNames('room-info-mic', {
			'talking': this.props.data.isTalking
		});

		const showButton = this.props.data.roomState === Constants.ROOM_STATE_TALKING
			|| this.props.data.roomState === Constants.ROOM_STATE_TALKING;
		const buttonClassName = classNames('room-info-turn-button', {
			'on-turn': isMySideTalking(this.props)
		});
		const buttonLabel = this.props.data.isTalking
			? Labels['TurnButton']['Talking']
			: Labels['TurnButton']['NotTalking'];
		const button = (showButton)
		// const button = (true)
			? <Button className={buttonClassName} onClick={() => this.onButtonClicked()} label={buttonLabel}/>
			: null;

		return (
			<div className="room-info">
				<div className={micClassName}></div>
				<div className="room-info-turn">
					<TurnCountdown turnTTL={this.props.shared.turnTTL} side={this.props.data.side}/>
					{button}
				</div>
			</div>
		);
	}
}

function isMySideTalking(props) {
	return props.data.isTalking && props.data.roomState === Constants.ROOM_STATE_TALKING;
}