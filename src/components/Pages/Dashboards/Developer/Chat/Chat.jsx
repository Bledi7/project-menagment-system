import { useState } from "react";
import "./chat.css";
import Message from "./Message";
import { useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function Chat({ currentChat, setCurrentChat }) {
  const user = useSelector((state) => state.user.userState);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [messengerData, setMessengerData] = useState(null);
  const socket = useRef(io("ws://127.0.0.1:5000"));
  const api = `http://127.0.0.1:4000/api/messages/${currentChat.id}`;
  const api2 = `http://127.0.0.1:4000/api/message`;
  const api3 = `http://127.0.0.1:4000/api/userById`;

  const scrollRef = useRef();

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(api);
        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, [currentChat]);

  useEffect(() => {
    const getMessenger = async () => {
      const messengerId = await currentChat.members.find(
        (item) => item !== user.id
      );
      try {
        const res = await axios.get(api3, {
          params: {
            id: messengerId,
          },
        });
        setMessengerData(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    getMessenger();
  }, [currentChat]);

  useEffect(() => {
    socket.current = io("ws://127.0.0.1:5000");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    socket.current.on("getUsers", (users) => {
      console.log(users);
    });
  }, [user]);

  //conf
  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") {
      return;
    } else {
      const message = {
        sender: user.id,
        text: newMessage,
        conversationId: currentChat.id,
      };

      const receiverId = await currentChat.members.find(
        (member) => member !== user.id
      );
      socket.current.emit("sendMessage", {
        senderId: user.id,
        receiverId: receiverId,
        text: newMessage,
      });

      try {
        const res = await axios.post(api2, message);
        setMessages([...messages, res.data]);
        setNewMessage("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendGroupMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") {
      return;
    }

    socket.current.emit("sendMessage", {
      senderId: user.id,
      groupId: currentChat.id,
      text: newMessage,
    });

    const message = {
      sender: user.id,
      text: newMessage,
      groupId: currentChat.id,
    };

    try {
      const res = await axios.post(api2, message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  const joinGroup = (groupId) => {
    socket.current.emit("joinGroup", { userId: user.id, groupId });
  };

  return (
    <div className="chatBox">
      <div className="chatBoxHeader">
        <img
          className="messageImg"
          src="https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
          alt=""
        />
        <span>{messengerData?.firstName}</span>{" "}
        <CloseRoundedIcon
          style={{ cursor: "pointer" }}
          onClick={() => {
            setCurrentChat(null);
          }}
        />
      </div>
      <div className="chatBoxTop">
        {messages.map((message) => (
          <div ref={scrollRef}>
            <Message message={message} own={message.sender === user.id} />
          </div>
        ))}
      </div>
      <div className="chatBoxBottom">
        {/* <EmptyTextarea></EmptyTextarea> */}
        <textarea
          className="chatMessageInput"
          placeholder="write something..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        ></textarea>

        <button
          className="chatSubmitButton"
          onClick={
            currentChat.members.length < 2 ? handleSubmit : sendGroupMessage
          }
        >
          Send
        </button>
      </div>
    </div>
  );
}
