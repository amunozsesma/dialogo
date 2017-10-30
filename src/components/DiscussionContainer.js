import React, { Component } from 'react';
import VideoRoom from './VideoRoom';

import './discussion-container.less'

export default class DiscussionContainer extends Component {

	render() {
		return (
			<div className="discussion-container">
				<VideoRoom data={this.props.data.left} videoadapter={this.props.videoadapter} />
				<div className="discussion-spliter"></div>
				<VideoRoom data={this.props.data.right} videoadapter={this.props.videoadapter} />
			</div>
		);
	}
}