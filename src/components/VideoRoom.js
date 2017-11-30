import React, { Component } from 'react';
import PropTypes from 'prop-types';
import VideoRoomButton from './VideoRoomButton';
import VideoRoomInfo from './VideoRoomInfo';
import getVideoStreamService from '../lib/VideoStreamService';
import classNames from 'classnames';
import Constants from './Constants';
import './video-room.less'

export default class VideoRoom extends Component {
	constructor() {
		super();

		this.onAddVideoStream = this.addVideoStream.bind(this);
		this.onRemoveVideoStream = this.removeVideoStream.bind(this);
		this.onAudioStreamChanged = this.audioStreamChanged.bind(this);

		this.videoEl = null;
	}

	componentDidMount() {
		getVideoStreamService().on('addVideoStream', this.onAddVideoStream);
		getVideoStreamService().on('removeVideoStream', this.onRemoveVideoStream);
	}

	componentWillUnmount() {
		getVideoStreamService().off('addVideoStream', this.onAddVideoStream);
		getVideoStreamService().off('removeVideoStream', this.onRemoveVideoStream);
	}

	addVideoStream(side, stream, isLocal) {
		//TODO this shouldn't be needed but just in case
		this.removeVideoStream(side);
		this.isVideoLocal = isLocal;

		if (side === this.props.data.side) {
			this.videoEl = document.createElement('video');
			this.videoContainer.appendChild(this.videoEl);

			if (this.videoEl.className.indexOf('video-element') === -1) {
				this.videoEl.className += 'video-element';
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

	audioStreamChanged(side, isAudioEnabled) {
		if (side === this.props.data.side && this.isVideoLocal && isAudioEnabled) {
			this.videoEl.srcObject.getAudioTracks().forEach(
				audioTrack => audioTrack.enabled = true
			);
		}
	}

	componentWillUpdate(nextProps) {
		if (this.isVideoLocal && this.props.data.roomState === Constants.ROOM_STATE_TALKING) {
			this.videoEl.srcObject.getAudioTracks().forEach(
				audioTrack => audioTrack.enabled = nextProps.data.isTalking
			);
		}
	}

	render() {
		const containerClassName = 'video-room-container ' + this.props.data.side;

		return (
			<div className={containerClassName}>
				<span className="video-room-title">
					<b>{this.props.data.roomTitle.bold}</b>{this.props.data.roomTitle.normal}
				</span>
				<div ref={(videoContainer) => {this.videoContainer = videoContainer;}} className="video-container">
				</div>
				<div className="video-room-footer">
					<VideoRoomButton data={this.props.data} shared={this.props.shared}/>
					<VideoRoomInfo data={this.props.data} shared={this.props.shared}/>
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
