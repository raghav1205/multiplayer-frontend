import React, { useState, useEffect, use } from 'react';
import { io } from 'socket.io-client';
import { useRouter } from 'next/router';
import { useGenerateUserDetails } from '@/hooks/useGenerateUserId';
import Modal from './Modal';
import useModal from '@/hooks/useModal';

const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`);

const TicTacToe: React.FC = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState('');
    const [winner, setWinner] = useState<string>('');
    const [player, setPlayer] = useState<string>('');
    const [id, setId] = useState<string>('');
    const { username, userId } = useGenerateUserDetails();
    const { modalOpen, close, open } = useModal();

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
                console.log('Move event received', data);
                
                // if(modalOpen){
                    console.log('Other player wants to play again')
                    setWinner('');
                    close();
                // }
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
            setWinner(board[0])
            open();
        }
        if (board[3] && board[3] === board[4] && board[4] === board[5]) {
            setWinner(board[3])
            open();
        }
        if (board[6] && board[6] === board[7] && board[7] === board[8]) {
            setWinner(board[6])
            open();
        }
        if (board[0] && board[0] === board[3] && board[3] === board[6]) {
            setWinner(board[0])
            open();
        }
        if (board[1] && board[1] === board[4] && board[4] === board[7]) {
            setWinner(board[1])
            open();
        }
        if (board[2] && board[2] === board[5] && board[5] === board[8]) {
            setWinner(board[2])
            open();
        }
        if (board[0] && board[0] === board[4] && board[4] === board[8]) {
            setWinner(board[0])
            open();
        }
        if (board[2] && board[2] === board[4] && board[4] === board[6]) {
            setWinner(board[2])
            open();
        }

    }, [board]);

    const handlePlayAgain = () => {

        setWinner('');
        socket.emit('move', { room: id, board: Array(9).fill(null), player: currentPlayer });

    }


    return (
        <div className='flex flex-col h-full justify-center items-center'>
            <div className='mb-6 text-center '>
                <p className='text-md sm:text-lg'>Current Move : {currentPlayer}</p>
                <p>You are: {player}</p>
            </div>
            <div className='w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl m-4 grid grid-cols-3 '>
                {board.map((cell, index) => (
                    <button
                        key={index}
                        onClick={() => handleClick(index)}
                        className={`
                        ${index < 2 ? 'border-b border-r-2' : ''} 
                        ${index === 2 ? 'border-b' : ''} 
                        ${[3, 4].includes(index) ? 'border-b-2 border-r-2 border-t-2' : ''} 
                        ${index === 5 ? 'border-b-2 border-t-2' : ''} 
                        ${[6, 7].includes(index) ? 'border-r-2 border-t' : ''} 
                        ${index === 8 ? 'border-t' : ''} 
                        border-slate-600 h-24 sm:h-32 md:h-36 lg:h-44
                    `}
                    >
                        <span className={`${cell === 'X' ? 'text-red-500' : 'text-blue-500'} text-2xl sm:text-4xl md:text-5xl`}>
                            {cell}
                        </span>
                    </button>
                ))}
            </div>
            <Modal
                modalOpen={modalOpen}
                close={close}
                open={open}
                onClose={close}
                color='bg-[#000000e1]'
            >
                <div className='p-[1rem] h-[15rem] flex flex-col justify-around items-center gap-[0.9rem]  '>
                    <h1 className='text-2xl '>Game Over</h1>
                    <p className='text-3xl my-[0.5rem]'>Player {currentPlayer} wins</p>
                    <div className='flex gap-3'>
                        <button onClick={close} className='bg-blue-500 text-white p-2 rounded-md'>Close</button>
                        <button onClick={handlePlayAgain} className='bg-red-500 text-white p-2 rounded-md'>Play Again</button>
                    </div>
                </div>
            </Modal>
            {
                winner !== '' && !modalOpen && (
                    <div
                        className='mt-6 flex gap-3'
                    >
                        <button onClick={() => {
                            router.push('/');
                        }} className='bg-blue-500 text-white p-2 rounded-md'>Leave</button>
                        <button onClick={handlePlayAgain} className='bg-red-500 text-white p-2 rounded-md'>Play Again</button>
                    </div>
                )
            }
        </div>

    );
};

export default TicTacToe;