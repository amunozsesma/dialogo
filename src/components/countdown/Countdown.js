export default class Countdown {
	constructor(config) {
		this.config = config;
		this.isPaused = false;

		this.ttl = 0;
	}

	startTimer(ttl, showHours, callback) {
		window.clearInterval(this.interval);
		this.ttl = parseInt(ttl, 10);
			
		if (this.ttl > 0) {
			this.interval = window.setInterval(() => {
				if (this.ttl === 0) {
					window.clearInterval(this.interval);
				} else {
					this.ttl -= 1000;
					callback(formatTtl(this.ttl, showHours));
				}
			}, 1000);

			callback(formatTtl(this.ttl, showHours));
		} else {
			callback(formatTtl(0, showHours));
		}
		
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