import React, { useEffect } from 'react';
import { navigate } from 'gatsby';
import useTwilioVideo from '../hooks/use-twilio-video';

const VideoDisplay = ({ roomID }) => {
  const { state } = useTwilioVideo();
  const { token } = state;

  useEffect(() => {
    if (!token) {
      navigate('/', { state: { roomName: roomID } });
    }
  }, [token, roomID]);

  return (
    <>
      <h1>Room: “{roomID}”</h1>
    </>
  );
};

export default VideoDisplay;
