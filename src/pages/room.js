import React from 'react';
import { Router } from '@reach/router';
import Layout from '../components/layout';
import VideoDisplay from '../components/video-display';

const Room = () => (
  <Layout>
    <Router>
      <VideoDisplay path="room/:roomID" />
    </Router>
  </Layout>
);

export default Room;
