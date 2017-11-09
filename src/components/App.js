import React, { Component } from 'react';
import DiscussionContainer from './DiscussionContainer';
import Constants from './Constants';
import getVideoStreamService from '../lib/VideoStreamService';
import VideoMessageManager from '../lib/VideoMessageManager';
import Labels from './Labels';
import './app.less';

export default class App extends Component {
	constructor() {
		super();

		this.state = {
			shared: {
				currentTtl: 0,
				users: 1
			},
			left: this.createSide('left'),
			right: this.createSide('right')
		}

		this.videoMessageManager = new VideoMessageManager();
	}

	componentDidMount() {
		this.videoMessageManager.init();

		getVideoStreamService().on('updatePositionInQueue',
			(side, position) => {
				this.modifyStateForSide(side, {
					roomState: Constants.ROOM_STATE_QUEUING,
					positionInQueue: position
				});

				const oppositeSide = (side === 'left') ? 'right' : 'left';
				this.modifyStateForSide(oppositeSide, {
					roomState: Constants.ROOM_STATE_DISABLED,
					positionInQueue: position
				});
			}

		);

		getVideoStreamService().on('addVideoStream',
			(side, stream, isLocal) => {
				if (isLocal) {
					this.modifyStateForSide('left', {
						roomState: Constants.ROOM_STATE_TALKING
					});
					this.modifyStateForSide('right', {
						roomState: Constants.ROOM_STATE_TALKING
					});
				}
			}
		);

		getVideoStreamService().on('removeVideoStream',
			(side, isLocal) => {
				if (isLocal) {
					this.modifyStateForSide('left', {
						roomState: Constants.ROOM_STATE_INITIAL,
						positionInQueue: -1
					});
					this.modifyStateForSide('right', {
						roomState: Constants.ROOM_STATE_INITIAL,
						positionInQueue: -1
					});
				}
			}
		);

		// getVideoStreamService().on('configUpdated',
		// 	config => this.modifySharedState(config)
		// );
	}

	onButtonClicked(side) {
		if (this.state['left'].roomState === Constants.ROOM_STATE_INITIAL && this.state['right'].roomState === Constants.ROOM_STATE_INITIAL) {
			getVideoStreamService().startConversation(side);
		}
	}	

	modifySharedState(sharedState) {
		const shared = Object.assign({}, this.state['shared'], sharedState);
		let newState = {shared: shared};
		this.setState(Object.assign({}, this.state, newState));
	}

	modifyStateForSide(side, newState) {
		let newSideState = {};
		newSideState[side] = Object.assign({}, this.state[side], newState);

		const state = Object.assign({}, this.state, newSideState);
		this.setState(state);
	}

	createSide(side) {
		const buttonClicked = this.onButtonClicked.bind(this);

		return {
			roomState: Constants.ROOM_STATE_INITIAL,
			side: side,
			roomTitle: {
				bold: Labels['Room_Title'][side].bold,
				normal: Labels['Room_Title'][side].normal
			},
			onButtonClicked: buttonClicked,
			positionInQueue: -1,
			ttl: 0
		}
	}

	render() {
		return (
			<div className="app-container">
				<div className="app-title">Diálogo a la fuerza</div>
				<DiscussionContainer data={this.state}/>
			</div>
		);
	}

}
