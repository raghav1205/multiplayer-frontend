import React, { useEffect, useState, useRef } from 'react';
import Messenger from '@/components/Messenger';
import { MdOutlineMessage } from "react-icons/md";
import TicTacToe from '@/components/TicTacToe';


const MessengerPage: React.FC = () => {
    const [showMessenger, setShowMessenger] = useState<boolean>(false);
    return (
        <div className='h-screen'>
            <TicTacToe />
            {/* <div className='flex justify-center items-center h-full'>
                <MdOutlineMessage className='text-5xl' onClick={
                    () => setShowMessenger(!showMessenger)
                } />
            </div>
            {showMessenger && <Messenger />} */}
        </div>

    )
};

export default MessengerPage;