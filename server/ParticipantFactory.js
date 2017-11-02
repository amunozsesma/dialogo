const Participant = require('./MediasoupParticipant');

class ParticipantFactory {
	getParticipant(room, client) {
		return new Participant(room, client);
	}
}

module.exports = ParticipantFactory;