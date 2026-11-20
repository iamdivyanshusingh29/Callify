import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import IconButton from "@mui/material/IconButton";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import TextField from "@mui/material/TextField";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import CameraswitchIcon from "@mui/icons-material/Cameraswitch";
import MessageIcon from "@mui/icons-material/Message";
import { useLocation, useNavigate } from "react-router-dom";

const server_url = "http://10.146.154.89:8080";

let connections = {};

export default function Meeting() {
  const socketRef = useRef();
  const socketIdRef = useRef();
  const localVideoRef = useRef();
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [call, setCall] = useState(false);

  const [video, setVideo] = useState(true);
  const [audio, setAudio] = useState(true);
  const [facingMode, setFacingMode] = useState("user");

  const [username, setUsername] = useState("");
  const [shake, setShake] = useState(false);

  const [showControls, setShowControls] = useState(true);
  const location = useLocation();
  const user = location.state || null;

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);

  const start = async () => {
    console.log("START CLICKED");
    if (!username.trim()) {
      inputRef.current?.focus();
      setShake(true);
      setTimeout(() => setShake(false), 300);
    } else {
      await initStream();
      connectSocket();
      setCall(true);
    }
  };

  const initStream = async () => {
    console.log("INIT STREAM");
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    console.log("Audio Tracks:", stream.getAudioTracks());
    console.log("Video Tracks:", stream.getVideoTracks());

    console.log(stream);

    window.localStream = stream;
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
      localVideoRef.current.muted = true;
      await localVideoRef.current.play().catch((e) => console.log(e));
    }
  };

  const connectSocket = () => {
    console.log("CONNECT SOCKET");
    console.log("Connecting to:", server_url);

    console.log(window.location.href);
    console.log(window.location.origin);
    console.log(window.location.hostname);

    socketRef.current = io(server_url, {
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current.on("connect", () => {
      console.log("✅ Connected:", socketRef.current.id);
    });

    socketRef.current.on("connect_error", (err) => {
      console.log("❌ connect_error:", err.message);
    });

    socketRef.current.on("error", (err) => {
      console.log("❌ socket error:", err);
    });

    socketRef.current.on("connect", () => {
      socketIdRef.current = socketRef.current.id;
      socketRef.current.emit("join-call", window.location.href);
      console.log("socket connected:", socketRef.current.id);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Reconnecting...");
    });

    socketRef.current.on("connect_error", (err) => {
      console.log("Connection Failed:", err);
    });

    socketRef.current.on("signal", (fromId, msg) => {
      console.log("signal-recived", fromId);
    });

    socketRef.current.on("signal", handleSignal);

    socketRef.current.on("user-left", (id) => {
      setVideos((prev) => prev.filter((video) => video.socketId !== id));
      delete connections[id];
    });

    socketRef.current.on("user-joined", (id, clients) => {
      clients.forEach((socketListId) => {
        if (connections[socketListId]) return;

        const pc = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        connections[socketListId] = pc;

        window.localStream.getTracks().forEach((track) => {
          pc.addTrack(track, window.localStream);
        });

        pc.ontrack = (event) => {
          setVideos((prev) => {
            const exists = prev.find((v) => v.socketId === socketListId);
            if (exists) return prev;
            return [
              ...prev,
              { socketId: socketListId, stream: event.streams[0] },
            ];
          });
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socketRef.current.emit(
              "signal",
              socketListId,
              JSON.stringify({ ice: event.candidate }),
            );
          }
        };
      });

      if (id === socketIdRef.current) {
        for (let id2 in connections) {
          if (id2 === socketIdRef.current) continue;

          if (id2 > socketIdRef.current) {
            connections[id2].createOffer().then((desc) => {
              connections[id2].setLocalDescription(desc).then(() => {
                socketRef.current.emit(
                  "signal",
                  id2,
                  JSON.stringify({ sdp: desc }),
                );
              });
            });
          }
        }
      }
    });
    socketRef.current.on("user-joined", (id, clients) => {
      console.log("USER JOINED");
      console.log(id);
      console.log(clients);
    });
  };

  const handleSignal = async (fromId, message) => {
    const signal = typeof message === "string" ? JSON.parse(message) : message;

    const pc = connections[fromId];
    if (!pc) return;

    if (signal.sdp) {
      await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));

      if (signal.sdp.type === "offer") {
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socketRef.current.emit(
          "signal",
          fromId,
          JSON.stringify({ sdp: answer }),
        );
      }
    }

    if (signal.ice) {
      await pc.addIceCandidate(new RTCIceCandidate(signal.ice));
    }
  };

  const cleanup = () => {
    try {
      window.localStream?.getTracks().forEach((t) => t.stop());
    } catch (e) {
      console.log(e);
    }

    for (let id in connections) {
      connections[id].close();
    }
    connections = {};

    socketRef.current?.disconnect();
  };

  const handleVideo = () => {
    window.localStream
      .getVideoTracks()
      .forEach((t) => (t.enabled = !t.enabled));
    setVideo(!video);
  };

  const handleAudio = () => {
    window.localStream
      .getAudioTracks()
      .forEach((t) => (t.enabled = !t.enabled));
    setAudio(!audio);
  };

  const handleSwitchCam = async () => {
    try {
      const nextMode = facingMode === "user" ? "environment" : "user";

      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: nextMode },
        },
        audio: false,
      });

      const newVideoTrack = videoStream.getVideoTracks()[0];

      Object.values(connections).forEach((pc) => {
        const sender = pc.getSenders().find((s) => s.track?.kind === "video");

        if (sender) {
          sender.replaceTrack(newVideoTrack);
        }
      });

      // Stop only the previous camera
      window.localStream.current
        .getVideoTracks()
        .forEach((track) => track.stop());

      const audioTrack = window.localStream.current.getAudioTracks()[0];

      const updatedStream = new MediaStream([newVideoTrack, audioTrack]);

      window.localStream.current = updatedStream;
      localVideoRef.current.srcObject = updatedStream;

      setFacingMode(nextMode);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEndCall = () => {
    cleanup();

    if (localStorage.getItem("token")) {
      navigate("/home", { state: { username: username } });
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    return cleanup;
  }, []);

  return (
    <>
      {call ? (
        <></>
      ) : (
        <div className="bg-black h-screen w-screen static p-0 m-0">
          <div className="bg-violet-500 text-white absolute bottom-0 left-0 right-0 w-screen h-[80%] border-none p-0 m-0 rounded-t-2xl">
            <div className="row flex justify-between text-center px-3 py-2 mb-5">
              <div className="col-2"></div>
              <div className="col-3">Username</div>
              <div className="col-2">
                <button onClick={start}>Join</button>
              </div>
            </div>
            <div className="grid place-items-center">
              <div className="rounded-full h-[50px] w-[50px] bg-black grid place-content-center">
                <AlternateEmailIcon fontSize="large" />
              </div>
              <div className="my-2">
                <p>{username}</p>
              </div>
              <form className="row g-3 needs-validation" noValidate>
                <div className="mt-3">
                  <TextField
                    ref={inputRef}
                    type="text"
                    label="Username"
                    variant="filled"
                    className={`border p-2 rounded ${shake ? "animate-shake" : ""}`}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    InputProps={{
                      style: { color: "white" },
                    }}
                    InputLabelProps={{
                      style: { color: "white" },
                    }}
                    sx={{
                      width: "290px",
                      "& .MuiFilledInput-root:before": {
                        borderBottomColor: "white",
                      },
                      "& .MuiFilledInput-root:after": {
                        borderBottomColor: "white",
                      },
                    }}
                    required
                  />
                </div>
              </form>
              <p className="text-black">
                Username are always have alphanumeric.
              </p>
            </div>
          </div>
        </div>
      )}

      <div
        className="h-screen w-screen relative"
        onClick={() => setShowControls((prev) => !prev)}
      >
        {call && showControls && (
          <div onClick={(e) => e.stopPropagation()}>
            <div className=" fixed bottom-2 z-50 w-screen">
              <div className="bg-black mx-auto my-0 w-[90%] p-2 rounded-4xl">
                <div className="d-flex align-content-center align-text-center justify-between">
                  <div className="bg-violet-500 rounded-full p-1">
                    <IconButton onClick={handleVideo}>
                      {video == true ? (
                        <VideocamIcon fontSize="large" />
                      ) : (
                        <VideocamOffIcon fontSize="large" />
                      )}
                    </IconButton>
                  </div>
                  <div className="bg-violet-500 rounded-full p-1">
                    <IconButton
                      style={{ color: "red" }}
                      onClick={handleEndCall}
                    >
                      <CallEndIcon fontSize="large" />
                    </IconButton>
                  </div>
                  <div className="bg-violet-500 rounded-full p-1">
                    <IconButton onClick={handleAudio}>
                      {audio === true ? (
                        <MicIcon fontSize="large" />
                      ) : (
                        <MicOffIcon fontSize="large" />
                      )}
                    </IconButton>
                  </div>
                  <div className="bg-violet-500 rounded-full p-1">
                    <IconButton onClick={handleSwitchCam}>
                      <CameraswitchIcon fontSize="large" />
                    </IconButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-black">
          {videos.map((v) => (
            <video
              key={v.socketId}
              ref={(ref) => ref && (ref.srcObject = v.stream)}
              autoPlay
              playsInline
              className="h-screen w-screen object-cover rounded-2xl"
            />
          ))}
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            className={`absolute left-5 h-[18vh] w-auto rounded-2xl z-10 ${showControls ? `bottom-24` : `bottom-5`}`}
          />
        </div>
      </div>
    </>
  );
}
