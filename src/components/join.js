import React, { useEffect, useState } from 'react';
import { navigate } from 'gatsby';
import useTwilioVideo from '../hooks/use-twilio-video';

const Join = ({ location }) => {
  const defaultRoom =
    (location && location.state && location.state.roomName) || '';
  const { state, getRoomToken } = useTwilioVideo();
  const [identity, setIdentity] = useState('');
  const [roomName, setRoomName] = useState(defaultRoom);

  const { token, roomName: roomNameFromState } = state;

  useEffect(() => {
    if (token && roomNameFromState) {
      navigate(`/room/${roomNameFromState}`);
    }
  }, [token, roomNameFromState]);

  const handleSubmit = event => {
    event.preventDefault();

    getRoomToken({ identity, roomName });
  };

  return (
    <>
      <h1>Start or Join a Video Call</h1>
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
