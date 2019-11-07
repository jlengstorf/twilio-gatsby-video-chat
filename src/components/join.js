import React, { useState } from 'react';
import useTwilioVideo from '../hooks/use-twilio-video';

const Join = () => {
  const { state, dispatch } = useTwilioVideo();
  const [identity, setIdentity] = useState('');
  const [roomName, setRoomName] = useState('');

  const handleSubmit = event => {
    event.preventDefault();

    dispatch({ type: 'join', identity, roomName });
  };

  return (
    <>
      <h1>Start or Join a Video Call</h1>
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <form className="start-form" onSubmit={handleSubmit}>
        <label htmlFor="identity">
          Display name:
          <input
            type="text"
            id="identity"
            value={identity}
            onChange={event => setIdentity(event.target.value)}
          />
        </label>
        <label htmlFor="roomName">
          Which room do you want to join?
          <input
            type="text"
            id="roomName"
            value={roomName}
            onChange={event => setRoomName(event.target.value)}
          />
        </label>
        <button type="submit">Join Video Chat</button>
      </form>
    </>
  );
};

export default Join;
