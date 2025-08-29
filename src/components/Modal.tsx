import React, { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";



export interface modalPropsType {
    onOpen?: boolean;
    children: ReactNode;
    onClose?: () => void;
    classname?: string;
}

const Modal: React.FC<modalPropsType> = ({ children, onClose, onOpen, classname}) => {

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
            <div className={clsx(
                "bg-[var(--primary-color4)]/70 backdrop-blur-2xl rounded-lg p-6 max-w-md w-full" ,
                classname
            )}>
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}   

export default Modal;