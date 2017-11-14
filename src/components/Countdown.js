import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Countdown extends Component {
	constructor() {
		super();

		this.interval = null;
		this.state = {
			ttl: 0
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.startTimer) {
			window.clearInterval(this.interval);
			
			this.interval = window.setInterval(function() {
				const ttl = parseInt(this.state.ttl, 10);
				if (ttl === 0) {
					window.clearInterval(this.interval);
				} else {
					this.setState({
						ttl: ttl - 1000
					});
				}
			}.bind(this), 1000);

			this.setState({
				ttl: parseInt(nextProps.ttl, 10)
			});
		} 
	}

	render() {
		return (

			<div>{formatTtl(this.state.ttl, this.props.showHours)}</div>
		);
	}
}

function formatTtl(milliseconds, showHours) {
	var totalSeconds = Math.round(milliseconds / 1000);

	var seconds = parseInt(totalSeconds % 60, 10);
	var minutes = parseInt(totalSeconds / 60, 10) % 60;
	var hours = parseInt(totalSeconds / 3600, 10);

	seconds = seconds < 10 ? '0' + seconds : seconds;
	minutes = minutes < 10 ? '0' + minutes : minutes;
	hours = hours < 10 ? '0' + hours : hours;

	return (showHours)
		? hours + ':' + minutes + ':' + seconds
		: minutes + ':' + seconds;
}
