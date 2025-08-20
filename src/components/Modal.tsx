import React, { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";



export interface modalPropsType {
    onOpen: boolean;
    children: ReactNode;
    onClose: () => void;
}

const Modal: React.FC<modalPropsType> = ({ children, onClose, onOpen}) => {

    return (
        <AnimatePresence>
            {onOpen && (
        <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-xl bg-opacity-50 flex items-center justify-center p-4 z-10000" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
        >
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}   

export default Modal;