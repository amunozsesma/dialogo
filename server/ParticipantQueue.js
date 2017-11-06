class ParticipantQueue {
	constructor(config) {
		this.queue = [];
		this.inProcess = null;

		this.config = {
			ttl: 20000,
			capacity: 20
		};
		this.config = Object.assign(this.config, config);
	}

	add(participant, callbacks) {

		if (this.queue.length < this.config.capacity) {
			this.queue.push({
				participant: participant,
				onProcessing: callbacks.onProcessing,
				onFinished: callbacks.onFinished
			});
			this.sendPositions(participant);

		} else {
			callbacks && callbacks.onError && onError();
		}
	}

	remove(participant) {
		this.queue.filter(element => element.participant !== participant);
		if (this.inProcess && this.inProcess.participant === participant) {
			this.inProcess = null;
		} 

		this.sendPositions();
	}

	start() {
		this.processNext();
		setInterval(this.processNext.bind(this), this.config.ttl);
	}

	processNext() {
		if (this.inProcess && this.inProcess.onFinished) {
			this.inProcess.onFinished(this.inProcess.participant);
			this.inProcess = null;
		}

		if (this.queue.length > 0) {
			this.inProcess = this.queue.shift();

			this.inProcess.onProcessing && this.inProcess.onProcessing({
				participant: this.inProcess.participant,
				ttl: this.config.ttl
			});
		}

		this.sendPositions();

	}

	sendPositions(participant) {
		if (participant) {
			let position = 0;
			this.queue.forEach((element, index) => {
				if (element.participant === participant) {
					position = index;
				}
			});
			participant.positionInQueue(position);
		}

		this.queue.forEach((element, index) => {
			element.participant.positionInQueue(index)
		});
	}

	getCurrentParticipant() {
		return (this.inProcess) ? this.inProcess.participant : null;
	}

	isParticipantInQueue(participant) {
		return this.queue.some(element => element.participant === participant);
	}

	getAllParticipants() {
		return this.queue.slice().map(element => element.participant);
	}

}

module.exports = ParticipantQueue;