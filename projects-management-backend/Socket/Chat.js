const Conversation = require("../Models/Conversation");
let users = [];
console.log(users);
const addUser = (userId, socketId, groupIds = []) => {
  const userIndex = users.findIndex((user) => user.userId === userId);

  if (userIndex === -1) {
    users.push({ userId, socketId, groupIds });
  } else {
    users[userIndex].socketId = socketId;
    users[userIndex].groupIds = groupIds;
  }
};
const removeUser = (socketId) => {
  const index = users.findIndex((user) => user.socketId === socketId);
  if (index !== -1) {
    const removedUser = users.splice(index, 1)[0];
    return removedUser;
  }
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

module.exports = (io) => {
  io.on("connection", (socket) => {
    // when connect
    
    socket.on("addUser", ({ userId, groupId }) => {
      const user = getUser(userId);

      if (!user) {
        console.log(socket.id);
        addUser(userId, socket.id, [groupId]);
        io.emit("getUsers", users);
      }
    });

    socket.on("joinGroup", ({ userId, groupId }) => {
      socket.join(groupId);
      const user = getUser(userId);
      if (user) {
        if (!user.groupIds.includes(groupId)) {
          user.groupIds.push(groupId);
        }
        io.to(groupId).emit("userJoined", { userId, groupId });
      }
    });

    // send and get message
    socket.on("sendMessage", ({ senderId, receiverId, groupId, text }) => {
      console.log(users);
      if (groupId) {
        // Group message
        const groupUsers = users.filter((user) =>
          user.groupIds.includes(groupId)
        );
        if (groupUsers.length > 0) {
          groupUsers.forEach((groupUser) => {
            io.to(groupUser.socketId).emit("getMessage", {
              senderId,
              text,
              groupId,
            });
          });
        } else {
          console.log(`No users found in group with ID: ${groupId}`);
        }
      } else {
        // Private message
        const user = getUser(receiverId);
        if (user) {
          io.to(user.socketId).emit("getMessage", {
            senderId,
            text,
            groupId: null, // Private messages don't have a groupId
          });
        } else {
          console.log(`User with userId ${receiverId} not found.`);
        }
      }
    });

    socket.on("leaveGroup", ({ userId, groupId }) => {
      socket.leave(groupId);
      const user = getUser(userId);
      if (user) {
        const groupIndex = user.groupIds.indexOf(groupId);
        if (groupIndex !== -1) {
          user.groupIds.splice(groupIndex, 1);
        }
        io.to(groupId).emit("userLeft", { userId, groupId });
      }
    });

    // when disconnect
    socket.on("disconnect", () => {
      console.log("a user disconnected!");
      const removedUser = removeUser(socket.id);
      if (removedUser) {
        removedUser.groupIds.forEach((groupId) => {
          io.to(groupId).emit("userLeft", {
            userId: removedUser.userId,
            groupId,
          });
        });
      }
      io.emit("getUsers", users);
    });
  });
};
