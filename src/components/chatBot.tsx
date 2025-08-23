import Message from "./message";

export interface chatBotProp {
    sender: "ai" | "user";
    aiMessage: string;
    userMessage: string;
    loading: boolean;
}


const ChatBot: React.FC<chatBotProp> = ({ sender="user", aiMessage, userMessage, loading }) => {

    return (
        <div>
            <Message sender={sender} loading={loading}>
                {sender === "ai" ? aiMessage : userMessage}
            </Message>
        </div>  
    )
}

export default ChatBot;