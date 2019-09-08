import React, { useState } from 'react';
import Layout from '../components/layout';
import Join from '../components/join';
import useTwilioVideo from '../hooks/use-twilio-video';

const Video = ({ token }) => {
  const { videoRef } = useTwilioVideo(token);

  return <div className="chat" ref={videoRef} />;
};

export default () => {
  const [token, setToken] = useState(false);

  return (
    <Layout>
      {token ? <Video token={token} /> : <Join storeToken={setToken} />}
    </Layout>
  );
};
