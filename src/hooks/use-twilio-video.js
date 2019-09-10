import React, { createContext, useContext, useReducer, useRef } from 'react';
import axios from 'axios';
import { connect, createLocalVideoTrack } from 'twilio-video';

const initialContext = {
  identity: false,
  room: false,
  token: false,
  activeRoom: false,
};

const reducer = (store, action) => {
  console.log({ store, action });
  switch (action.type) {
    case 'join':
      return {
        ...store,
        token: action.token,
        room: action.room,
        identity: action.identity,
      };

    case 'set-active-room':
      return {
        ...store,
        activeRoom: action.activeRoom,
      };

    case 'disconnect':
      store.activeRoom && store.activeRoom.disconnect();
      return initialContext;

    default:
      console.log(`Unknown action type: ${action.type}`);
      return store;
  }
};

export const TwilioVideoContext = createContext();

export const TwilioVideoProvider = ({ children }) => (
  <TwilioVideoContext.Provider value={useReducer(reducer, initialContext)}>
    {children}
  </TwilioVideoContext.Provider>
);

export const wrapRootElement = ({ element }) => (
  <TwilioVideoProvider>{element}</TwilioVideoProvider>
);

const handleRemoteParticipant = container => participant => {
  const addTrack = track => {
    // Create an HTML element to show the track (e.g. <audio> or <video>).
    const el = track.attach();

    // Attach the new element to the DOM.
    container.appendChild(el);
  };

  // Attach existing participant audio and video tracks to the DOM.
  participant.tracks.forEach(publication => {
    if (publication.isSubscribed) {
      addTrack(publication.track);
    }
  });

  // If new tracks get added later, add those, too.
  participant.on('trackSubscribed', addTrack);

  // When tracks are no longer available, remove the elements displaying them.
  participant.on('trackUnsubscribed', track => {
    // Get a list of elements from detach and remove them from the DOM.
    track.detach().forEach(el => el.remove());
  });
};

const useTwilioVideo = () => {
  const [store, dispatch] = useContext(TwilioVideoContext);
  const videoRef = useRef();
  const { room, token, activeRoom } = store;

  const getParticipantToken = async ({ identity, room }) => {
    const result = await axios({
      method: 'POST',
      url: 'https://jasmine-greyhound-8600.twil.io/create-room-token',
      data: { identity, room },
    });

    dispatch({ type: 'join', token: result.data, identity, room });
  };

  const connectToRoom = async () => {
    if (!token) {
      console.log('connectToRoom no token');
      return;
    }

    // Connect to the appropriate Twilio video chat room.
    const activeRoom = await connect(
      token,
      { name: room, audio: true, video: { width: 640 }, logLevel: 'info' },
    ).catch(error => {
      console.error(`Unable to join the room: ${error.message}`);
    });

    // Add your own video and audio tracks so you can see yourself.
    const localTrack = await createLocalVideoTrack().catch(error => {
      console.error(`Unable to create local tracks: ${error.message}`);
    });

    // Attach the local video if it’s not already visible.
    if (!videoRef.current.hasChildNodes()) {
      const localEl = localTrack.attach();
      localEl.className = 'local-video';

      videoRef.current.appendChild(localEl);
    }

    // Currying! Delicious! 🍛
    const handleParticipant = handleRemoteParticipant(videoRef.current);

    // Handle any participants who are *already* connected to this room.
    activeRoom.participants.forEach(handleParticipant);

    // Handle participants who join *after* you’ve connected to the room.
    activeRoom.on('participantConnected', handleParticipant);

    dispatch({ type: 'set-active-room', activeRoom });
  };

  const startVideo = () => connectToRoom();
  const leaveRoom = () => dispatch({ type: 'disconnect' });

  return {
    getParticipantToken,
    startVideo,
    leaveRoom,
    activeRoom,
    room,
    token,
    videoRef,
  };
};

export default useTwilioVideo;
