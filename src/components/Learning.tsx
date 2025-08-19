"use client"
import clsx from "clsx";
import React, { useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import PopUp from "./PopUp";

export interface options {
    id: number;
    text: string;
    isCorrect: boolean;
    icon_name?: string;
}

export interface LearningPropsType {
    id: string;
    page_type: "test" | "text";
    header?: string;
    text?: string;
    test_type?: "Sequential" | "Pluggable" | "Multiple" | "Default";
    test_grid?: "col" | "grid-2" | "grid-row";
    question?: string;
    options?: options[];
    correct_answer?: number[];
    course_id: string;
    page_number: number;
    pageLength: number;
    handleNext?: () => void;
    handlePrev?: () => void;
    image?: string;
}


interface OptionCardProps {
    icon_name?: string;
    answer: string;
    id: number;
    test_type?: "Sequential" | "Pluggable" | "Multiple" | "Default";
    isSelected: boolean;
    onSelect: (answerId: number) => void;
    getSequentialOrder?: (id: number) => number;
    getPluggablePair?: (id: number) => string;
    classname?: string;
}

const OptionCard: React.FC<OptionCardProps> = ({ icon_name, answer, id, test_type="Default", isSelected, onSelect, getSequentialOrder, getPluggablePair, classname }) => {
    const getCardStyle = () => {
        const baseStyle = "px-[2rem] py-[1rem] rounded-full border-[2px] box-border cursor-pointer flex justify-between items-center transition-all duration-200";
        
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
                    "border-[var(--accent-color2)] bg-[var(--accent-color2)]/10 shadow-md"
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
            <div className="flex items-center gap-[0.8rem]">
                {icon_name && <span className="text-[1.2rem]">📝</span>}
                <p className="font-medium text-[1.1rem]">{answer}</p>
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
    )
}


const Learning: React.FC<LearningPropsType> = ({ id, page_type= "text", text, header, test_type="Default", test_grid= "col", options, question, correct_answer, course_id, page_number, pageLength, handleNext, handlePrev, image}) => {
    const router = useRouter();

    const [activeId, setActiveId] = useState<number | null>(null);
    const [multipleSelections, setMultipleSelections] = useState<number[]>([]);
    const [sequentialSelections, setSequentialSelections] = useState<number[]>([]);
    const [pluggablePairs, setPluggablePairs] = useState<{[key: number]: number | undefined}>({});
    const [isCorrect, setIsCorrect] = useState<boolean>(false);
    const [isPopUpOpen, setIsPopUpOpen] = useState<boolean>(false);

    useEffect(() => {
        if (activeId) {
            setIsCorrect(options?.find(option => option.id === activeId)?.isCorrect || false);
        }
        setIsPopUpOpen(false);
    }, [activeId])

    const handleActiveOption = (answerId: number) => {
        switch (test_type) {
            case "Default":
                setActiveId(prev => (prev === answerId ? null : answerId));
                break;
            case "Multiple":
                setMultipleSelections(prev => {
                    if (prev.includes(answerId)) {
                        return prev.filter(id => id !== answerId);
                    } else {
                        return [...prev, answerId];
                    }
                });
                break;
            case "Sequential":
                setSequentialSelections(prev => {
                    if (prev.includes(answerId)) {
                        return prev.filter(id => id !== answerId);
                    } else {
                        return [...prev, answerId];
                    }
                });
                break;
            case "Pluggable":
                setPluggablePairs(prev => {
                    const currentPairs = { ...prev };
                    
                    if (currentPairs[answerId] !== undefined) {
                        delete currentPairs[answerId];
                        Object.keys(currentPairs).forEach(key => {
                            if (currentPairs[parseInt(key)] === answerId) {
                                delete currentPairs[parseInt(key)];
                            }
                        });
                        return currentPairs;
                    }
                    
                    const unpairedOptions = Object.keys(currentPairs).filter(key => 
                        currentPairs[parseInt(key)] === undefined
                    );
                    
                    if (unpairedOptions.length > 0) {
                        const targetId = parseInt(unpairedOptions[0]);
                        currentPairs[targetId] = answerId;
                        currentPairs[answerId] = targetId;
                    } else {
                        currentPairs[answerId] = undefined;
                    }
                    
                    return currentPairs;
                });
                break;
            default:
                setActiveId(answerId);
        }
    };

    const isOptionSelected = (optionId: number): boolean => {
        switch (test_type) {
            case "Default":
                return activeId === optionId;
            case "Multiple":
                return multipleSelections.includes(optionId);
            case "Sequential":
                return sequentialSelections.includes(optionId);
            case "Pluggable":
                return pluggablePairs[optionId] !== undefined;
            default:
                return false;
        }
    };

    const handleNextPage = () => {
        if (page_number >= pageLength) router.push("/courses");
        else handleNext?.();
    };

    const handleRetry = () => {
        setIsPopUpOpen(false);
        setActiveId(null);
    }

    const handleWhy = () => {
        //TODO: show why
    }

    const handleCorrectAnswer = () => {
        //TODO: show correct answer
    }

    const handlePopUpOpen = () => {
        setIsPopUpOpen(true);
    }

    const getSequentialOrder = (optionId: number): number => {
        return sequentialSelections.indexOf(optionId) + 1;
    };

    const getPluggablePair = (optionId: number): string => {
        const pairId = pluggablePairs[optionId];
        if (pairId !== undefined) {
            return `A${Math.min(optionId, pairId)}-B${Math.max(optionId, pairId)}`;
        }
        return "Waiting...";
    };

    const getTestTypeIndicator = () => {
        switch (test_type) {
            case "Default":
                return (
                    <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg mb-4 text-center max-md:w-[90%] max-md:mx-auto">
                        <span className="font-semibold">تک انتخابی:</span> فقط یک گزینه انتخاب کنید
                    </div>
                );
            case "Multiple":
                return (
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg mb-4 text-center max-md:w-[90%] max-md:mx-auto">
                        <span className="font-semibold">چند انتخابی:</span> می‌توانید چندین گزینه انتخاب کنید
                    </div>
                );
            case "Sequential":
                return (
                    <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg mb-4 text-center max-md:w-[90%] max-md:mx-auto">
                        <span className="font-semibold">ترتیبی:</span> ترتیب انتخاب مهم است
                    </div>
                );
            case "Pluggable":
                return (
                    <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg mb-4 text-center max-md:w-[90%] max-md:mx-auto">
                        <span className="font-semibold">جفت سازی:</span> گزینه‌ها را دو به دو جفت کنید
                    </div>
                );
            default:
                return null;
        }
    };



    return (
        <div
            className={clsx(
                "h-[60vh] flex flex-col justify-center items-baseline max-md:h-auto",
                image && "min-h-[100vh] h-auto"
            )}
        >
            {page_type === "text" ?(
                <div
                    className="flex flex-col justify-center items-center max-w-[80%] max-md:max-w[95%] mx-auto"
                >
                    {image && 
                        <img 
                            src={image} 
                            alt="تصویر صفحه" 
                            className="max-h-[70vh] max-w-[80%] max-md:max-w-[95%] max-md:max-h-max mx-auto object-cover rounded-xl mb-6"
                        />
                    }
                    {header &&
                        <h1
                            className="text-[3.6rem] max-md:text-[1.8rem] font-extrabold mb-[5vh] text-center"
                        >
                            {header}
                        </h1>
                    }
                    {text &&
                        <p
                            className="text-center text-[1.2rem] font-black text-[var(--accent-color1)]"
                        >
                            {text}
                        </p>
                    }
                </div>
            ) : page_type === "test" ? (
                <div
                    className="flex flex-col justify-center mx-auto"
                >
                    {image && 
                        <img 
                            src={image} 
                            alt="تصویر صفحه" 
                            className="max-h-[70vh] max-w-[80%] max-md:max-w-[95%] max-md:max-h-max mx-auto object-cover rounded-xl mb-6"
                        />
                    }
                    
                    <p
                        className="text-[2rem] font-bold mb-[5vh] text-center max-md:max-w-[95%] mx-auto"
                    >
                        {question}
                    </p>
                    {getTestTypeIndicator()}
                    <div
                        className={clsx(
                            "w-[80%] mx-auto",
                            test_grid === "col" ? "flex flex-col gap-[1.5rem]" : 
                            test_grid === "grid-2" ? "grid grid-cols-2 gap-[1.5rem]" :
                            test_grid === "grid-row" ? "grid grid-rows-1 gap-[1.5rem]": 
                            "bg-red"
                        )}
                        style={
                            test_grid === "grid-row"
                                ? { gridTemplateColumns: `repeat(${Math.max(1, options?.length || 1)}, minmax(0, 1fr))` }
                                : undefined
                        }
                    >
                        {options?.map((option, index) => (
                            <OptionCard 
                                key={index} 
                                answer={option.text} 
                                icon_name={option.icon_name} 
                                id={option.id} 
                                test_type={test_type}
                                isSelected={isOptionSelected(option.id)} 
                                onSelect={handleActiveOption}
                                getSequentialOrder={getSequentialOrder}
                                getPluggablePair={getPluggablePair}
                                classname={clsx(test_grid === "grid-row" && "flex justify-center items-center")}
                            />
                        ))}
                    </div>

                </div>
            ) : (
                <div>
                    error
                </div>
            )}
            <button
                onClick={page_type === "test" ? handlePopUpOpen : handleNextPage}
                disabled={page_type === "test" ? (!activeId || isPopUpOpen) : false}
                className={clsx(
                    "button-primary rounded-full shadow-lg w-[10rem] mx-auto scale-[1.4] mt-[3vh] mb-[3vh]",
                    page_type === "test" && !activeId && "disabled:opacity-50"
                )}
            >
                {page_number >= pageLength ? "پایان" : "ادامه"}
            </button>
            {page_type === "test" && 
                <div 
                    className="w-[40%] max-lg:w-[60%] mx-auto absolute bottom-[1rem] left-[50%] translate-x-[-50%] max-md:w-[110%] max-md:bottom-[0.5rem] max-md:scale-[0.92]"
                >
                    <PopUp 
                        isCorrect={isCorrect}
                        isOpen={isPopUpOpen}
                        onNext={handleNext}
                        onRetry={handleRetry}
                        onWhy={handleWhy}
                        onCorrectAnswer={handleCorrectAnswer}
                    />
                </div>
            }
        </div>
    )
}

export default Learning;