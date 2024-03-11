import React, { useState, useEffect, useRef } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import moment from "moment";
import { VscSend } from "react-icons/vsc";
import { GrAttachment } from "react-icons/gr";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { BsPeople } from "react-icons/bs";
import { FiPhone } from "react-icons/fi";
import { TbMessageReport } from "react-icons/tb";
import Popup from "reactjs-popup";
import { IoCameraOutline } from "react-icons/io5";
import { IoVideocamOutline } from "react-icons/io5";
import { LuFileDown } from "react-icons/lu";

export interface Message {
  id: string;
  message: string;
  sender: {
    image: string;
    self: boolean;
  };
  time: string;
}

interface Data {
  chats: Message[];
  from: string;
  to: string;
  name: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userMessage, setUserMessage] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const today = moment().format("DD MMM, YYYY");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [info, setInfo] = useState<Data>();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://qa.corider.in/assignment/chat?page=0"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setMessages(data.chats);
        setInfo(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleUserMessageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUserMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (userMessage.trim() !== "") {
      const newMessage = {
        id: Math.random().toString(36).substring(7),
        message: userMessage,
        sender: {
          image:
            "https://fastly.picsum.photos/id/1072/160/160.jpg?hmac=IDpbpA5neYzFjtkdFmBDKXwgr-907ewXLa9lLk9JuA8",
          self: true,
        },
        time: moment().format("YYYY-MM-DD HH:mm:ss"),
      };
      setMessages([...messages, newMessage]);
      setUserMessage("");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
      className="conta"
    >
      <div className="content-one">
        <div className="chat-header">
          <div className="chat-header-sec1">
            <IoMdArrowBack fontSize={24} />
            <div style={{ fontSize: "1.5rem", fontWeight: "500" }}>
              {info?.name}
            </div>
          </div>
          <FaRegEdit fontSize={24} />
        </div>
        <div className="chat-group">
          <div className="chat-group-sec1">
            <div className="circle-container">
              {Array.from(
                new Set(messages.map((message) => message.sender.image))
              )
                .slice(0, 4)
                .map((imageUrl, index) => (
                  <img key={index} src={imageUrl} alt={`Profile ${index}`} />
                ))}
            </div>

            <div className="chat-group-from">
              <div>
                From{" "}
                <span style={{ fontWeight: "600", fontSize: "1.05rem" }}>
                  {info?.from}
                </span>
              </div>
              <div>
                To{" "}
                <span style={{ fontWeight: "600", fontSize: "1.05rem" }}>
                  {info?.to}
                </span>
              </div>
            </div>
          </div>
          <IoMdMore onClick={handleClick} fontSize={30} />
          <Menu
            keepMounted
            anchorEl={anchorEl}
            onClose={handleClose}
            open={Boolean(anchorEl)}
          >
            <MenuItem onClick={handleClose}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <BsPeople fontSize={22} />
                <span>My Account</span>
              </div>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <FiPhone fontSize={22} />
                <span>Share Number</span>
              </div>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <TbMessageReport fontSize={22} />
                <span>Report</span>
              </div>
            </MenuItem>
          </Menu>
        </div>
      </div>

      <div className="chat" ref={chatRef}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1, height: "1px", backgroundColor: "#B7B7B7" }} />
          <div>
            <p style={{ width: "30vw", textAlign: "center", color: "#B7B7B7" }}>
              {today}
            </p>
          </div>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#B7B7B7" }} />
        </div>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: "flex",
              justifyContent: message.sender.self ? "flex-end" : "flex-start",
            }}
          >
            {!message.sender.self && (
              <img className="pfp" src={message.sender.image} alt="Profile" />
            )}
            <div
              className={`message ${
                message.sender.self ? "user-message" : "other-message"
              }`}
            >
              <div className="message-bubble">{message.message}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="input-bar">
        <input
          type="text"
          value={userMessage}
          onChange={handleUserMessageChange}
          placeholder="Reply to @Rohit Yadav"
        />
        <Popup
          trigger={(open) => (
            <button style={{ border: "none", backgroundColor: "transparent" }}>
              <GrAttachment fontSize={20} />
            </button>
          )}
          position="top center"
          closeOnDocumentClick
        >
          <div className="tooltip">
            <IoCameraOutline fontSize={24} />
            <IoVideocamOutline fontSize={24} />
            <LuFileDown fontSize={24} />
          </div>
        </Popup>
        <VscSend onClick={handleSendMessage} fontSize={24} />
      </div>
    </div>
  );
};

export default Chat;
