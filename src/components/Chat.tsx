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
import Loader from "./Loaders"

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
  const [isLoading, setIsLoading] = useState(false);
const [currentPage, setCurrentPage] = useState(0);
  
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
        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
          console.log("initial scroll");
          
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   if (!isLoading && chatRef.current) {
  //     chatRef.current.scrollTop = chatRef.current.scrollHeight;
  //     console.log("is loading scroll");
      
  //   }
  // }, [messages]);

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
    if (chatRef.current) 
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
  };

const fetchMoreMessages = async () => {
  if (isLoading) return;
  setIsLoading(true);

  try {
    const response = await fetch(
      `https://qa.corider.in/assignment/chat?page=${currentPage + 1}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    const currentScrollHeight = chatRef.current?.scrollHeight;
    setTimeout(() => {
      setMessages([...data.chats, ...messages]);
      const newScrollHeight = chatRef.current?.scrollHeight || 0;

      if (chatRef.current && currentScrollHeight) {
        chatRef.current.scrollTop = chatRef.current.scrollTop + (newScrollHeight - currentScrollHeight);
        console.log("more data fetch scroll");
      }
      setCurrentPage(currentPage + 1);
      setIsLoading(false);
    }, 2000);
  } catch (error) {
    console.error("Error fetching more messages:", error);
    setIsLoading(false);
  }
};


const handleScroll = () => {
  if (chatRef.current?.scrollTop === 0) {
    fetchMoreMessages();
  }
};

useEffect(() => {
  if (chatRef.current) {
    chatRef.current.addEventListener("scroll", handleScroll);
    
  }

  return () => {
    if (chatRef.current) {
      chatRef.current.removeEventListener("scroll", handleScroll);
    }
  };
}, [messages]);

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
        <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
          {isLoading && <Loader />}
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
              <div className="message-bubble">{message.message.slice(0,140)}</div>
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
