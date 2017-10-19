import React, { Component } from 'react';
import Constants from './Constants';
import Labels from './Labels';
import classNames from 'classnames';

import './video-room-button.less'

export default class VideoRoomButton extends Component {
	onButtonClicked() {
		this.props.data.onButtonClicked(this.props.data.side);
	}

	render() {
		const roomState = this.props.data.roomState;
		const buttonClassNames = classNames('video-room-button', {
			disabled: roomState !== Constants.ROOM_STATE_INACTIVE
		});
		const buttonLabel = Labels['Button'][this.props.data.roomState];

		return (
			<div className={buttonClassNames} onClick={this.onButtonClicked.bind(this)}>
				{buttonLabel}
			</div>
		);
	}

}
