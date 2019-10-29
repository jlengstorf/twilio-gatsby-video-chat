import React, { useEffect } from 'react';
import { navigate } from 'gatsby';
import useTwilioVideo from '../hooks/use-twilio-video';

const VideoDisplay = ({ roomID }) => {
  const { state, startVideo, videoRef } = useTwilioVideo();
  const { token, room } = state;

  useEffect(() => {
    if (!token) {
      navigate('/', { state: { roomName: roomID } });
    }

    if (!room) {
      startVideo();
    }
  }, [token, roomID, room, startVideo]);

  return (
    <>
      <h1>Room: “{roomID}”</h1>
      <div className="chat" ref={videoRef} />
    </>
  );
};

export default VideoDisplay;
