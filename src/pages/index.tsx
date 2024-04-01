import { Inter } from "next/font/google";
import Router from "next/router";
import { use, useEffect, useState } from "react";
import { io } from "socket.io-client";
import {useGenerateUserDetails} from "../hooks/useGenerateUserId";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  const [socket, setSocket] = useState<any>(null);
  
  const {username, userId} = useGenerateUserDetails();

  useEffect(() => {
    const socketIo = io(`${process.env.NEXT_PUBLIC_API_URL}`);
    
    // console.log('Connected to server');
    socketIo.on('connect', () => {
    });
    
    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  const createRoom = () => {
    if (socket) {
      const room = Math.random().toString(36).substring(7);
      socket.emit('createRoom', {room, userId});
      Router.push(`/room/${room}`);
      
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/room/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          roomId: room,
          userId
        })
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
        })
        .catch(err => {
          console.log(err);
        });

    }
  };






  return (
    <main>
      <h1>Welcome to the chat!</h1>
       <h2>Hello, {username !== ""? username : "loading..."}</h2> 
      <button onClick={createRoom}>Create Room</button>
    </main>
  );
}
