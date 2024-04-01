import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useRouter } from 'next/router';
import { useGenerateUserDetails } from '../hooks/useGenerateUserId';
interface Message {
    userId: string;
    message: string;
}

const Messenger = () => {
    const [socket, setSocket] = useState<any>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<string>('');
    const [id, setId] = useState<string>('');
    const { username, userId } = useGenerateUserDetails();
    const router = useRouter();
    const room = router.query;
    // console.log(router.query);   
    useEffect(() => {
        if (room && room['room.id']) {
            const roomId = room['room.id'] as string;
            setId(room['room.id'] as string);
            const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`);
            socket.emit('joinRoom', room['room.id']);
            socket.on('message', (message: { text: string, userId: string }) => {
                console.log(message);

                setMessages((messages) => [...messages, { message: message.text, userId: message.userId }]);
            });
            setSocket(socket);

            addUserToRoom(roomId)
            getPreviousMessages(roomId);

            return () => {
                socket.off('message');
                socket.disconnect();
            }
        }
    }, [room]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);


    const getPreviousMessages = (roomId: string) => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/room/messages?roomId=${roomId}`)
            .then(res => res.json())
            .then(data => {
                // console.log(data);

                setMessages(data.messages);
            })
            .catch(err => {
                console.log(err);
            });
    }

    const addUserToRoom = (roomId: string) => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/room/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                roomId,
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

    const sendMessage = () => {
        if (socket) {
            console.log('Message sent');
            socket.emit('message', { room: id, text: message, userId });
            setMessage('');

        }
    };


    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (message.trim() !== '') {
                sendMessage();
            }
        }
    };

    return (
        <div className="flex flex-col max-h-screen h-full ">
            <header className="bg-gray-800 py-4">
                <h1 className="text-white text-center text-2xl font-bold">Messenger</h1>
            </header>
            <main className="flex-grow   bg-gray-100 ">
                <div className="flex flex-col justify-end  h-full max-h-screen">

                    <div className='flex-grow overflow-auto   scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300'>
                        {messages.map((message, index) => (
                            <div key={index} className={`${message.userId === userId ? 'flex justify-start' : 'flex justify-end'} `}>
                                <div className={`${message.userId === userId ? 'bg-blue-500 text-white p-4 m-4 rounded-lg' :
                                    'bg-gray-300 p-4 m-4 rounded-lg text-black'}
                        `}>{message.message}</div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="flex justify-center items-center sticky bottom-0 z-100  border-2 border-gray-300   focus:ring-blue-500 focus:border-transparent  ">
                        <input
                            type="text"
                            className="w-full p-4 focus:outline-none focus:ring-2"
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button className="bg-blue-500 text-white p-4 rounded-md" onClick={sendMessage}>Send</button>
                    </div>
                </div>
            </main>

        </div>
    )
}

export default Messenger
