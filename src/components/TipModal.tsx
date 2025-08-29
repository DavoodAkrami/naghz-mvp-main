import Modal from "./Modal";
import { MdOutlineQuestionMark } from "react-icons/md";



export interface tipModalProp {
    tip?:string;
    handleTipModalOpen?: () => void;
    openTipModal?: boolean;
    pulse?: boolean;
}


const TipModal: React.FC<tipModalProp> = ({ tip, handleTipModalOpen, openTipModal, pulse = false}) => {

    return (
        <div>
            <button
                onClick={handleTipModalOpen}
                className="rounded-full p-4 bg-[var(--primary-color1)]/30 backdrop-blur-xl border-[2px] border-[var(--primary-color1)] fixed bottom-[2rem] right-[2rem] hover:bg-[var(--primary-color1)]/15 hover:cursor-pointer"
            >
                {pulse && (
                    <span className="pointer-events-none absolute inset-0 rounded-full ring-4 ring-yellow-400/70 animate-ping" />
                )}
                <MdOutlineQuestionMark className="text-[white] text-[1.6rem] max-md:text-[1.4rem]" />
            </button>
            <Modal
                onClose={handleTipModalOpen}
                onOpen={openTipModal}
                classname="min-w-[90vw] md:min-w-[60vw] mx-auto"
            >
                
                <h3 className="h3 text-center mb-[2rem]">
                    نکته
                </h3>
                <p className="text-justify px-[5%] text-[1.2rem]">
                    {tip} 
                </p>
            </Modal>
        </div>
    )   
}

export default TipModal;