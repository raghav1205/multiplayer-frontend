import React, { useEffect, useState, useRef } from 'react';
import Messenger from '@/components/Messenger';
import { MdOutlineMessage } from "react-icons/md";
import TicTacToe from '@/components/TicTacToe';
import { FaMessage } from 'react-icons/fa6';
import useModal from '@/hooks/useModal';
import Modal from '@/components/Modal';

const MessengerPage: React.FC = () => {
    const [showMessenger, setShowMessenger] = useState<boolean>(false);
    const { modalOpen, close, open } = useModal();
    return (
        <div className='h-screen'>
            <TicTacToe />
            {/* <div className='flex justify-center items-center h-full'>
                <MdOutlineMessage className='text-5xl' onClick={
                    () => setShowMessenger(!showMessenger)
                } />
            </div> */}
            <Modal
                modalOpen={modalOpen}
                close={close}
                open={open}
                onClose={close}
                color='bg-[#000000e1]'
            >
                <div className='
        max-h-[90vh] min-h-[40vh] h-auto 
        max-w-[95vw] md:max-w-[70vw] lg:max-w-[50vw] xl:max-w-[40vw] 
        bg-white rounded-lg shadow-lg z-50 
        overflow-hidden overflow-y-auto
    '>
                    <Messenger />
                </div>
            </Modal>
            <button className='fixed bottom-0 right-0 m-4 cursor-pointer' onClick={open} >
                <FaMessage className='text-5xl ' />
                {/* <div className='absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex justify-center items-center'>3</div>
                <div className='absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex justify-center items-center'>3</div>
                <div className='absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex justify-center items-center'>3</div> */}
            </button>
        </div>

    )
};

export default MessengerPage;