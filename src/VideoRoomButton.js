import React, { Component } from 'react';
import Constants from './Constants';
import Labels from './Labels';
import classNames from 'classnames';

import './video-room-button.css'

export default class VideoRoomButton extends Component {
	onButtonClicked() {
		this.props.data.onButtonClicked(this.props.data.side);
	}

	render() {
		const roomState = this.props.data.roomState;

		const buttonClassNames = classNames('video-room-button', {
			disabled: roomState !== Constants.ROOM_STATE_INACTIVE
		});

		return (
			<div className={buttonClassNames} onClick={this.onButtonClicked.bind(this)}>
				{getLabel(roomState)}
			</div>
		);
	}

}

function getLabel(state) {
	switch(state) {
		case Constants.ROOM_STATE_WAITING:
			return Labels['Button_Awaiting'];
			break;
		case Constants.ROOM_STATE_ACTIVE:
			return Labels['Button_Active'];
			break;
		case Constants.ROOM_STATE_INACTIVE:
			return Labels['Button_Queue'];
			break;
	}
}