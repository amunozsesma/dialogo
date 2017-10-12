import React, { Component } from 'react';
import PropTypes from 'prop-types';
import VideoRoomButton from './VideoRoomButton';
import './video-room.css'

export default class VideoRoom extends Component {
	constructor() {
		super();

		this.onAddVideoStream = this.addVideoStream.bind(this);
		this.onRemoveVideoStream = this.removeVideoStream.bind(this);
	}

	componentDidMount() {
		this.props.videoadapter.on('addVideoStream', this.onAddVideoStream);
		this.props.videoadapter.on('removeVideoStream', this.onRemoveVideoStream);
	}

	componentWillUnmount() {
		this.props.videoadapter.off('addVideoStream', this.onAddVideoStream);
		this.props.videoadapter.off('removeVideoStream', this.onRemoveVideoStream);
	}

	addVideoStream(videoEl, side) {
		if (side === this.props.data.side) {
			this.videoContainer.appendChild(videoEl);

			if (videoEl.className.indexOf('video-element') === -1) {
				videoEl.className += ' video-element';
			}
		}
	}

	removeVideoStream(side) {
	}

	render() {
		return (
			<div className="video-room-container">
				<div ref={(videoContainer) => {this.videoContainer = videoContainer;}} className="video-container">
				</div>
				<div className="video-room-footer">
					<VideoRoomButton data={this.props.data}/>
				</div>
			</div>
		);
	}
}

VideoRoom.propTypes = {
	data: PropTypes.shape({
		side: PropTypes.string,
		roomState: PropTypes.string
	}).isRequired
}
