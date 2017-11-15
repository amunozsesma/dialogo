import React, { Component } from 'react';
import VideoRoom from './VideoRoom';
import DiscussionCountdown from './countdown/DiscussionCountdown';
import Labels from './Labels';
import getVideoStreamService from '../lib/VideoStreamService';

import './discussion-container.less'

export default class DiscussionContainer extends Component {

	render() {
		const users = this.props.data.shared.connectedUsers;
		const roomTTL = this.props.data.shared.roomTTL;

		return (
			<div className="discussion-container">
				<VideoRoom data={this.props.data.left} shared={this.props.data.shared}/>
				<div className="discusion-middle-info">
					<div className="discusion-middle-info-spliter"></div>
					<div className="discusion-middle-info-ttl">
						<DiscussionCountdown roomTTL={roomTTL} showHours={false}/>
						<div className="discusion-middle-info-ttl-label">{Labels['InfoTTL']}</div>
					</div>
					<div className="discusion-middle-info-users">{`${users} Oyente${users > 1 ? 's' : ''}`}</div>
				</div>
				<VideoRoom data={this.props.data.right} shared={this.props.data.shared}/>
			</div>
		);
	}
}