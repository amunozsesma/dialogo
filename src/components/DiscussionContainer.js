import React, { Component } from 'react';
import VideoRoom from './VideoRoom';
import CountdownTimer from './CountdownTimer';
import Labels from './Labels';

import './discussion-container.less'

export default class DiscussionContainer extends Component {

	render() {
		const users = this.props.data.shared.users;
		const ttl = this.props.data.shared.currentTtl;

		return (
			<div className="discussion-container">
				<VideoRoom data={this.props.data.left} shared={this.props.data.shared}/>
				<div className="discusion-middle-info">
					<div className="discusion-middle-info-spliter"></div>
					<div className="discusion-middle-info-ttl">
						<CountdownTimer initialTimeRemaining={ttl} />
						<div>{Labels['InfoTTL']}</div>
					</div>
					<div className="discusion-middle-info-users">{`${users} Oyente${users > 1 ? 's' : ''}`}</div>
				</div>
				<VideoRoom data={this.props.data.right} shared={this.props.data.shared}/>
			</div>
		);
	}
}