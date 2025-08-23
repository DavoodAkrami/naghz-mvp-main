import Message from "./message";
import { AnimatePresence, motion } from "framer-motion";


export interface chatBotProp {
    sender?: "ai" | "user";
    isOpen: boolean;
    aiMessage?: string;
    userMessage?: string;
    loading?: boolean;
}


const ChatBot: React.FC<chatBotProp> = ({ sender="user", aiMessage, userMessage, loading, isOpen }) => {

    return (
        <>
        <AnimatePresence>
            {isOpen &&
                    <motion.div
                        initial={{ opacity: 0, scale: 0.2, y: 150, x: 150 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 150, x: 150 }}
                        transition={{ duration: 0.5 }}
                        className="min-h-[70vh] text-center text-[2rem] font-bold py-[2rem] px-4 max-md:min-h-[75vh] min-w-[35vw] max-md:min-w-[90vw] auto bg-[var(--primary-color1)]/50 backdrop-blur-2xl fixed right-[2vw] bottom-[12vh] max-md:right-[50%] max-md:left-[50%] max-md:transform max-md:-translate-x-1/2 z-1000000 rounded-3xl"
                    >
                        <Message sender={sender} loading={loading}>
                            {sender === "ai" ? aiMessage : userMessage}
                        </Message>
                        هوش مصنوعی نغز به زودی اضافه میشه... 
                    </motion.div>  
            }
            </AnimatePresence>
        </>
    )
}

export default ChatBot;