import React, { useEffect, useRef } from 'react';

import './App.sass';

function App() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const startBtnRef = useRef(null);
  const callBtnRef = useRef(null);
  const hangUpBtnRef = useRef(null);
  const localStream = useRef();
  let startTime;
  let endTime;
  let pc1;
  let pc2;

  useEffect(() => {
    callBtnRef.current.disabled = true;
    hangUpBtnRef.current.disabled = true;
  }, []);

  const getOtherPc = (pc) => (pc === pc1 ? pc2 : pc1);

  const gotRemoteStream = (e) => {
    const [MediaStream] = e.streams;

    if (remoteVideoRef.current.srcObject !== e.streams[0]) {
      remoteVideoRef.current.srcObject = MediaStream;
    }
  };

  const onCreateAnswerSuccess = async (desc) => {
    try {
      await pc2.setLocalDescription(desc);
    } catch (e) {
      throw Error;
    }

    try {
      await pc1.setRemoteDescription(desc);
    } catch (e) {
      throw Error;
    }
  };

  const onCreateOfferSuccess = async (desc) => {
    try {
      await pc1.setLocalDescription(desc);
    } catch (e) {
      throw Error;
    }

    try {
      await pc2.setRemoteDescription(desc);
    } catch (e) {
      throw Error;
    }

    try {
      const answer = await pc2.createAnswer();
      await onCreateAnswerSuccess(answer);
    } catch (e) {
      throw Error;
    }
  };

  const onIceCandidate = async (pc, event) => {
    try {
      await (getOtherPc(pc).addIceCandidate(event.candidate));
    } catch (e) {
      throw Error;
    }
  };

  const start = () => {
    startBtnRef.current.disabled = true;
    callBtnRef.current.disabled = false;
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    }).then((dataStream) => {
      localVideoRef.current.srcObject = dataStream;
      localStream.current = dataStream;
    });
    console.log(localVideoRef.current.offsetWidth);
  };

  const call = () => {
    startTime = new Date().getSeconds();
    callBtnRef.current.disabled = true;
    hangUpBtnRef.current.disabled = false;
    pc1 = new RTCPeerConnection({});
    pc1.addEventListener('icecandidate', (e) => onIceCandidate(pc1, e));
    pc2 = new RTCPeerConnection({});
    pc2.addEventListener('icecandidate', (e) => onIceCandidate(pc2, e));
    pc2.addEventListener('track', gotRemoteStream);

    localStream.current.getTracks()
      .forEach((track) => pc1.addTrack(track, localStream.current));

    pc1.createOffer({
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1,
    }).then((offer) => { onCreateOfferSuccess(offer); });
  };

  const hangUp = () => {
    endTime = new Date().getSeconds();
    console.log(`Time:  + ${endTime - startTime}`);
    pc1.close();
    pc2.close();
    pc1 = null;
    pc2 = null;
    callBtnRef.current.disabled = false;
    hangUpBtnRef.current.disabled = true;
  };

  return (
    <div className="container">
      <div className="video">
        <div className="video__cams">
          <video
            ref={localVideoRef}
            id="localVideo"
            autoPlay
            muted
          >
            <track kind="captions" />
          </video>
          <video
            id="remoteVideo"
            ref={remoteVideoRef}
            onLoadedMetadata={() => {
              remoteVideoRef.current.style.width = `${localVideoRef.current.offsetWidth}px`;
            }}
            autoPlay
          >
            <track kind="captions" />
          </video>
        </div>
        <div className="video__btns">
          <button
            ref={startBtnRef}
            onClick={start}
            type="button"
          >
            Start
          </button>
          <button
            ref={callBtnRef}
            onClick={call}
            type="button"
          >
            Call
          </button>
          <button
            ref={hangUpBtnRef}
            onClick={hangUp}
            type="button"
          >
            Hang up
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
