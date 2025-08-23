import Message from "./message";

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
            {isOpen &&
                <div
                    className="min-h-[60vh] max-md:min-h-[90vh] min-w-[40vw]  bg-[var(--bg-color)] fixed right-[4vw] bottom-[4vh] z-1000000"
                >
                    <Message sender={sender} loading={loading}>
                        {sender === "ai" ? aiMessage : userMessage}
                    </Message>
                </div>  
            }
        </>
    )
}

export default ChatBot;