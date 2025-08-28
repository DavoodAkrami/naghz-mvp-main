import Modal from "./Modal";
import { MdOutlineQuestionMark } from "react-icons/md";



export interface tipModalProp {
    header?: string;
    tip?:string;
    handleTipModalOpen?: () => void;
    openTipModal?: boolean;
}


const TipModal: React.FC<tipModalProp> = ({ header, tip, handleTipModalOpen, openTipModal}) => {

    return (
        <div>
            <button
                onClick={handleTipModalOpen}
                className="rounded-full p-4 bg-[var(--primary-color1)]/50 backdrop-blur-xl border-[2px] border-[var(--primary-color1)] fixed bottom-[2rem] right-[2rem] hover:bg-[var(--primary-color1)]/30 hover:cursor-pointer"
            >
                <MdOutlineQuestionMark className="text-[white] text-[1.6rem] max-md:text-[1.4rem]" />
            </button>
            <Modal
                onClose={handleTipModalOpen}
                onOpen={openTipModal}
            >
                <h3 className="h3 text-center mb-[2rem]">
                    {header}
                </h3>
                <p className="text-justify px-[5%] text-[1.2rem]">
                    {tip} 
                </p>
            </Modal>
        </div>
    )   
}

export default TipModal;