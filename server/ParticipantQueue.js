class ParticipantQueue {
	constructor(config) {
		this.queue = [];
		this.inProcess = null;

		this.ttl = (config.ttl) ? config.ttl : 40000;
		this.capacity = (config.queueCapacity) ? config.queueCapacity : 20;

		this.start();
	}

	add(participant, callbacks) {

		if (this.queue.length < this.capacity) {
			this.queue.push({
				participant: participant,
				onProcessing: callbacks.onProcessing,
				onFinished: callbacks.onFinished
			});
			this.sendPositions(participant);

		} else {
			callbacks && callbacks.onError && onError();
		}

		if (this.ttl === 0) {
			this.processNext();
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

		if (this.ttl > 0) {
			setInterval(this.processNext.bind(this), this.ttl);
		}
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
				ttl: this.ttl
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
		return (this.inProcess && this.inProcess.participant === participant)
			|| this.queue.some(element => element.participant === participant);
	}

	getAllParticipants() {
		return this.queue.slice().map(element => element.participant);
	}

}

module.exports = ParticipantQueue;