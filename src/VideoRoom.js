import React, { Component } from 'react';
// import SimpleWebRTC from 'simplewebrtc';
import PropTypes from 'prop-types';
import Constants from './Constants';
import VideoRoomButton from './VideoRoomButton';
import classNames from 'classnames';
import './video-room.css'

export default class VideoRoom extends Component {
	componentDidMount() {
		this.props.data.onReadyToGetVideo(this.videoContainer, this.props.data.side);
	}

	componentWillUnmount() {
		
	}

	componentDidUpdate() {
		if (isUserActiveInRomm(this.props)) {
			this.props.webrtc.requestToQueue(this.props.data.side);
		}
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

function isUserActiveInRomm(props) {
	return props.data.roomState === Constants.ROOM_STATE_ACTIVE;
}

VideoRoom.propTypes = {
	data: PropTypes.shape({
		side: PropTypes.string,
		roomState: PropTypes.string
	}).isRequired
}
