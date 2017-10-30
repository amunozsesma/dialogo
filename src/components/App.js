import React, { Component } from 'react';
import DiscussionContainer from './DiscussionContainer';
import Constants from './Constants';
import getVideoStreamAdapter from '../lib/VideoStreamAdapter';
import Labels from './Labels';
import './app.less';

export default class App extends Component {
	constructor() {
		super();

		this.registeredRemoteVideoElements = [];

		this.state = {
			left: this.createSide('left'),
			right: this.createSide('right')
		}
	}

	componentDidMount() {
		getVideoStreamAdapter().init();
	}

	onButtonClicked(side) {
		if (this.state[side].roomState === Constants.ROOM_STATE_INACTIVE) {
			this.modifyStateForSide(side, {
				roomState: Constants.ROOM_STATE_ACTIVE
			});

			getVideoStreamAdapter().startConversation(side);
		}
	}	

	modifyStateForSide(side, newState) {
		let newSideState = {};
		newSideState[side] = Object.assign({}, this.state[side], newState);
		this.setState(Object.assign(this.state, newSideState));
	}

	createSide(side) {
		const buttonClicked = this.onButtonClicked.bind(this);
		return {
			roomState: Constants.ROOM_STATE_INACTIVE,
			side: side,
			roomTitle: {
				bold: Labels['Room_Title'][side].bold,
				normal: Labels['Room_Title'][side].normal
			},
			onButtonClicked: buttonClicked
		}
	}

	render() {
		return (
			<div className="app-container">
				<div className="app-title">Diálogo a la fuerza</div>
				<DiscussionContainer data={this.state} />
				<div className="app-info-box app-info">{Labels['App_Info']}</div>
				<div className="app-info-box app-terms">
					<div className="app-terms-title">{Labels['App_Terms_Title']}</div>
					<div className="app-terms-content">{Labels['App_Terms_Content']}</div>
				</div>
			</div>
		);
	}

}
