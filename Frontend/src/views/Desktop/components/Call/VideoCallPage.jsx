import React, { useCallback, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { Badge, Button, IconButton, TextField } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import MicIcon from "@mui/icons-material/Mic";
import ChatIcon from "@mui/icons-material/Chat";
import MicOffIcon from "@mui/icons-material/MicOff";
import SpeakerNotesOffIcon from "@mui/icons-material/SpeakerNotesOff";
import SendIcon from "@mui/icons-material/Send";
import Avatar from "@mui/material/Avatar";
import { deepPurple } from "@mui/material/colors";
import PersonIcon from "@mui/icons-material/Person";
import { useLocation, useNavigate } from "react-router-dom";

// const server_url = "http://localhost:8080";
const server_url = "http://10.146.154.89:8080";

var connections = {};

const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VideoCallPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state || null;

  var socketRef = useRef();
  let socketIdRef = useRef();

  let localVideoRef = useRef();

  const chatRef = useRef(null);

  let [isBottom, setBottom] = useState(true);

  let [videoAvailable, setVideoAvailable] = useState(true);
  let [audioAvailable, setAudioAvailable] = useState(true);

  let [video, setVideo] = useState();
  let [audio, setAudio] = useState();

  let [screen, setScreen] = useState(false);

  let [showModal, setModal] = useState(true);

  let [screenAvailable, setScreenAvailable] = useState(false);

  let [messages, setMessages] = useState([]);
  let [message, setMessage] = useState("");

  let [newMessages, setNewMessages] = useState(0);

  let [askForUsername, setAskForUsername] = useState(true);

  let [username, setUsername] = useState("");

  const videoRef = useRef([]);

  let [videos, setVideos] = useState([]);

  useEffect(() => {
    if(user) {
      setUsername(user.username);
    }
    
  }, [user]);

  const getPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoPermission) {
        setVideoAvailable(true);
      } else {
        setVideoAvailable(false);
      }

      const audioPermission = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      if (audioPermission) {
        setAudioAvailable(true);
      } else {
        setAudioAvailable(false);
      }

      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }

      if (videoAvailable || audioAvailable) {
        const userMediaStearm = await navigator.mediaDevices.getUserMedia({
          video: videoAvailable,
          audio: audioAvailable,
        });

        if (userMediaStearm) {
          window.localStream = userMediaStearm;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = userMediaStearm;
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getPermissions();
  }, []);

  let getUserMediaSuccess = (stream) => {
    console.log(stream, window.localStream);
    try {
      window.localStream.getTracks().forEach((track) => {
        track.stop();
      });
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);

      connections[id].createOffer().then((description) => {
        console.log("description", description);
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription }),
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setAudio(false);
          setVideo(false);

          try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoRef.current.srcObject = window.localStream;

          for (let id in connections) {
            connections[id].addStream(window.localStream);

            connections[id]
              .createOffer()
              .then((description) => {
                connections[id]
                  .setLocalDescription(description)
                  .then(() => {
                    socketRef.current.emit(
                      "signal",
                      id,
                      JSON.stringify({ sdp: connections[id].localDescription }),
                    );
                  })
                  .catch((e) => console.log(e));
              })
              .catch((e) => console.log(e));
          }
        }),
    );
  };

  let getUserMedia = async () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then((stream) => {
          console.log("Stream:", stream);
          console.log("Tracks:", stream.getTracks());
          console.log("Video tracks:", stream.getVideoTracks());
          console.log("Audio tracks:", stream.getAudioTracks());
          return stream;
        })
        .then((stream) => {
          getUserMediaSuccess(stream);
        })
        .then((stream) => {})
        .catch((e) => console.log(e));
    } else {
      try {
        let tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (e) {
        console.log(e);
      }
    }
  };

  let getDisplayMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for (let id in connections) {
      if (id == socketIdRef.current) continue;

      connections[id].addStream(window.localStream);

      connections[id]
        .createOffer()
        .then((description) => {
          connections[id]
            .setLocalDescription(description)
            .then(() => {
              socketRef.current.emit(
                "signal",
                id,
                JSON.stringify({ sdp: connections[id].localDescription }),
              );
            })
            .catch((e) => console.log(e));
        })
        .catch((e) => console.log(e));
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setScreen(false);

          try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoRef.current.srcObject = window.localStream;

          getUserMedia();
        }),
    );
  };

  useEffect(() => {
    console.log(video, audio);
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
    }
  }, [audio, video]);

  let gotMessageFromServer = async (fromId, message) => {
    const signal = JSON.parse(message);
    const pc = connections[fromId];

    console.log("sdp", signal.sdp);
    console.log("ice", signal.ice);
    console.log(pc.signalingState);

    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketRef.current.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          sdp: connections[fromId].localDescription,
                        }),
                      );
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }

      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  let connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false });

    socketRef.current.on("signal", gotMessageFromServer);

    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", window.location.href);
      socketIdRef.current = socketRef.current.id;

      socketRef.current.on("chat-message", addMessage);

      socketRef.current.on("user-left", (id) => {
        setVideos((videos) => videos.filter((video) => video.socketId !== id));
      });

      socketRef.current.on("user-joined", (id, clients) => {
        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection(
            peerConfigConnections,
          );

          connections[socketListId].onicecandidate = function (event) {
            if (event.candidate != null) {
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candidate }),
              );
            }
          };

          connections[socketListId].onaddstream = (event) => {
            let videoExists = videoRef.current.find(
              (video) => video.socketId === socketListId,
            );

            if (videoExists) {
              setVideos((videos) => {
                const updatedVideos = videos.map((video) =>
                  video.socketId === socketListId
                    ? { ...video, stream: event.stream }
                    : videos,
                );
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            } else {
              let newVideo = {
                socketId: socketListId,
                stream: event.stream,
                autoPlay: true,
                playsinline: true,
              };

              setVideos((videos) => {
                const updateVideos = [...videos, newVideo];
                videoRef.current = updateVideos;
                return updateVideos;
              });
            }
          };

          if (window.localStream !== undefined && window.localStream !== null) {
            connections[socketListId].addStream(window.localStream);
          } else {
            let blackSilence = (...args) =>
              new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            connections[socketListId].addStream(window.localStream);
          }
        });

        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue;

            try {
              connections[id2].addStream(window.localStream);
            } catch (e) {
              console.log(e);
            }

            connections[id2].createOffer().then((description) => {
              connections[id2]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id2,
                    JSON.stringify({ sdp: connections[id2].localDescription }),
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        }
      });
    });
  };

  let silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();

    let dst = oscillator.connect(ctx.createMediaStreamDestination());

    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: true });
  };

  let black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });
    canvas.getContext("2d").fillRect(0, 0, width, height);

    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  useEffect(() => {
    const socket = io(server_url);
    socketRef.current = socket;

    socket.on("chat-message", addMessage);

    return () => {
      socket.disconnect();
    };
  }, []);

  const addMessage = useCallback((data, sender, socketIdSender) => {
    console.log(data, sender, socketIdSender);
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: sender, data: data },
    ]);
    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prevNewMessages) => prevNewMessages + 1);
    }
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.removeAllListeners("chat-message");
    socket.on("chat-message", addMessage);
  }, [addMessage]);

  let getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };

  let handleVideo = () => {
    setVideo(!video);
  };

  let handleAudio = () => {
    setAudio(!audio);
  };

  let getDisplayMedia = () => {
    if (screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then((stream) => getDisplayMediaSuccess(stream))
          .then((stream) => {})
          .catch((e) => console.log(e));
      }
    }
  };

  useEffect(() => {
    if (screen !== undefined) {
      getDisplayMedia();
    }
  }, [screen]);

  let handleScreen = () => {
    setScreen(!screen);
  };

  let handleModal = () => {
    setModal(!showModal);
  };

  let handleMessage = () => {
    if (message !== "") {
      console.log(socketIdRef.current, message, username);
      socketRef.current.emit("chat-message", message, username);
      setMessage("");
    }
  };

  let handleScroll = () => {
    const container = chatRef.current;
    const theshold = 100;

    const bottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      theshold;

    setBottom(bottom);
  };

  useEffect(() => {
    if (!chatRef.current) return;
    if (isBottom) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  let handleEndCall = () => {
    try {
      let tracks = localVideoRef.current.srcObject.getTracks();
      tracks.forEach((tracks) => tracks.stop());
      localVideoRef.current.srcObject = null;
    } catch (e) {
      console.log(e);
    }

    if(localStorage.getItem("token")) {
      navigate("/home", { state: { username: username } });
    }else {
      navigate("/");
    }
  };

  let connect = () => {
    if (username !== "") {
      setAskForUsername(false);
      getMedia();
    }
  };

  let handleGoBack = () => {};

  return (
    <>
      {askForUsername == true ? (
        <div className="h-screen w-screen bg-black">
          <div className="container">
            <div className="row">
              <div className="col-6 h-screen d-flex justify-content-start align-items-center">
                <div className="bg-violet-500 p-5 rounded-4xl">
                  <h1 className="text-white pt-5 pb-2">Join Meeting</h1>
                  <TextField
                    className="my-3"
                    type="text"
                    label="Username"
                    variant="filled"
                    size="large"
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
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
                  <br />
                  <div className="d-flex justify-content-end gap-3 mt-3 mb-0">
                    <Button
                      variant="contained"
                      onClick={connect}
                      className="bg-white mb-5 mt-3"
                      sx={{ color: "#8b5cf6" }}
                    >
                      Join
                    </Button>
                  </div>
                </div>
                <div
                  className="w-[4px] h-50 mx-auto bg-violet-500 rounded-full 
shadow-[0_0_25px_6px_rgba(139,92,246,0.8)]
animate-pulse"
                ></div>
              </div>
              <div className="col-6 h-screen d-flex justify-content-end align-items-center">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  className="rounded-4xl"
                ></video>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative h-screen w-screen bg-black">
          {showModal ? (
            <div className="absolute right-0 h-screen bg-black w-sm d-flex justify-content-start align-items-center">
              <div
                className="w-[4px] h-50 mr-auto bg-violet-500 rounded-full 
shadow-[0_0_25px_6px_rgba(139,92,246,0.8)]
animate-pulse"
              ></div>
              <div className="relative z-20 rounded-xl bg-white/15 backdrop-blur-sm h-3/4 w-xs">
                <div className="h-full">
                  <h1
                    className="text-center mb-0 p-2 pb-3"
                    style={{
                      color: "#5B23FF",
                      borderBottom: "2px solid #5B23FF",
                    }}
                  >
                    Chat
                  </h1>

                  {console.log(messages)}
                  {messages.length !== 0 ? (
                    <div
                      ref={chatRef}
                      onScroll={handleScroll}
                      className="mx-3 my-2 overflow-y-auto overflow-x-hidden scolling-bar-hide scroll-smooth"
                      style={{ height: "450px", width: "auto" }}
                    >
                      {messages.map((item, index) => {
                        return (
                          <div key={index} className="p-0 mx-0 my-3">
                            <div className="row">
                              <div className="col-2 d-grid place-items-center h-50">
                                <Avatar sx={{ bgcolor: deepPurple[500] }}>
                                  <PersonIcon fontSize="small" />
                                </Avatar>
                              </div>
                              <div className="col-10 my-0 py-0 d-flex flex-column justify-content-start">
                                <p
                                  style={{ color: "#C5BAFF" }}
                                  className="p-0 m-0 fw-bolder"
                                >
                                  <i>{item.sender}</i>
                                </p>
                                <p
                                  style={{ color: "#5B23FF" }}
                                  className="p-0 m-0 text-wrap text-break"
                                >
                                  {item.data}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div
                      className="mx-3 my-2 d-grid place-items-center py-3"
                      style={{ height: "450px", width: "auto" }}
                    >
                      <p style={{ color: "#5B23FF", fontSize: "1.6rem" }}>
                        No Message Yet
                      </p>
                    </div>
                  )}
                </div>
                <div class="input-group position-absolute bottom-0">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Message"
                    aria-label="Message"
                    style={{ color: "#5B23FF" }}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button
                    class="btn"
                    type="button"
                    id="send"
                    style={{ backgroundColor: "#5B23FF" }}
                    onClick={handleMessage}
                  >
                    <SendIcon fontSize="large" style={{ color: "black" }} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className="absolute bottom-5 w-screen z-10">
            <div className="row d-flex justify-content-center">
              <div className="col-3 gap-5">
                <IconButton onClick={handleVideo} style={{ color: "white" }}>
                  {video === true ? (
                    <VideocamIcon fontSize="large" />
                  ) : (
                    <VideocamOffIcon fontSize="large" />
                  )}
                </IconButton>
                <IconButton style={{ color: "red" }} onClick={handleEndCall}>
                  <CallEndIcon fontSize="large" />
                </IconButton>
                <IconButton onClick={handleAudio} style={{ color: "white" }}>
                  {audio === true ? (
                    <MicIcon fontSize="large" />
                  ) : (
                    <MicOffIcon fontSize="large" />
                  )}
                </IconButton>
                {screenAvailable === true ? (
                  <IconButton
                    style={{ color: "white", marginRight: "10px" }}
                    onClick={handleScreen}
                  >
                    {screen ? (
                      <ScreenShareIcon fontSize="large" />
                    ) : (
                      <StopScreenShareIcon fontSize="large" />
                    )}
                  </IconButton>
                ) : (
                  <></>
                )}
                <Badge
                  badgeContent={newMessages}
                  onClick={handleModal}
                  max={999}
                  color="secondary"
                  style={{ color: "white" }}
                >
                  {showModal ? (
                    <ChatIcon fontSize="large" />
                  ) : (
                    <SpeakerNotesOffIcon fontSize="large" />
                  )}
                </Badge>
              </div>
            </div>
          </div>

          <video
            className="absolute bottom-20 left-10 h-45 w-auto rounded-2xl z-20"
            ref={localVideoRef}
            autoPlay
            muted
          ></video>
          {videos.length === 1
            ? videos.map((video) => (
                <div key={video.socketId} className="h-screen w-auto p-3">
                  <video
                    data-socket={video.socketId}
                    ref={(ref) => {
                      if (ref && video.stream) {
                        ref.srcObject = video.stream;
                      }
                    }}
                    autoPlay
                    className="h-full w-3/4 rounded-2xl object-cover"
                  ></video>
                </div>
              ))
            : videos.map((video) => (
                <div key={video.socketId} style={{ display: "flex" , gap: "10px" , padding: "10px"}}>
                  <video
                    style={{ width: "40vw" , height: "30vh" , minWidth: "30vw" , borderRadius: "10px"}}
                    data-socket={video.socketId}
                    ref={(ref) => {
                      if (ref && video.stream) {
                        ref.srcObject = video.stream;
                      }
                    }}
                    autoPlay
                  ></video>
                </div>
              ))}
        </div>
      )}
    </>
  );
}
