import React, { useEffect, useState, useMemo } from "react";
import { io } from "socket.io-client";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

function App() {
  const socket = useMemo(() => io("http://localhost:3000"), []);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketID] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      setSocketID(socket.id);
      console.log("connected to server,", socket.id);
    });

    socket.on("recieve-message", (msg) => {
      console.log(msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
    // console.log(room, message, socketID);
  };

  const joinRoomName = (e) => {
    e.preventDefault()
    socket.emit('join-room', roomName)
    setRoomName("")
  }

  return (
    <Container>
      <Typography variant="p" component="div" gutterBottom>
        Welcome to the Chat App - {socketID}
      </Typography>
      
      <form onSubmit={joinRoomName}>
        <TextField
          type="text"
          onChange={(e) => setRoomName(e.target.value)}
          value={roomName}
          label="Room Name"
          variant="outlined"
        ></TextField>
      <Button type="submit">Join Room</Button>
      </form>

      <form onSubmit={(e) => handleSubmit(e)}>
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <br />
        <Input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />

        <Button type="submit">Send</Button>
      </form>


      <Stack>
        {messages.map((message, index) => (
          <Typography key={index} variant="p" component="div" gutterBottom>
            {message}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
}

export default App;
