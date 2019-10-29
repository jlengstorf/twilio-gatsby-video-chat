import React, { useEffect } from 'react';
import { navigate } from 'gatsby';
import useTwilioVideo from '../hooks/use-twilio-video';

const VideoDisplay = ({ roomID }) => {
  const { state, startVideo, leaveRoom, videoRef } = useTwilioVideo();
  const { token, room } = state;

  useEffect(() => {
    if (!token) {
      navigate('/', { state: { roomName: roomID } });
    }

    if (!room) {
      startVideo();
    }

    window.addEventListener('beforeunload', leaveRoom);

    return () => {
      window.removeEventListener('beforeunload', leaveRoom);
    };
  }, [token, roomID, room, startVideo]);

  return (
    <>
      <h1>Room: “{roomID}”</h1>
      {room && (
        <button className="leave-room" onClick={leaveRoom}>
          Leave Room
        </button>
      )}
      <div className="chat" ref={videoRef} />
    </>
  );
};

export default VideoDisplay;
