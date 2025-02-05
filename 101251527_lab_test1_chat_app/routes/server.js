io.on("connection", (socket) => {
    console.log("New user connected");
  
    socket.on("joinRoom", (room) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);
    });
  
    socket.on("sendMessage", async ({ from_user, room, message }) => {
      const msg = new Message({ from_user, room, message });
      await msg.save();
  
      io.to(room).emit("receiveMessage", msg);
    });
  
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
  