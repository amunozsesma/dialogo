import React, { Component } from 'react';
import PropTypes from 'prop-types';
import VideoRoomButton from './VideoRoomButton';
import VideoRoomInfo from './VideoRoomInfo';
import './video-room.less'

export default class VideoRoom extends Component {
	constructor() {
		super();

		this.onAddVideoStream = this.addVideoStream.bind(this);
		this.onRemoveVideoStream = this.removeVideoStream.bind(this);

		this.videoEl = null;
	}

	componentDidMount() {
		this.props.videoadapter.on('addVideoStream', this.onAddVideoStream);
		this.props.videoadapter.on('removeVideoStream', this.onRemoveVideoStream);
	}

	componentWillUnmount() {
		this.props.videoadapter.off('addVideoStream', this.onAddVideoStream);
		this.props.videoadapter.off('removeVideoStream', this.onRemoveVideoStream);
	}

	addVideoStream(stream, side, isLocal) {
		if (side === this.props.data.side) {
			this.videoEl = document.createElement('video');
			this.videoContainer.appendChild(this.videoEl);

			if (this.videoEl.className.indexOf('video-element') === -1) {
				this.videoEl.className += 'video-element ' + side;
			}

			this.videoEl.srcObject = stream;
			this.videoEl.oncontextmenu = function (e) {
				e.preventDefault();
			};
			this.videoEl.autoplay = 'autoplay';
			if (isLocal) {
				this.videoEl.setAttribute('muted', '');
			}
		}
	}

	removeVideoStream(side) {
		if (side === this.props.data.side && this.videoEl) {
			this.videoContainer.removeChild(this.videoEl);
			this.videoEl = null;
		}

	}

	render() {
		return (
			<div className="video-room-container">
				<span className="video-room-title">
					<b>{this.props.data.roomTitle.bold}</b>{this.props.data.roomTitle.normal}
				</span>
				<div ref={(videoContainer) => {this.videoContainer = videoContainer;}} className="video-container">
				</div>
				<VideoRoomInfo data={this.props.data} />
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
