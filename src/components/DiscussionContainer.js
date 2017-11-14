import React, { Component } from 'react';
import VideoRoom from './VideoRoom';
import Countdown from './Countdown';
import Labels from './Labels';
import getVideoStreamService from '../lib/VideoStreamService';

import './discussion-container.less'

export default class DiscussionContainer extends Component {

	constructor() {
		super();

		this.state = {startTimer: false, ttl: 0};
	}

	componentWillReceiveProps() {
		this.setState({startTimer: false});
	}

	componentDidMount() {
		getVideoStreamService().on('conversationInfo',
			info => this.setState({startTimer: true, ttl: info.discussionTTL})
		);
	}

	render() {
		const users = this.props.data.shared.connectedUsers;

		return (
			<div className="discussion-container">
				<VideoRoom data={this.props.data.left} shared={this.props.data.shared}/>
				<div className="discusion-middle-info">
					<div className="discusion-middle-info-spliter"></div>
					<div className="discusion-middle-info-ttl">
						<Countdown startTimer={this.state.startTimer} ttl={this.state.ttl} showHours={true}/>
						<div>{Labels['InfoTTL']}</div>
					</div>
					<div className="discusion-middle-info-users">{`${users} Oyente${users > 1 ? 's' : ''}`}</div>
				</div>
				<VideoRoom data={this.props.data.right} shared={this.props.data.shared}/>
			</div>
		);
	}
}