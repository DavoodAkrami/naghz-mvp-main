"use client"
import clsx from "clsx";
import React, { useEffect, useState, useMemo} from "react";
import { usePathname, useRouter } from "next/navigation";
import PopUp from "./PopUp";
import Modal from "./Modal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { saveProgress } from "@/store/slices/userProgressSlice";
import Image from "next/image";
import { FullCourse } from "@/store/slices/fullCourseSlice";



export interface options {
    id: number;
    text: string;
    isCorrect: boolean;
    icon_name?: string;
}

export interface LearningPropsType {
    id: string;
    page_type: "test" | "text" | "testNext";
    header?: string;
    text?: string;
    test_type?: "Sequential" | "Pluggable" | "Multiple" | "Default";
    test_grid?: "col" | "grid-2" | "grid-row";
    question?: string;
    options?: options[];
    correct_answer?: number[] | number;
    course_id: string;
    page_number: number;
    pageLength: number;
    handleNext?: () => void;
    handlePrev?: () => void;
    image?: string;
    why?: string | null;
    preloadedImages?: string[];
    onTestNextSelect?: (optionOrder: number) => void;
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
        const baseStyle = "px-[2rem] py-[1.4rem] rounded-full border-[2px] box-border cursor-pointer flex justify-between items-center transition-all duration-200 shadow-sm box-border  max-md:scale-[0.85]";
        
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
    )
}

// Helper function to parse and render rich text
const renderRichText = (text: string) => {
  if (!text) return '';
  
  // Convert markdown-like syntax to HTML
  let html = text
    // Links: [text](url) or [text](url|target)
    .replace(/\[([^\]]+)\]\(([^)]+)(?:\|([^)]+))?\)/g, (match, linkText, url, target) => {
      const targetAttr = target ? ` target="${target}"` : ' target="_blank"';
      return `<a href="${url}"${targetAttr} class="text-blue-600 hover:text-blue-800 underline transition-colors duration-200" rel="noopener noreferrer">${linkText}</a>`;
    })
    // Bold: **text** or __text__
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    // Italic: *text* or _text_
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    // Underline: ~text~
    .replace(/~(.*?)~/g, '<u>$1</u>')
    // Strikethrough: ~~text~~
    .replace(/~~(.*?)~~/g, '<del>$1</del>')
    // Code: `text`
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>')
    // Line breaks
    .replace(/\n/g, '<br />');

  return html;
};


const RichText: React.FC<{ content: string; className?: string }> = ({ content, className }) => {
  const htmlContent = useMemo(() => renderRichText(content), [content]);
  
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

// Image Preloader Component
const ImagePreloader: React.FC<{ images: string[] }> = ({ images }) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!images || images.length === 0) return;

    const loadImage = (imageUrl: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const img = new window.Image();
        
        img.onload = () => {
          setLoadedImages(prev => new Set(prev).add(imageUrl));
          resolve();
        };
        
        img.onerror = () => {
          setFailedImages(prev => new Set(prev).add(imageUrl));
          console.warn(`Failed to preload image: ${imageUrl}`);
          reject(new Error(`Failed to load image: ${imageUrl}`));
        };

        // Set crossOrigin for CORS images (like Supabase)
        img.crossOrigin = 'anonymous';
        img.src = imageUrl;
      });
    };

    // Load images with concurrency control (max 3 at a time)
    const loadImagesWithConcurrency = async () => {
      const concurrency = 3;
      const chunks = [];
      
      for (let i = 0; i < images.length; i += concurrency) {
        chunks.push(images.slice(i, i + concurrency));
      }

      for (const chunk of chunks) {
        await Promise.allSettled(
          chunk.map(imageUrl => loadImage(imageUrl))
        );
      }
    };

    loadImagesWithConcurrency();
  }, [images]);

  // Optional: Log loading progress
  useEffect(() => {
    if (images.length > 0) {
      const total = images.length;
      const loaded = loadedImages.size;
      const failed = failedImages.size;
      
      if (loaded + failed === total) {
        console.log(`Image preloading complete: ${loaded}/${total} loaded, ${failed} failed`);
      }
    }
  }, [loadedImages, failedImages, images.length]);

  return null; // This component doesn't render anything
};


const Learning: React.FC<LearningPropsType> = ({ id, page_type= "text", text, header, test_type="Default", test_grid= "col", options, question, correct_answer, course_id, page_number, pageLength, handleNext, handlePrev, image, why, preloadedImages, onTestNextSelect}) => {
    const router = useRouter();

    const [activeId, setActiveId] = useState<number | null>(null);
    const [multipleSelections, setMultipleSelections] = useState<number[]>([]);
    const [sequentialSelections, setSequentialSelections] = useState<number[]>([]);
    const [pluggablePairs, setPluggablePairs] = useState<{[key: number]: number | undefined}>({});
    const [isCorrect, setIsCorrect] = useState<boolean>(false);
    const [isPopUpOpen, setIsPopUpOpen] = useState<boolean>(false);
    const [isCorrecrAnswerModalOpen, setIsCorrecrAnswerModalOpen] = useState<boolean>(false);
    const [correctModalContent, setCorrectModalContent] = useState<string>("");
    const [isWhyModalOpen, setIsWhyModalOpen] = useState<boolean>(false);
    const [whyModalContent, setWhyModalContent] = useState<string>("");
    const [saveProgressLoading, setSaveProgressLoading] = useState<boolean>(false);

    const successSound = useMemo(() => new Audio('/sounds/correct.mp3'), []);
    const wrongSound = useMemo(() => new Audio('/sounds/incorrect.mp3'), []);
    const endSound = useMemo(() => new Audio('/sounds/endstate.mp3'), []);
    const lightweight = useMemo(() => new Audio('/sounds/lightweight-choice.mp3'), [])

    const hasPluggablePair = Object.values(pluggablePairs).some(v => v !== undefined);
    const hasMultipleSelection = multipleSelections.length > 0;
    const hasSequentialSelection = sequentialSelections.length > 0;

    const [fullCourseRoute, setFullCourseRoute] = useState<string | null>(null);
    const pathname = usePathname();


    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { fullCourses } = useSelector((state: RootState) => state.fullCourse);
    const { userProgress } = useSelector((state: RootState) => state.userProgress);
    const { courseloading: courseLoading } = useSelector((state: RootState) => state.course);
    const { currentPageNumber, totalPages } = useSelector((state: RootState) => state.coursePage);

    const isCompleted = userProgress.some(progress => progress.course_id === course_id);


    useEffect(() => {
        const foundCourse: FullCourse | undefined = fullCourses.find(course => pathname.includes(course.slug));
        setFullCourseRoute(foundCourse?.slug || "");
    }, [])

    useEffect(() => {
        if (activeId) {
            setIsCorrect(options?.find(option => option.id === activeId)?.isCorrect || false);

        }
        setIsPopUpOpen(false);
    }, [activeId])

    useEffect(() => {
        lightweight.play()
    }, [activeId, multipleSelections, sequentialSelections, pluggablePairs])

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
        if (page_number >= pageLength) {
            endSound.play();
            router.push(`/courses/${fullCourseRoute}`)
            if (!isCompleted){ 
                setSaveProgressLoading(true)
                dispatch(saveProgress({ courseId: course_id, userId: user?.id || '' }))
                setSaveProgressLoading(false)
            }
        } else {
            successSound.play();
            handleNext?.();
        }
    };

    const handleRetry = () => {
        setIsPopUpOpen(false);
        switch (test_type) {
            case "Default":
                setActiveId(null);
                break;
            case "Multiple":
                setMultipleSelections([]);
                break;
            case "Sequential":
                setSequentialSelections([]);
                break;
            case "Pluggable":
                setPluggablePairs({});
                break;
            default:
                setActiveId(null);
                break;
        }
    }

    const handleWhy = () => {
        setIsWhyModalOpen(true);
        setWhyModalContent(why || "");
    }

    const handleCorrectAnswer = () => {
        setIsCorrecrAnswerModalOpen(true);
        switch (test_type) {
            case "Default": {
                const id = typeof correct_answer === 'number'
                    ? correct_answer
                    : Array.isArray(correct_answer) && typeof correct_answer[0] === 'number'
                        ? correct_answer[0]
                        : undefined;
                const text = id !== undefined
                    ? (options?.find(option => option.id === id)?.text || String(id))
                    : "";
                setCorrectModalContent(text);
                break;
            }
            case "Multiple": {
                const ids = Array.isArray(correct_answer)
                    ? correct_answer
                    : typeof correct_answer === 'number'
                        ? [correct_answer]
                        : [];
                const texts = ids.map((id) => options?.find((o) => o.id === id)?.text || String(id));
                setCorrectModalContent(texts.join(", ") || "");
                break;
            }
            case "Sequential": {
                const ids = Array.isArray(correct_answer)
                    ? correct_answer
                    : typeof correct_answer === 'number'
                        ? [correct_answer]
                        : [];
                const texts = ids.map((id) => options?.find((o) => o.id === id)?.text || String(id));
                setCorrectModalContent(texts.join(", ") || "");
                break;
            }
            case "Pluggable": {
                // Normalize correct_answer into pairs
                const pairs: [number, number][] = (() => {
                    if (Array.isArray(correct_answer)) {
                        if (correct_answer.length > 0 && Array.isArray((correct_answer as unknown[])[0])) {
                            const out: [number, number][] = [];
                            for (const p of correct_answer as unknown[]) {
                                if (Array.isArray(p) && typeof p[0] === 'number' && typeof p[1] === 'number') {
                                    out.push([p[0], p[1]]);
                                }
                            }
                            return out;
                        }
                        const nums = correct_answer as number[];
                        const out: [number, number][] = [];
                        for (let i = 0; i + 1 < nums.length; i += 2) {
                            out.push([nums[i], nums[i + 1]]);
                        }
                        return out;
                    }
                    return [];
                })();
                const texts = pairs.map(([a, b]) => {
                    const ta = options?.find(o => o.id === a)?.text || String(a);
                    const tb = options?.find(o => o.id === b)?.text || String(b);
                    return `${ta} - ${tb}`;
                });
                setCorrectModalContent(texts.join(", ") || "");
                break;
            }
            default:
                setCorrectModalContent("");
                break;
        }
    }

    const handlePopUpOpen = () => {
        if (test_type === "Default") {
            const correct =
              typeof correct_answer === "number"
                ? activeId !== null && activeId === correct_answer
                : Array.isArray(correct_answer) &&
                  activeId !== null &&
                  correct_answer[0] === activeId;
            setIsCorrect(!!correct);
            correct ? successSound.play() : wrongSound.play();
        } else if (test_type === "Multiple") {
            const correct =
            Array.isArray(correct_answer) &&
            multipleSelections.length === correct_answer.length &&
            correct_answer.every(id => multipleSelections.includes(id));
            setIsCorrect(!!correct);
            correct ? successSound.play() : wrongSound.play();
        } else if (test_type === "Sequential") {
            const correct =
            Array.isArray(correct_answer) &&
            sequentialSelections.length === correct_answer.length &&
            correct_answer.every((id, idx) => sequentialSelections[idx] === id);
            setIsCorrect(!!correct);
            correct ? successSound.play() : wrongSound.play();
        } else if (test_type === "Pluggable") {
            // Build user pairs from the mapping { [id]: pairedId }
            const userPairs: [number, number][] = [];
            const seen = new Set<number>();
            Object.keys(pluggablePairs).forEach(k => {
                const a = parseInt(k);
                const b = pluggablePairs[a];
                if (typeof b !== 'number') return;
                if (seen.has(a) || seen.has(b)) return;
                const x = Math.min(a, b), y = Math.max(a, b);
                seen.add(x); seen.add(y);
                userPairs.push([x, y]);
            });
            userPairs.sort((p1, p2) => (p1[0] - p2[0]) || (p1[1] - p2[1]));

            
            const expectedPairs: [number, number][] = (() => {
                if (Array.isArray(correct_answer)) {
                    if (correct_answer.length > 0 && Array.isArray((correct_answer as unknown[])[0])) {

                        const out: [number, number][] = [];
                        for (const p of correct_answer as unknown[]) {
                            if (Array.isArray(p) && typeof p[0] === 'number' && typeof p[1] === 'number') {
                                const x = Math.min(p[0], p[1]);
                                const y = Math.max(p[0], p[1]);
                                out.push([x, y]);
                            }
                        }
                        return out.sort((p1, p2) => (p1[0] - p2[0]) || (p1[1] - p2[1]));
                    }
                    
                    const nums = correct_answer as number[];
                    const out: [number, number][] = [];
                    for (let i = 0; i + 1 < nums.length; i += 2) {
                        const x = Math.min(nums[i], nums[i + 1]);
                        const y = Math.max(nums[i], nums[i + 1]);
                        out.push([x, y]);
                    }
                    return out.sort((p1, p2) => (p1[0] - p2[0]) || (p1[1] - p2[1]));
                }
                return [];
            })();

            const correct = userPairs.length === expectedPairs.length &&
                userPairs.every((p, i) => p[0] === expectedPairs[i][0] && p[1] === expectedPairs[i][1]);

            setIsCorrect(!!correct);
            correct ? successSound.play() : wrongSound.play();
        }
        setIsPopUpOpen(true);
    }

    useEffect(() => {
        setIsPopUpOpen(false);
    }, [activeId, multipleSelections, sequentialSelections, pluggablePairs])

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
                "h-[75vh] flex flex-col justify-center items-baseline max-md:h-auto",
                image && "min-h-[100vh] h-auto"
            )}
        >
            {page_type === "text" ?(
                <div
                    className="flex flex-col justify-center items-center max-w-[80%] max-md:max-w[95%] mx-auto"
                >
                    {image && (
                        courseLoading || saveProgressLoading ? (
                            <div className="animate-pulse bg-[var(--hover-color)]/60 max-h-[70vh] h-[40vh] max-w-[80%] max-md:max-w-[95%] mx-auto rounded-xl mb-6" />
                        ) : (
                            <Image 
                                src={image} 
                                width={500}
                                height={100000}
                                alt="تصویر صفحه" 
                                priority
                                className="max-h-[70vh] max-w-[80%] max-md:max-w-[95%] max-md:max-h-max mx-auto object-cover rounded-xl mb-6"
                            />
                        )
                    )}
                    {header &&
                        <RichText
                            content={header}
                            className="text-[3.6rem] whitespace-pre-wrap max-md:text-[1.8rem] max-w-[90%] font-extrabold mx-auto mb-[3vh] text-center"
                        />
                    }
                    {text &&
                        <RichText
                            content={text}
                            className="text-justify whitespace-pre-wrap text-[1.2rem] font-black max-w-[90%] mx-auto order-[3px] border-[var(--primary-color1)] bg-[var(--primary-color1)]/50 backdrop-blur-xl p-4 rounded-2xl text-[var(--text-primary)] my-[2vh]"
                        />
                    }
                </div>
            ) : (page_type === "test" || page_type === "testNext") ? (
                <div
                    className="flex flex-col justify-center mx-auto py-[5vh]"
                >
                    {image && (
                        courseLoading ? (
                            <div className="animate-pulse bg-[var(--hover-color)]/60 max-h-[70vh] h-[40vh] max-w-[80%] max-md:max-w-[95%] mx-auto rounded-xl mb-6" />
                        ) : (
                            <Image 
                                src={image} 
                                width={450}
                                height={100000}
                                alt="تصویر صفحه"
                                priority 
                                className="max-h-[70vh] max-w-[80%] max-md:max-w-[95%] max-md:max-h-max mx-auto object-cover rounded-xl mb-6"
                            />
                        )
                    )}
                    {text && (
                        <RichText
                            content={text}
                            className="text-[1.2rem] whitespace-pre-wrap text-[var(--text-primary)] border-[3px] border-[var(--primary-color1)] bg-[var(--primary-color1)]/50 backdrop-blur-xl p-4 rounded-2xl max-w-[90%] mx-auto text-justify my-[3vh]"
                        />
                    )}
                    {question && (
                        <RichText
                            content={question}
                            className="text-[2rem] whitespace-pre-wrap font-bold mb-[5vh] text-center max-w-[90%] max-md:max-w-[95%] mx-auto"
                        />
                    )}
                    {getTestTypeIndicator()}
                    {(options && !courseLoading) && (
                        <div
                            className={clsx(
                                "w-[50vw] mx-auto max-md:w-[80vw]",
                                test_grid === "col" ? "flex flex-col gap-[1.5rem] max-md:gap-[1rem] min-w-[40vw] max-md:min-w-[70vw]" : 
                                test_grid === "grid-2" ? "grid grid-cols-2 gap-[1.5rem] max-md:gap-[1rem] min-[30vw] max-md:main-w-[20vw]" :
                                test_grid === "grid-row" ? "grid grid-rows-1 gap-[1.5rem] max-md:gap-[1rem] min-w-[20vw] max-md:flex max-md:flex-col": 
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
                                    isSelected={page_type === "testNext" ? false : isOptionSelected(option.id)} 
                                    onSelect={page_type === "testNext" ? (id) => onTestNextSelect?.(id) : handleActiveOption}
                                    getSequentialOrder={getSequentialOrder}
                                    getPluggablePair={getPluggablePair}
                                    classname={clsx(test_grid === "grid-row" && "flex justify-center items-center")}
                                />
                            ))}
                        </div>
                    )}
                    {(options && courseLoading) && (
                        <div
                            className={clsx(
                                "w-[50vw] mx-auto max-md:w-[80vw]",
                                test_grid === "col" ? "flex flex-col gap-[1.5rem] max-md:gap-[1rem] min-w-[40vw] max-md:min-w-[70vw]" : 
                                test_grid === "grid-2" ? "grid grid-cols-2 gap-[1.5rem] max-md:gap-[1rem] min-[30vw] max-md:main-w-[20vw]" :
                                test_grid === "grid-row" ? "grid grid-rows-1 gap-[1.5rem] max-md:gap-[1rem] min-w-[20vw] max-md:flex max-md:flex-col": 
                                "bg-red"
                            )}
                            style={
                                test_grid === "grid-row"
                                    ? { gridTemplateColumns: `repeat(${Math.max(1, (options?.length || 4))}, minmax(0, 1fr))` }
                                    : undefined
                            }
                        >
                            {Array.from({ length: options?.length || 4 }).map((_, idx) => (
                                <div key={idx} className="animate-pulse px-[2rem] py-[1.4rem] rounded-full border-[2px] border-[var(--accent-color1)] bg-[var(--hover-color)]/40 h-[3.2rem]" />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    error
                </div>
            )}
            <button
                onClick={page_type === "test" ? handlePopUpOpen : handleNextPage}
                disabled={
                    page_type === "test"
                      ? (test_type === "Pluggable"
                          ? (!hasPluggablePair || isPopUpOpen)
                          : test_type === "Multiple"
                            ? (!hasMultipleSelection || isPopUpOpen)
                            : test_type === "Sequential"
                              ? (!hasSequentialSelection || isPopUpOpen)
                              : (!activeId || isPopUpOpen))
                      : false
                  }
                className={clsx(
                    "button-primary rounded-full shadow-xl hover:bg active:shadow-none w-[10rem] mx-auto scale-[1.4] mt-[3vh] mb-[3vh]",
                    page_type === "test" && !activeId && "disabled:opacity-50",
                    page_type === "testNext" && options && "hidden" 
                )}
            >
                {page_number >= pageLength ? "پایان" : "ادامه"}
            </button>
            {page_type === "test" && 
                <div 
                    className="flex justify-center w-[40%] max-lg:w-[60%] fixed bottom-[1rem] left-0 right-0 mx-auto max-md:w-[100%] max-md:bottom-[1rem] max-md:scale-[0.92] z-10"
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
            <Modal
                onOpen={isCorrecrAnswerModalOpen}
                onClose={() => setIsCorrecrAnswerModalOpen(false)}
            >
                <div className="text-center">
                    <h1
                        className={clsx(
                            "text-[2rem] font-bold",
                            isCorrect ? "text-[var(--secondary-color1)]" : "text-[var(--secondary-color2)]"
                        )}
                    >
                        {isCorrect ? "جواب درست" : "جواب اشتباه"}
                    </h1>
                    <p className="text-[1.5rem] w-[90%] mx-auto">
                        جواب درست: {correctModalContent}
                    </p>
                </div>
            </Modal>
            <Modal
                onOpen={isWhyModalOpen}
                onClose={() => setIsWhyModalOpen(false)}
            >
                <div className="text-center">
                    <h1 className="text-[2rem] font-bold">دلیل</h1>
                </div>
                <p className="text-[1.5rem] w-[90%] mx-auto">
                    {whyModalContent}
                </p>
            </Modal>
            {preloadedImages && <ImagePreloader images={preloadedImages} />}
        </div>
    )
}

export default Learning;