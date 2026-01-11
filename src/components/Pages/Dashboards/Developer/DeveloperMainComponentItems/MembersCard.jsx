import { AvatarStyled } from "../DeveloperMainComponentItems/AvatarStyled";
import "./membersCard.css";
import axios from "axios";
import ChatIcon from "@mui/icons-material/Chat";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export function MembersCard({ currentChat, setCurrentChat, employees }) {
  const [randomUsers, setRandomUsers] = useState({});
  const user = useSelector((state) => state.user.userState);
  const socket = useRef(io("ws://127.0.0.1:5000"));

  console.log(employees);
  // const getRandomUsers = async () => {
  //   try {
  //     const res = await axios.get(`http://127.0.0.1:4000/api/randomUsers`, {
  //       id: user.id,
  //     });
  //     setRandomUsers(res.data.users);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const createGroupChat = async () => {
    try {
      const userIds = randomUsers.map((user) => user.id);
      setCurrentChat(null);

      // Create the group chat on the backend
      const response = await axios.post("http://127.0.0.1:4000/api/groupChat", {
        members: userIds,
      });

      // Set the current chat based on the response from the backend
      setCurrentChat(response.data);

      const groupId = response.data.id;

      userIds.map((userId) => {
        socket.current.emit("addUser", { userId, groupId });
      });

      userIds.map((userId) => {
        socket.current.emit("joinGroup", { userId, groupId });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const addUserToGroupConversation = async (userId) => {
    const conversationId = currentChat.id;
    try {
      // Add the user to the conversation on the backend
      const response = await axios.post(
        "http://127.0.0.1:4000/api/groupChat/addUser",
        {
          conversationId,
          userId,
        }
      );
      console.log("User added to group conversation:", response.data);
      setCurrentChat(response.data);

      socket.current.emit("addUser", { userId, groupId: conversationId });
      socket.current.emit("joinGroup", { userId, groupId: conversationId });
    } catch (error) {
      console.error("Error adding user to group conversation:", error);
    }
  };

  const createConversation = async (receiverId) => {
    try {
      // Check if currentChat is not empty

      setCurrentChat(null); // Clear the current chat

      const response = await axios.post(
        "http://127.0.0.1:4000/api/conversation",
        {
          senderId: user.id,
          receiverId: receiverId,
        }
      );
      setCurrentChat(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="wrapper">
      <div>
        <span style={{ padding: "0px 10px" }}>Members</span>{" "}
        <div className="user-info-header">
          {" "}
          <span>Member Info</span> <span>Chat</span> 
        </div>
        <div className="user-info-section">
          <div className="user-info-item">
            <AvatarStyled
              img={
                "https://images.pexels.com/photos/33537/cat-animal-cat-portrait-mackerel.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              }
            />
            <div className="user-info-text">
              <h5></h5>
              <h6></h6>
              <h6 style={{ fontWeight: "200" }}>GroupChat</h6>
            </div>
            <div className="small-icon-container" style={{ cursor: "pointer" }}>
              <ChatIcon onClick={createGroupChat} />
            </div>
          </div>
          {/* {employees.map((rUser, key) => (
            <div className="user-info-item" key={key}>
              <AvatarStyled
                img={
                  "https://images.pexels.com/photos/33537/cat-animal-cat-portrait-mackerel.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                }
              />
              <div className="user-info-text">
                <h5>{rUser.firstName}</h5>
                <h6>{rUser.role}</h6>
                <h6 style={{ fontWeight: "200" }}>Creating links</h6>
              </div>
              <div
                className="small-icon-container"
                style={{ cursor: "pointer" }}
              >
                <ChatIcon onClick={() => createConversation(rUser.id)} />
              </div>
            </div>
          ))} */}
          {employees && employees.length > 0 ? (
            employees.map((rUser, key) => (
              <div className="user-info-item" key={key}>
                <AvatarStyled
                  img={
                    "https://images.pexels.com/photos/33537/cat-animal-cat-portrait-mackerel.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  }
                />
                <div className="user-info-text">
                  <h5>{rUser.firstName}</h5>
                  <h6>{rUser.role}</h6>
                  <h6 style={{ fontWeight: "200" }}>Creating links</h6>
                </div>
                <div
                  className="small-icon-container"
                  style={{ cursor: "pointer" }}
                >
                  <ChatIcon onClick={() => createConversation(rUser.id)} />
                </div>
              </div>
            ))
          ) : (
            <p>No employees available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
