import React, { createContext, useContext, useReducer, useRef } from 'react';
import axios from 'axios';
import { connect } from 'twilio-video';

const TWILIO_TOKEN_URL = 'https://corn-ant-4095.twil.io/create-room-token';

const DEFAULT_STATE = {
  identity: false,
  roomName: false,
  token: false,
  room: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'join':
      return {
        ...state,
        token: action.token,
        identity: action.identity,
        roomName: action.roomName,
      };

    case 'set-active-room':
      return { ...state, room: action.room };

    default:
      return DEFAULT_STATE;
  }
};

const TwilioVideoContext = createContext();

const TwilioVideoProvider = ({ children }) => (
  <TwilioVideoContext.Provider value={useReducer(reducer, DEFAULT_STATE)}>
    {children}
  </TwilioVideoContext.Provider>
);

export const wrapRootElement = ({ element }) => (
  <TwilioVideoProvider>{element}</TwilioVideoProvider>
);

const useTwilioVideo = () => {
  const [state, dispatch] = useContext(TwilioVideoContext);
  const videoRef = useRef();

  const getRoomToken = async ({ identity, roomName }) => {
    const result = await axios.post(TWILIO_TOKEN_URL, {
      identity,
      room: roomName,
    });

    dispatch({ type: 'join', token: result.data, identity, roomName });
  };

  const connectToRoom = async () => {
    if (!state.token) {
      return;
    }

    const room = await connect(
      state.token,
      {
        name: state.roomName,
        audio: true,
        video: { width: 640 },
        logLevel: 'info',
      },
    ).catch(error => {
      console.error(`Unable to join the room: ${error.message}`);
    });

    const localTrack = [...room.localParticipant.videoTracks.values()][0].track;

    if (!videoRef.current.hasChildNodes()) {
      const localEl = localTrack.attach();

      videoRef.current.appendChild(localEl);
    }

    dispatch({ type: 'set-active-room', room });
  };

  const startVideo = () => connectToRoom();

  return { state, getRoomToken, startVideo, videoRef };
};

export default useTwilioVideo;
