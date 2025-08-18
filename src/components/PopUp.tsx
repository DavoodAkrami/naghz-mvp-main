import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import clsx from "clsx";


export interface PopUpProps {
    isCorrect: boolean;
    onNext?: () => void;
    onRetry?: () => void;
    onWhy?: () => void;
    onCorrectAnswer?: () => void;
    isOpen: boolean;
}

const PopUp: React.FC<PopUpProps> = ({ isCorrect, onNext, onRetry, onWhy, onCorrectAnswer, isOpen }) => {

    return (
        <AnimatePresence    >
            {isOpen && (
                <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className={clsx(
                    "w-[100%] backdrop-blur-sm rounded-full py-8 px-12 flex items-center justify-between shadow-lg border-[4px] ",
                    !isOpen && "hidden",
                    !isCorrect && "bg-[var(--secondary-color2)]/80 border-[var(--secondary-color2)]",
                    isCorrect && "bg-[var(--secondary-color1)]/80 border-[var(--secondary-color1)]"
                )}
            >
                <div
                    className="flex items-center gap-[0.8rem]"
                >
                    <button
                        className="button-primary rounded-full"
                        onClick={isCorrect ? onNext : onWhy}
                    >   
                        {isCorrect ? "ادامه" : "؟جواب درست"}
                    </button>
                    <button 
                        className="button-primary rounded-full"
                        onClick={isCorrect ? onWhy : onRetry}
                    >
                        {isCorrect ? "چرا؟" : "دوباره امتحان کن"}
                    </button>
                </div>
                <div
                    className={clsx(
                        "text-[1.6rem] max-md:text-[1.4rem] font-bold",
                        isCorrect ? "text-[var(--primary-color4)]" : "text-[var(--primary-color3)]"
                    )}
                >
                    {isCorrect ? "آفرین" : "جوابت اشتباه بود"}
                </div>
            </motion.div>
            )}
        </AnimatePresence>
    )
}

export default PopUp;