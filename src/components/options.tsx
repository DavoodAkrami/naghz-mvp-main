"use client"
import React from "react";
import clsx from "clsx";

interface OptionCardProps {
    icon_name?: string;
    answer: string;
    id: number;
    test_type?: "Sequential" | "Pluggable" | "Multiple" | "Default" | "Input";
    isSelected: boolean;
    onSelect: (answerId: number) => void;
    getSequentialOrder?: (id: number) => number;
    getPluggablePair?: (id: number) => string;
    classname?: string;
}

export const OptionCard: React.FC<OptionCardProps> = ({ icon_name, answer, id, test_type = "Default", isSelected, onSelect, getSequentialOrder, getPluggablePair, classname }) => {
    const getCardStyle = () => {
        const baseStyle = "px-[2rem] py-[1.4rem] rounded-2xl border-[2px] box-border cursor-pointer flex justify-between items-center transition-all duration-200 shadow-sm box-border text-center max-md:scale-[0.85]";

        switch (test_type) {
            case "Default":
                return clsx(
                    baseStyle,
                    "border-[var(--accent-color1)]",
                    isSelected && "border-[3px] border-[var(--accent-color2)] bg-[var(--accent-color2)]/10 shadow-md"
                );
            case "Multiple":
                return clsx(
                    baseStyle,
                    "border-[var(--accent-color1)]",
                    isSelected && "border-[3px] border-[var(--accent-color2)] bg-[var(--accent-color2)]/10 shadow-md"
                );
            case "Sequential":
                return clsx(
                    baseStyle,
                    "border-[var(--accent-color1)]",
                    isSelected && "border-[3px] border-[var(--accent-color2)] bg-[var(--accent-color2)]/10 shadow-md"
                );
            case "Pluggable":
                return clsx(
                    baseStyle,
                    "border-[var(--accent-color1)]",
                    isSelected && "border-[3px] border-[var(--accent-color2)] bg-[var(--accent-color2)]/10 shadow-md"
                );
            default:
                return clsx(baseStyle, "border-[var(--accent-color1)]");
        }
    };

    return (
        <div 
            onClick={() => onSelect(id)}
            className={clsx(getCardStyle(), classname)}
        >
            <div className="flex items-center text-center gap-[0.8rem]">
                {icon_name && <span className="text-[1.2rem]">📝</span>}
                <p className="font-medium text-[1.4rem] text-center">{answer}</p>
            </div>
            <div className="flex items-center gap-[0.5rem]">
                {test_type === "Sequential" && isSelected && getSequentialOrder && (
                    <span className="bg-[var(--accent-color2)] text-white text-xs px-2 py-1 rounded-full font-bold">
                        {getSequentialOrder(id)}
                    </span>
                )}
                {test_type === "Pluggable" && isSelected && getPluggablePair && (
                    <span className="bg-[var(--accent-color2)] text-white text-xs px-2 py-1 rounded-full font-bold">
                        {getPluggablePair(id)}
                    </span>
                )}
            </div>
        </div>
    );
};


