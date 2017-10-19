import React, { Component } from 'react';
import PropTypes from 'prop-types';
import VideoRoomButton from './VideoRoomButton';
import './video-room.less'

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

	addVideoStream(stream, side) {
		if (side === this.props.data.side) {
			var videoEl = document.createElement('video');
			this.videoContainer.appendChild(videoEl);

			if (videoEl.className.indexOf('video-element') === -1) {
				videoEl.className += 'video-element ' + side;
			}

			videoEl.srcObject = stream;
			videoEl.oncontextmenu = function (e) {
				e.preventDefault();
			};
			videoEl.autoplay = 'autoplay';
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
