"use client"
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";


interface ChallengPopUpProp {
    text?: string;
    question?: string;
    type?: "text" | "form";
    onSubmit?: () => void;
    onAccept?: () => void;
    onClose?: () => void;
    openPopUp?: boolean; 
}

const ChallengPopUp: React.FC<ChallengPopUpProp> = ({ text, onSubmit, type, question, onAccept, openPopUp, onClose }) => {
    type answer = {
        answer: string;
    }

    const [formData, setFormData] = useState<answer>({
        answer: ""
    })
    


    return (
        <AnimatePresence>
            {openPopUp &&
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    dir="rtl"
                    className="z-100000 fixed bottom-0 w-full bg-[var(--primary-color1)]/30 backdrop-blur-xl border-t-[3px] border-[var(--primary-color1)] py-[7vh] max-md:py-[5vh]"
                >
                    {type === "text" ? (
                        <div
                            className="w-[80%] max-md:w-[90%] mx-auto flex items-center justify-between"
                        >
                            <div
                                className="text-[1.2rem] font-bold text-[white]/80"
                            >
                                {text}
                            </div>
                            <div
                                className="flex gap-[3.4rem] max-md:flex-col max-md:gap-[0.6rem]"
                            >
                                <button
                                    onClick={onAccept}
                                    className="button-primary md:scale-[1.3] scale-[1.1] rounded-xl shadow-xl"
                                >
                                    اره انجامش دادم
                                </button>
                                <button
                                    onClick={onClose}
                                    className="button-secondary md:scale-[1.3] scale-[1.1] rounded-xl shadow-xl text-[white]"
                                >
                                    نه حوصلشو نداشتم
                                </button>
                            </div>
                        </div>
                    ) : type === "form" ? (
                        <div
                            className="w-[80%] max-md:w-[95%] mx-auto"
                        >
                            <form
                                className="w-full flex justify-between items-center mx-auto"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    onSubmit?.();
                                }}
                            >
                                <div
                                    className="flex flex-col gap-[0.6rem]"
                                >
                                    <label
                                        className="text-[1.4rem] font-extrabold text-[white]/80"
                                    >
                                        {question}
                                    </label>
                                    <input 
                                        type="text" 
                                        value={formData.answer}
                                        name="answer"
                                        onChange={(e) => setFormData({...formData, answer: e.target.value})}
                                        placeholder="جواب"
                                        className="bg-white/20 w-[35vw] max-md:w-[50vw] backdrop-blur-sm border-2 border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:border-white/50 focus:bg-white/30 transition-all duration-200"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="button-primary md:scale-[1.3] scale-[1.1] rounded-xl shadow-xl fixed bottom-[7.3vh] max-md:bottom-[5.2vh] left-[10vw] max-md:left-4"
                                >
                                    انجام چالش
                                </button>
                            </form>
                        </div>
                    ) : null}
                </motion.div>
            }
        </AnimatePresence>
    )
}

export  default ChallengPopUp;