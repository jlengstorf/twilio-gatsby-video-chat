import React, { createContext, useContext, useReducer } from 'react';

const DEFAULT_STATE = {
  identity: false,
  roomName: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'join':
      return { ...state, identity: action.identity, roomName: action.roomName };

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

  return { state, dispatch };
};

export default useTwilioVideo;
