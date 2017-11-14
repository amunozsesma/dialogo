import React, { Component } from 'react';
import Constants from './Constants';
import Labels from './Labels';
import classNames from 'classnames';
import Countdown from './Countdown';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import './video-room-button.less'

export default class VideoRoomButton extends Component {
	onButtonClicked() {
		this.props.data.onButtonClicked(this.props.data.side);
	}

	render() {
		const roomState = this.props.data.roomState;
		const buttonClassNames = classNames('video-room-button', {
			queuing: roomState === Constants.ROOM_STATE_QUEUING,
			talking: roomState === Constants.ROOM_STATE_TALKING,
			disabled: roomState === Constants.ROOM_STATE_DISABLED
		});
		const buttonLabel = Labels['Button'][this.props.data.roomState];
		const transitionElements = (roomState === Constants.ROOM_STATE_QUEUING)
			? [{key: 1, positionInQueue: this.props.data.positionInQueue}]
			: [];

		return (
			<div className='video-room-button-container'>
				<div className={buttonClassNames} onClick={this.onButtonClicked.bind(this)}>
					{buttonLabel}
				</div>
				<CSSTransitionGroup transitionName="video-room-transition" transitionEnterTimeout={500} transitionLeaveTimeout={100}>
					{transitionElements.map(
						element => {
							const message = element.positionInQueue > 0
								? `${element.positionInQueue} Persona${element.positionInQueue > 1 ? 's' : ''} delante de ti` :
								`Eres el siguiente, Preparate!`;
							return (
								<div key={element.key} className="video-room-button-info">
									<Countdown ttl={0} />
									<div className="video-room-button-info-splitter"></div>
									<div className="video-room-button-info-queue">{message}</div>
								</div>
							);
						}
					)}
				</CSSTransitionGroup>
			</div>
		);
	}

}
