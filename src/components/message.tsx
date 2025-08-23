import clsx from "clsx";

interface MessageProps {
    sender: "ai" | "user";
    loading?: boolean;
    children: React.ReactNode;
}


const Message: React.FC<MessageProps> = ({ sender="user", loading=false, children }) => {

    return  (
        <div 
            className={clsx(
                "flex items-center justify-center w-[80%] mx-auto shadow-lg p-4 rounded-t-lg",
                sender === "ai" ? "rounded-br-lg" : "rounded-bl-lg",
                !children && "hidden"
            )}
        >
            {loading ? 
                (
                <div className="animate-pulse ">
                    Thinking...
                </div>
                ) : (
                    <div>
                        {children}
                    </div>
                )
            }
        </div>
    )
}

export default Message;