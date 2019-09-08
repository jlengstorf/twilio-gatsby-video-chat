import React, { useState } from 'react';
import axios from 'axios';

const Join = ({ storeToken }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  const handleSubmit = async event => {
    event.preventDefault();

    const result = await axios({
      method: 'POST',
      url: 'https://jasmine-greyhound-8600.twil.io/create-room-token',
      data: { identity: name, room },
    });

    storeToken(result.data);
  };

  return (
    <form onSubmit={handleSubmit} className="start-form">
      <label htmlFor="name">
        Display name:
        <input
          type="text"
          id="name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label htmlFor="room">
        Name Your Chat Room
        <input
          type="text"
          id="room"
          value={room}
          onChange={e => setRoom(e.target.value)}
        />
      </label>
      <button type="submit">Join Video Chat</button>
    </form>
  );
};

export default Join;
