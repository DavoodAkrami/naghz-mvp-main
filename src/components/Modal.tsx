import React, { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RxCross2 } from "react-icons/rx";



export interface modalPropsType {
    layoutId?: string;
    children: ReactNode;
    onClose: () => void;
}

const Modal: React.FC<modalPropsType> = ({ layoutId, children, onClose}) => {

    return (
        <AnimatePresence>
            <motion.div
                className="fixed z-1001 bg-white/30 backdrop-blur-xl w-[100vw] h-[100vh] flex justify-center items-center"
            >
                <motion.div
                    layoutId={layoutId}
                    className="reletive z-10000 flex items-center justify-center bg-[var(--bg-color-secondary)] md:w-[35vw] md:h-[40vh] rounded-lg w-[95vw] h-[50vh]"
                >
                    <div
                        className="absolute top-2 right-2 cursor-pointer"
                        onClick={onClose}
                    >
                        <RxCross2 
                            className="text-[2rem]"
                        />
                    </div>
                    {children}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}   

export default Modal;