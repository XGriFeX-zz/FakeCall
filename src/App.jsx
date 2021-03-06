import React, { useEffect, useRef, useState } from 'react';
import CallsStatisticList from './components/CallsStatisticList/CallsStatisticList';

import './App.sass';
import getRandromId from './utils/getRandromId';

function App() {
  const [calls, setCalls] = useState([]);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const startBtnRef = useRef(null);
  const callBtnRef = useRef(null);
  const hangUpBtnRef = useRef(null);
  const localStream = useRef(null);
  const randomId = getRandromId(null);
  const startTime = useRef(null);
  const endTime = useRef(null);
  const pc1 = useRef(null);
  const pc2 = useRef(null);

  useEffect(() => {
    callBtnRef.current.disabled = true;
    hangUpBtnRef.current.disabled = true;
  }, []);

  const getOtherPc = (pc) => (pc === pc1.current ? pc2.current : pc1.current);

  const gotRemoteStream = (e) => {
    const [MediaStream] = e.streams;

    if (remoteVideoRef.current.srcObject !== e.streams[0]) {
      remoteVideoRef.current.srcObject = MediaStream;
    }
  };

  const onCreateAnswerSuccess = async (desc) => {
    try {
      await pc2.current.setLocalDescription(desc);
    } catch (e) {
      throw Error;
    }

    try {
      await pc1.current.setRemoteDescription(desc);
    } catch (e) {
      throw Error;
    }
  };

  const onCreateOfferSuccess = async (desc) => {
    try {
      await pc1.current.setLocalDescription(desc);
    } catch (e) {
      throw Error;
    }

    try {
      await pc2.current.setRemoteDescription(desc);
    } catch (e) {
      throw Error;
    }

    try {
      const answer = await pc2.current.createAnswer();
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
  };

  const call = () => {
    startTime.current = new Date();
    callBtnRef.current.disabled = true;
    hangUpBtnRef.current.disabled = false;
    pc1.current = new RTCPeerConnection({});
    pc1.current.addEventListener('icecandidate', (e) => onIceCandidate(pc1.current, e));
    pc2.current = new RTCPeerConnection({});
    pc2.current.addEventListener('icecandidate', (e) => onIceCandidate(pc2.current, e));
    pc2.current.addEventListener('track', gotRemoteStream);

    localStream.current.getTracks()
      .forEach((track) => pc1.current.addTrack(track, localStream.current));

    pc1.current.createOffer({
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1,
    }).then((offer) => { onCreateOfferSuccess(offer); });
  };

  const hangUp = () => {
    endTime.current = new Date();
    pc1.current.close();
    pc2.current.close();
    pc1.current = null;
    pc2.current = null;
    callBtnRef.current.disabled = false;
    hangUpBtnRef.current.disabled = true;
    setCalls((prev) => [...prev, {
      id: randomId(),
      date: {
        startTime: startTime.current,
        endTime: endTime.current,
      },
    }]);
  };

  return (
    <div className="container">
      <div className="wrapper">
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
        <CallsStatisticList calls={calls} setCalls={setCalls} />
      </div>
    </div>
  );
}

export default App;
