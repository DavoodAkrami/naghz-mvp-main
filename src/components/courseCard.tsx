"use client"
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import React from "react";
import { IconType } from "react-icons";


export interface CurseCardProps {
    courseId?: string;
    title: string;
    description: string;
    icon?: IconType;
    layoutId?: string;   
    isActive: boolean;
    onClick?: () => void;
    startOnClick?: () => void;
    classname?: string;
}

const CourseCard: React.FC<CurseCardProps> = ({title, description, icon: Icon, layoutId, isActive, onClick, classname}) => {
    const truncatedDescription = description.length > 80 ? `${description.slice(0, 80)}...` : description;

    return (
        <AnimatePresence>
            <motion.div
                layoutId={layoutId}
                onClick={onClick}
                className={clsx(
                    "w-[350px] bg-[white] px-[1rem] shadow-md h-[150px] border border-[var(--bg-color-secondary)] rounded-md hover:border-[var(--bg-color-secondary)/5] cursor-pointer flex justify-baseline items-center gap-[10%] transition-all duration-150",
                    !isActive && "opacity-[0.5] cursor-default pointer-events-none hover:border-none bg-gray-200"
                )}
            >
                {Icon &&
                    <Icon 
                        className="text-[4rem]"
                    />
                }
                <div>
                    <h2
                        className="text-[1.4rem] max-md:text-[1.2rem] font-bold"
                    >
                        {title}
                    </h2>
                    <p
                        className="text-gray-600 text-sm leading-relaxed"
                    >
                        {truncatedDescription}
                    </p>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export const CourseCardOpen: React.FC<CurseCardProps> = ({title, description, icon: Icon, layoutId, startOnClick, classname}) => {
    return (
        <AnimatePresence>
                <motion.div
                    layoutId={layoutId}
                    className="flex flex-col items-center justify-center gap-[1rem] bg-[white] p-8 rounded-xl md:max-w-[50vw] max-w-[95vw]"
                >
                    <div 
                        className="text-center"
                    >
                        <h2
                            className="text-[1.4rem] max-md:text-[1.2rem] font-bold"
                        >
                            {title}
                        </h2>
                        <p
                            className=""
                        >
                            {description}
                        </p>
                    </div>
                    <button
                            className="button-primary rounded-full mt-[1rem]"
                            onClick={startOnClick}
                        >
                            شروع کن
                    </button>
                </motion.div>
        </AnimatePresence>
    )
}

export default CourseCard;