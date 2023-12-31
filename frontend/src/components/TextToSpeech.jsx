import React, { useEffect, useRef, useState } from "react";
import "../styles/TextToSpeech.css";
import Clip from "../assets/images/Clip.png";
import Microphone from "../assets/images/Microphone.png";
import VideoImage from "../assets/images/VideoImage.png";
import OuterCircle from "../assets/images/OuterCircle.png";
import InnerCircle from "../assets/images/InnerCircle.png";
import Pause from "../assets/images/Pause.png";
import Header from "./Header";
import { Button, Input } from "@mui/base";
import BackgroundVideo from "../assets/videos/Background-Video.mp4";
import { Link, useNavigate } from "react-router-dom";
import Video from "./Video";
import ChatPrint from "./ChatPrint";
import axios from "axios";

const TextToSpeech = ({ chatList, setChatList, userEmail, socket }) => {
  const [text, setText] = useState("");
  const [textToSpeak, setTextToSpeak] = useState("");

  const navigate = useNavigate();

  // Function to scroll chat container to the bottom
  const chatContainerRef = useRef(null);
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [chatList]);

  // Response from OpenAI is received
  socket.on("receiveMessage", (data) => {
    const newList = [...chatList, { role: "assistant", message: data.message }];
    setChatList(newList);
    setTextToSpeak(data.message);
    socket.emit("userEmail", { userEmail });
  });

  const handleSubmit = () => {
    socket.emit("sendMessage", { text, userEmail });
    const newList = [...chatList, { role: "user", message: text }];
    setChatList(newList);
    setText("");
  };

  // Converting response generated to Speech
  const speak = () => {
    if ("speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      synth.cancel(); // Clear any existing utterances
      synth.speak(utterance);
    } else {
      console.error("Speech synthesis not supported");
    }
    setTextToSpeak("");
  };
  useEffect(() => {
    if (textToSpeak !== "") {
      speak(); // Start speech synthesis when text is available
    }
  }, [textToSpeak]);

  const fetchOldChats = async () => {
    const chatResponse = await axios.post(
      "https://chat-app-td6w.onrender.com/api/chats",
      {
        email: userEmail,
      }
    );
    const chatList = chatResponse.data.chats.map((item) => {
      return {
        role: item.role,
        message: item.content,
      };
    });
    setChatList(chatList);
  };

  useEffect(() => {
    if (userEmail === "") {
      navigate("/");
    } else {
      fetchOldChats();
    }
  }, []);

  return (
    <div className="textToSpeech">
      <Header />
      <video
        autoPlay
        loop
        muted="false"
        className="background-icon"
        alt="BackgroundImage"
        src={BackgroundVideo}
      />
      <div className="outer-box">
        <div className="big-box">
          <div className="inner-box" />
          <div className="chats" ref={chatContainerRef}>
            <ChatPrint chatList={chatList} />
          </div>
          <div className="text-input">
            <div className="text-area">
              <Input
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                }}
              />
            </div>
            <div className="icons">
              <Button>
                <img className="inner-icons" src={Clip} alt="" />
              </Button>

              <Button onClick={handleSubmit}>
                <img className="inner-icons" src={Microphone} alt="" />
              </Button>
            </div>
          </div>
        </div>
        <div className="lower-box">
          <div className="text-box">
            <div className="small-video">
              <Video />
            </div>
            <div className="button-div">
              <Link to="/speechToText">
                <Button className="chat-button">
                  <img
                    className="mute-button"
                    alt="ChatButton"
                    src={VideoImage}
                  />
                </Button>
              </Link>
              <p>Video</p>
            </div>
          </div>
          <div className="pause-button-div">
            <Button className="pause-box">
              <img
                className="outer-circle"
                alt="ChatButton"
                src={OuterCircle}
              />
              <img className="inner-circle" src={InnerCircle} alt="" />
              <img className="pause-btn" src={Pause} alt="" />
              <p>Pause</p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextToSpeech;
