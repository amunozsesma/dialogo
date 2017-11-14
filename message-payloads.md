INIT MESSAGES
=====================
**From Client**

```
join,
<roomName>
```

**From Server**

```
room-info,
	streams: [
		{
			id: <streamID>,
			side: <side>
		},
		{
			id: <streamID>,
			side: <side>
		}
	],
	connectedUsers: <numberOfUsers>,
	roomTTL: <time unaltered for each conversation configured for this room>

```

SIGNALING - QUEUES
=====================
**From Client**

```
client-queue-message,
{
	type: addMeToQueue,
	payload: <side>
}
```
```
client-queue-message, --> cancel button
{
	type: removeMeFromQueue,
	payload: <side>
}
```

**From Server**

```
server-queue-message,
{
	type: positionInQueue,
	payload: {
		side: <side>,
		position: <positionInQueue>
	}
}
```


SIGNALING - CONVERSATION
=====================
**From Client**
```
client-conversation-message, 
{
	type: conversationEnd,
	payload: {
		side: <side>
	}
}
```

**From Server**
```
server-conversation-message,
{
	type: conversationStart,
	payload: {
		side: <side>
	}
}
```

```
server-conversation-message, --> sent to all clients, when connecting and when client turnInfo is received (spreads the client info) 
{
	type: conversationInfo,
	payload: {
		discussionTTL: <ttl left in discussion>,
		left: {
			isTalking: <Boolean>,
			TTL: <ttl left in left conversation>,
			turnTTL: <0 | ttl left in current turn if it is talking> 
		},
		right: {
			isTalking: <Boolean>,
			TTL: <ttl left in right conversation>,
			turnTTL: <0 || ttl left in current turn if it is talking>
		}
	}
}
```


SIGNALING - WEBRTC
=====================
**From Client**

```
client-webrtc-message,
{
	type: join,
	payload: offer: <sdpOffer>
}
```

```
client-webrtc-message,
{
	type: offerMe
}
```

```
client-webrtc-message,
{
	type: answer,
	payload: <sdpAnswer>
}
```

**From Server**
```
server-webrtc-message,
{
	type: offer,
	payload: <sdpOffer>
}
```

```
server-webrtc-message,
{
	type: sendLocalStream,
	payload: <side>
}
```

```
server-webrtc-message,
{
	type: removeLocalStream,
	payload: <side>
}
```
