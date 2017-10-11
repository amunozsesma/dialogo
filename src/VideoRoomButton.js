import React, { Component } from 'react';
import Constants from './Constants';
import Labels from './Labels';

import './video-room-button.css'

export default class VideoRoomButton extends Component {
	onButtonClicked() {
		this.props.data.onButtonClicked(this.props.data.side);
	}

	render() {
		return (
			<div className="video-room-button" onClick={this.onButtonClicked.bind(this)}>
				{getLabel(this.props.data.roomState)}
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