import React, { Component, createRef, useRef } from "react";

import Peer from "peerjs";

const randStr = () => Math.random().toString().substr(4, 4);

class P2PClient extends Component {
  state = {
    myPeerConnectionId: this.props.id + "-" + randStr(),
    remotePeerConnectionId: "past it there",
    messages: [],
  };

  constructor(props) {
    super(props);
    this.myCam = createRef();
    this.remoteCam = createRef();
  }

  componentDidMount = () => {
    // usurpation des ids possible
    this.peer = new Peer(this.state.myPeerConnectionId);
    this.peerList = [];

    this.peer.on("open", (id) => {
      this.setState({ myPeerConnectionId: id });
      this.logMessage("peer crée avec l'id: " + id);
    });

    // * si on reçois un appel
    this.peer.on("call", async (call) => {
      const rep = prompt(
        `Call from ${call.peer}, did you want to accept connection ? (yes/no)`
      );
      if (rep != "yes" && rep != "") return;

      // * pour ne pas que quelqu'un d'autre se connecte
      this.peerList.push(call.peer);
      if (this.peerList.length > 1) return;
      this.setState({ remotePeerConnectionId: call.peer });
      let alreadyRecievedStream = false;

      // * TODO POPUP Accepter et Refuser
      // * on met le rendu vidéo dans un <video>
      call.on("stream", (stream) => {
        if (alreadyRecievedStream) return; // * sinon bug de duplication
        alreadyRecievedStream = true;
        this.handleRemoteVideo(stream);
      });

      // * et on renvoie notre stream à nous
      try {
        const myStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        call.answer(myStream);
        this.handleMyVideo(myStream);
      } catch (err) {
        console.log(err);
        this.logMessage(JSON.stringify(err));
      }
    });
  };

  logMessage = (msg) => {
    const { messages } = this.state;
    this.setState({ messages: [...messages, msg] });
  };

  handleConnection = () => {
    const { remotePeerConnectionId } = this.state;
    this.logMessage("connecting to : " + remotePeerConnectionId);
    this.handlePeerCall(remotePeerConnectionId);
  };

  handlePeerCall = async (remotePeerId) => {
    try {
      // * on récupère le flux de notre cam et de notre mic
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // * on appelle l'autre peer et on lui envoie un flux
      let call = this.peer.call(remotePeerId, stream);

      this.peerList.push(call.peer);
      // * pour que personne ne puisse l'appeler derrière
      if (this.peerList.length > 1) return;

      this.handleMyVideo(stream);

      let alreadyRecievedStream = false;
      // * si on reçois un flux on le traite
      call.on("stream", (remoteStream) => {
        if (alreadyRecievedStream) return; // * sinon bug de duplication
        alreadyRecievedStream = true;
        this.handleRemoteVideo(remoteStream);
      });
    } catch (err) {
      console.log(err);
      this.logMessage(JSON.stringify(err));
    }
  };

  handleRemoteVideo = (remoteStream) => {
    this.remoteCam.current.classList.add("video");
    this.remoteCam.current.srcObject = remoteStream;
    this.remoteCam.current.play();
  };

  handleMyVideo = (myStream) => {
    this.myCam.current.classList.add("video");
    this.myCam.current.srcObject = myStream;
    this.myCam.current.play();
    this.myCam.current.muted = true;
  };

  handleChange = ({ currentTarget: input }) => {
    this.setState({ [input.name]: input.value });
  };

  render() {
    let { myPeerConnectionId, remotePeerConnectionId, messages } = this.state;
    return (
      <div className="w-full h-full">
        <div className="space-x-2 mb-3">
          <label htmlFor="myPeerConnectionId">Your ID:</label>
          <input
            name="myPeerConnectionId"
            className="bg-gray-200 w-min rounded text-black px-2 text-center"
            value={myPeerConnectionId}
          />
        </div>
        <div className="space-x-2 mb-3">
          <label htmlFor="remotePeerConnectionId">Friend ID:</label>
          <input
            name="remotePeerConnectionId"
            className="bg-gray-200 w-min rounded text-black px-2 text-center"
            value={remotePeerConnectionId}
            onChange={this.handleChange}
          />
          <button
            className="bg-red-500 rounded p-1 w-min self-center"
            onClick={this.handleConnection}
          >
            Connect!
          </button>
        </div>
        Videos:
        <div className="flex flex-col md:flex md:flex-row">
          <video ref={this.myCam} className="h-1/3 w-1/3" />
          <video ref={this.remoteCam} className="h-1/3 w-1/3" />
        </div>
        <div className="bg-green-300 text-black rounded overflow-auto">
          <span className="bg">Log:</span>
          {messages.map((msg) => (
            <div>{msg}</div>
          ))}
        </div>
      </div>
    );
  }
}

export default P2PClient;
