import React, { useState, useEffect, use } from 'react';
import { io } from 'socket.io-client';
import { useRouter } from 'next/router';
import { useGenerateUserDetails } from '@/hooks/useGenerateUserId';

const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`);

const TicTacToe: React.FC = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState('');
    const [player, setPlayer] = useState<string>('');
    const [id, setId] = useState<string>('');
    const { username, userId } = useGenerateUserDetails();

    const handleClick = (index: number) => {
        if (!board[index]) {
            if (player !== currentPlayer) {
                return;
            }
            const newBoard = [...board];
            newBoard[index] = currentPlayer;
            setBoard(newBoard);
            setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
            const move = socket.emit('move', { room: id, board: newBoard, player: currentPlayer === 'X' ? 'O' : 'X' });
            console.log('Move made', move);
        }
    };

    const router = useRouter();

    const room = router.query;
    useEffect(() => {
        const roomId = router.query['room.id'];
        if (roomId && socket) {
            setId(roomId as string);
            // console.log(`Attempting to join room: ${roomId}`);
            socket.emit('joinRoom', { room: roomId, userId });

            socket.on('connect', () => {
                // console.log('Connected to server');
            });

            socket.on('disconnect', () => {
                // console.log('Disconnected from server');
            });
            socket.emit('move', { roomId, board, player: currentPlayer });
            socket.on('move', (data: { roomId: string, board: string[], player: string }) => {
                // console.log('Move event received', data);
                setBoard(data.board);
                setCurrentPlayer(data.player);
            });

            // socket.emit('player', roomId);
            // socket.on('player', (player: string) => {
            //     console.log('Player event received', player);
            //     setCurrentPlayer(player);
            //     setPlayer(player);
            // });
            socket.on('roleAssigned', ({ role, userId: currentRoleId }) => {
                console.log(`You are Player ${role + ' ' + currentRoleId}`);
                if (currentRoleId === userId) {
                    setPlayer(role);
                    setCurrentPlayer(role === 1 ? 'X' : 'O');
                }
            });

            return () => {
                socket.off('connect');
                socket.off('disconnect');
                socket.off('move');
                socket.off('player');
            };
        }
    }, [router, socket]);


    useEffect(() => {
        if (board[0] && board[0] === board[1] && board[1] === board[2]) {
            alert(`${board[0]} wins`);
        }
        if (board[3] && board[3] === board[4] && board[4] === board[5]) {
            alert(`${board[3]} wins`);
        }
        if (board[6] && board[6] === board[7] && board[7] === board[8]) {
            alert(`${board[6]} wins`);
        }
        if (board[0] && board[0] === board[3] && board[3] === board[6]) {
            alert(`${board[0]} wins`);
        }
        if (board[1] && board[1] === board[4] && board[4] === board[7]) {
            alert(`${board[1]} wins`);
        }
        if (board[2] && board[2] === board[5] && board[5] === board[8]) {
            alert(`${board[2]} wins`);
        }
        if (board[0] && board[0] === board[4] && board[4] === board[8]) {
            alert(`${board[0]} wins`);
        }
        if (board[2] && board[2] === board[4] && board[4] === board[6]) {
            alert(`${board[2]} wins`);
        }


    }, [board]);


    return (
        <div className='flex flex-col h-full justify-center items-center'>
            <div className='mb-6 text-center '>
                <p className='text-lg'>Current Move : {currentPlayer}</p>
                <p>You are: {player}</p>
            </div>
            <div className='w-[500px] mx-auto  grid grid-cols-3 '>
                {board.map((cell, index) => (
                    <button
                        key={index}
                        onClick={() => handleClick(index)}
                        className={`
                        ${index < 2 ? 'border-b-1 border-r-2' : ''} 
                        ${index === 2 ? 'border-b-1' : ''} 
                        ${[3, 4].includes(index) ? 'border-b-2 border-r-2 border-t-2' : ''} 
                        ${index === 5 ? 'border-b-2 border-t-2' : ''} 
                        ${[6, 7].includes(index) ? 'border-r-2 border-t-1' : ''} 
                        ${index === 8 ? 'border-t-1' : ''} 
                        border-slate-600 h-[100px]
                    `}
                    >                        <span className={`${cell === 'X' ? 'text-red-500' : 'text-blue-500'} text-5xl`}>
                            {cell}
                        </span>
                    </button>
                ))}
            </div>
        </div>

    );
};

export default TicTacToe;