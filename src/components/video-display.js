import React from 'react';

const VideoDisplay = props => {
  return <pre>{JSON.stringify(props, null, 2)}</pre>;
};

export default VideoDisplay;
