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
[
	{
		id: <streamID>,
		side: <side>
	},
	{
		id: <streamID>,
		side: <side>
	}
]
```


SIGNALING - QUEUES
=====================
**From Client**

```
queue-message,
{
	type: addMeToQueue,
	payload: <side>
}
```

**From Server**

```
queue-message,
{
	type: positionInQueue,
	payload: {
		side: <side>,
		position: <positionInQueue>
	}
}
```

```
queue-message, (provisional, might need to be expanded for turns)
{
	type: remoteStreamInfo,
	payload: {
		side: <side>,
		ttl: <timeToLeave> --> starts counter on client side
	}
}
```


SIGNALING - WEBRTC
=====================
**From Client**

```
webrtc-message,
{
	type: join,
	payload: offer: <sdpOffer>
}
```

```
webrtc-message,
{
	type: offerMe
}
```

```
webrtc-message,
{
	type: answer,
	payload: <sdpAnswer>
}
```

**From Server**
```
webrtc-message,
{
	type: offer,
	payload: <sdpOffer>
}
```

```
webrtc-message,
{
	type: sendLocalStream,
	payload: <side>
}
```

```
webrtc-message,
{
	type: removeLocalStream,
	payload: <side>
}
```
