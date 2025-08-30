"use client"
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";
import { useRouter } from "next/navigation";


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
    const router = useRouter();
    type answer = {
        answer: string;
    }

    const [formData, setFormData] = useState<answer>({
        answer: ""
    })

    const handleOpenChallenge = () => {
        router.push("/today_challenge")
    }
    


    return (
        <AnimatePresence>
            {openPopUp &&
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    dir="rtl"
                    className="z-100000 fixed bottom-[3vh] right-[2vw] w-[40vw] max-md:w-[97vw] rounded-2xl shadow-2xl bg-[var(--primary-color1)]/30 backdrop-blur-xl border-[2px] border-[var(--primary-color1)] py-6 max-md:py-8 max-md:right-[50%] max-md:transform max-md:translate-x-1/2 max-md:scale-[0.9]"
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
                                className="flex flex-col gap-[1rem] max-md:gap-[0.6rem]"
                            >
                                <Button
                                    buttonType="button-primary"
                                    classname="rounded-xl shadow-xl"
                                    onClick={onAccept}
                                >
                                    بزن بریم
                                </Button>
                                <Button
                                    buttonType="button-secondary"
                                    classname="rounded-xl shadow-xl text-[white]"
                                    onClick={onClose}
                                >
                                    نه حوصله ندارم
                                </Button>
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
                                <Button
                                    buttonType="button-primary"
                                    classname="md:scale-[1.3] scale-[1.1] rounded-xl shadow-xl fixed bottom-[7.3vh] max-md:bottom-[5.2vh] left-[10vw] max-md:left-4"
                                    type="submit"
                                >
                                    انجام چالش
                                </Button>
                            </form>
                        </div>
                    ) : null}
                </motion.div>
            }
        </AnimatePresence>
    )
}

export  default ChallengPopUp;