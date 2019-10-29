import React, { useState } from 'react';

const Join = () => {
  const [identity, setIdentity] = useState('');
  const [roomName, setRoomName] = useState('');

  return (
    <>
      <h1>Start or Join a Video Call</h1>
      <form className="start-form">
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
