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

		const buttonProperties = getButtonProperties(this.props);
		const button = (buttonProperties.show)
			? <Button className={buttonProperties.className} onClick={() => this.onButtonClicked()} label={buttonProperties.label}/>
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

function getButtonProperties(props, _test, _isTalking) {
	const buttonClassName = classNames('room-info-turn-button', {
		'on-turn': isMySideTalking(props)
	});
	const buttonLabel = props.data.isTalking
			? Labels['TurnButton']['Talking']
			: Labels['TurnButton']['NotTalking'];
	const showButton = props.data.roomState === Constants.ROOM_STATE_TALKING
		|| props.data.roomState === Constants.ROOM_STATE_TALKING;

	return (!_test)
	? {
		className: buttonClassName,
		label: buttonLabel,
		show: showButton
	}
	: {
		className: _isTalking ? 'room-info-turn-button on-turn' : 'room-info-turn-button',
		label: _isTalking ? Labels['TurnButton']['Talking'] : Labels['TurnButton']['NotTalking'],
		show: true
	}
}

function isMySideTalking(props) {
	return props.data.isTalking && props.data.roomState === Constants.ROOM_STATE_TALKING;
}

function forTest(isTalking) {
	if (isTalking) {

	}
}