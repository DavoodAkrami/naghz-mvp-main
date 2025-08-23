import Message from "./message";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";



export interface chatBotProp {
    sender?: "ai" | "user";
    isOpen: boolean;
    aiMessage?: string;
    loading?: boolean;
}


const ChatBot: React.FC<chatBotProp> = ({ sender="user", aiMessage, loading, isOpen }) => {
    const [userMessage, setUserMessage] = useState<string>("");

    return (
        <>
        <AnimatePresence>
            {isOpen &&
                    <motion.div
                        initial={{ opacity: 0, scale: 0.2, y: 150, x: 150 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 150, x: 150 }}
                        transition={{ duration: 0.5 }}
                        className="min-h-[70vh] py-4 text-center text-[2rem] font-bold max-md:min-h-[75vh] min-w-[35vw] max-md:min-w-[90vw] auto bg-[var(--primary-color1)]/50 backdrop-blur-2xl fixed right-[2vw] bottom-[12vh] max-md:right-[50%] max-md:left-[50%] max-md:transform max-md:-translate-x-1/2 z-1000000 rounded-3xl"
                    >
                        <header
                            className="flex justify-center items-center text-[white]"
                        >
                            <h2>هوش مصنوعی نغز</h2>
                        </header>
                        <hr 
                                className="border-none h-[0.5px] bg-[white] opacity-60 my-4"
                        />
                        <div
                            className="min-h-[50vh] w-[97%] overflow-auto max-md:min-h-[54vh]"
                        >
                            <Message sender={sender} loading={loading}>
                                {sender === "ai" ? aiMessage : userMessage}
                            </Message>
                        </div>  
                        <hr 
                                className="border-none h-[0.5px] bg-[white] opacity-60 my-4"
                        />
                        <div
                            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-[0.8rem] w-[85%]"
                        >
                            <button
                                className="rounded-full p-2 bg-[var(--primary-color1)]/70 backdrop-blur-2xl disabled:opacity-[0.6] hover:bg-[var(--primary-color1)]/40 cursor-pointer"  
                                disabled={loading || userMessage === ""}
                            >
                                <MdKeyboardArrowRight 
                                    className="text-[2.2rem] text-[white]"
                                />
                            </button>
                            <input 
                                type="text"
                                className="rounded-full py-2 px-4 text-[1.4rem] font-normal bg-[var(--primary-color1)]/70 backdrop-blur-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color2)] flex-1 flex items-center w-[90%]"
                                placeholder="پیام خود را بنویسید..."
                                value={userMessage}
                                onChange={(e) => setUserMessage(e.target.value)}
                            />    
                        </div>                
                    </motion.div>  
            }
            </AnimatePresence>
        </>
    )
}

export default ChatBot;