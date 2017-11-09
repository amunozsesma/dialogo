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
	ttl: <timeToLeavePerClient>,
	currentTtl: <timeConsumedInCurrentConversation>
	connectedUsers: <numberOfUsers>
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
client-queue-message,
{
	type: turnInfo,
	payload: {
		side: <side>,
		isTalking: <Boolean>,
		info: <turnsleft, etc>
	}
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

```
server-queue-message,
{
	type: turnInfo,
	payload: {
		side: <side>,
		isTalking: <Boolean>,
		info: <turnsleft, etc>
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
