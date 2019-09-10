import React, { useEffect } from 'react';
import { navigate } from 'gatsby';
import useTwilioVideo from '../hooks/use-twilio-video';

const VideoDisplay = ({ roomID }) => {
  const {
    token,
    videoRef,
    activeRoom,
    startVideo,
    leaveRoom,
  } = useTwilioVideo();

  useEffect(() => {
    if (!roomID) {
      navigate('/');
    }

    if (!token) {
      navigate('/', { state: { room: roomID } });
    }

    if (!activeRoom) {
      startVideo();
    }

    // Add a window listener to disconnect if the tab is closed. This works
    // around a looooong lag before Twilio catches that the video is gone.
    window.addEventListener('beforeunload', leaveRoom);

    return () => {
      window.removeEventListener('beforeunload', leaveRoom);
    };
  }, [token, roomID, activeRoom, startVideo, leaveRoom]);

  return (
    <>
      <h1>Room: “{roomID}”</h1>
      {activeRoom && <button onClick={leaveRoom}>Leave Room</button>}
      <div className="chat" ref={videoRef} />
    </>
  );
};

export default VideoDisplay;
