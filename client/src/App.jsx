import React, {useEffect, useState, useMemo} from 'react';
import { io } from 'socket.io-client';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';



function App () {
  const socket  = useMemo(() => io('http://localhost:3000'), []);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected to server,', socket.id)
    })

    socket.on('welcome', (msg) => {
      console.log(msg, " - ", socket.id);
    });

    socket.on('message', (data) => {
      console.log(data);
    });

    return () => {
      console.log('disconnecting user : ', socket.id)
      socket.disconnect();
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit('message', message);
    setMessage('');
  }

  return (
    <Container>
      <Typography variant='h1' component='div' gutterBottom>
        Welcome to the Chat App built by Bharat
      </Typography>

      <form onSubmit={(e) => handleSubmit(e)}>
        <Input type="text" value={message} onChange ={(e) => setMessage(e.target.value)}/>
        <Button type="submit">Send</Button>
      </form>
    </Container>
  )
}

export default App;