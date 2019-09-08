import { useEffect, useRef } from 'react';
import { connect, createLocalVideoTrack } from 'twilio-video';

const handleRemoteParticipant = container => participant => {
  // Attach participant audio and video tracks to the DOM.
  participant.tracks.forEach(publication => {
    if (publication.isSubscribed) {
      console.group('existing track');
      const track = publication.track;
      console.log(track);
      const el = track.attach();
      el.id = track.id;

      console.log(el);

      container.appendChild(el);
      console.groupEnd();
    }
  });

  participant.on('trackSubscribed', track => {
    console.group('trackSubscribed');
    console.log(track);
    const el = track.attach();
    el.id = track.sid;

    console.log(el);
    container.appendChild(el);
    console.groupEnd();
  });

  participant.on('trackMessage', track => {
    console.group('trackMessage');
    console.log(track);
    track.detach().forEach(el => {
      console.log(el);
      el.remove();
    });
    console.groupEnd();
  });

  participant.on('trackDisabled', track => {
    console.group('trackDisabled');
    console.log(track);
    track.detach().forEach(el => {
      console.log(el);
      el.remove();
    });
    console.groupEnd();
  });

  participant.on('trackUnpublished', track => {
    console.group('trackUnpublished');
    console.log(track);
    track.detach().forEach(el => {
      console.log(el);
      el.remove();
    });
    console.groupEnd();
  });

  participant.on('trackUnsubscribed', track => {
    console.group('trackUnsubscribed');
    console.log(track);
    track.detach().forEach(el => {
      console.log(el);
      el.remove();
    });
    console.groupEnd();
  });

  participant.on('disconnected', participant => {
    console.group('disconnected');
    console.log(participant);
    // track.detach().forEach(el => {
    //   console.log(el);
    //   el.remove();
    // });
    console.groupEnd();
  });
};

const connectToRoom = async ({ token, videoRef }) => {
  if (!token) {
    return;
  }

  const room = await connect(
    token,
    { name: 'test', audio: true, video: { width: 640 } },
  ).catch(error => {
    console.error(`Unable to join the room: ${error.message}`);
  });

  console.log(`Successfully joined ${room}`);

  const localTrack = await createLocalVideoTrack().catch(error => {
    console.error(`Unable to create local tracks: ${error.message}`);
  });

  // Attach the local video if it’s not already visible.
  if (!videoRef.current.hasChildNodes()) {
    const localEl = localTrack.attach();
    localEl.className = 'local-video';

    videoRef.current.appendChild(localEl);
  }

  const handleParticipant = handleRemoteParticipant(videoRef.current);

  // Handle any participants who are *already* connected to this room.
  room.participants.forEach(participant => {
    console.group('room.participants');
    console.log(`${participant.identity} is already in this room.`);
    handleParticipant(participant);
    console.groupEnd();
  });

  // Handle participants who join *after* you’ve connected to the room.
  room.on('participantConnected', participant => {
    console.group('participantConnected');
    console.log(`${participant.identity} has joined the room.`);
    handleParticipant(participant);
    console.groupEnd();
  });

  room.on('participantDisconnected', participant => {
    console.log(`${participant.identity} has left the room.`);
  });

  console.groupEnd();
};

const useTwilioVideo = token => {
  const videoRef = useRef();

  useEffect(() => {
    connectToRoom({
      token,
      videoRef,
    });
  }, [token]);

  return { videoRef };
};

export default useTwilioVideo;
