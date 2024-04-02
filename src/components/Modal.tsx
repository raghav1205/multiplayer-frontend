import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const Modal = ({modalOpen, close, open, onClose, children, color ='bg-[#000000e1]'}:
{
    modalOpen: boolean,
    close: () => void,
    open: () => void,
    onClose: () => void,
    children: React.ReactNode,
    color: string

}) => {
  return (
    <AnimatePresence>
    {modalOpen && (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center'
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`absolute top-0 left-0 w-full h-full ${color}`}
                onClick={() => {close(), onClose()}}
            ></motion.div>
            <motion.div
                initial={{ y: '-100vh' }}
                animate={{ y: 0 }}
                exit={{ y: '100vh' }}
                className='bg-white  rounded-lg shadow-lg z-50'
            >
               {children}
            </motion.div>
        </motion.div>
    )}
</AnimatePresence>

  )
}

export default Modal