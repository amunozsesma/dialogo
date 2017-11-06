import React, { Component } from 'react';
import PropTypes from 'prop-types';
import VideoRoomButton from './VideoRoomButton';
import VideoRoomInfo from './VideoRoomInfo';
import getVideoStreamService from '../lib/VideoStreamService';
import './video-room.less'

export default class VideoRoom extends Component {
	constructor() {
		super();

		this.onAddVideoStream = this.addVideoStream.bind(this);
		this.onRemoveVideoStream = this.removeVideoStream.bind(this);

		this.videoStreamAdapter = getVideoStreamService();

		this.videoEl = null;
	}

	componentDidMount() {
		this.videoStreamAdapter.on('addVideoStream', this.onAddVideoStream);
		this.videoStreamAdapter.on('removeVideoStream', this.onRemoveVideoStream);
	}

	componentWillUnmount() {
		this.videoStreamAdapter.off('addVideoStream', this.onAddVideoStream);
		this.videoStreamAdapter.off('removeVideoStream', this.onRemoveVideoStream);
	}

	addVideoStream(side, stream, isLocal) {
		//TODO this shouldn't be needed but just in case
		this.removeVideoStream(this.props.data.side);

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
			this.videoEl.srcObject.getTracks().forEach(track => track.stop());
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
				<div>{this.props.data.positionInQueue}</div>
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