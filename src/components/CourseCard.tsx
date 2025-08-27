"use client"
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import React, { useMemo } from "react";
import { IconType } from "react-icons";
import { SiTicktick } from "react-icons/si";


export interface CurseCardProps {
    courseId?: string;
    title: string;
    description: string;
    icon?: IconType;
    layoutId?: string;   
    isActive: boolean;
    isCompleted?: boolean;
    onClick?: () => void;
    startOnClick?: () => void;
    classname?: string;
    isAdmin?: boolean; 
}

const CourseCard: React.FC<CurseCardProps> = ({
    courseId,
    title,
    description,
    icon: Icon,
    layoutId,
    isActive,
    isCompleted,
    onClick,
    classname,
    isAdmin = false
}) => {
    const truncatedDescription = description.length > 80 ? `${description.slice(0, 80)}...` : description;

    const renderRichText = (text: string) => {
        if (!text) return '';
        
        let html = text
          .replace(/\[([^\]]+)\]\(([^)]+)(?:\|([^)]+))?\)/g, (match, linkText, url, target) => {
            const targetAttr = target ? ` target="${target}"` : ' target="_blank"';
            return `<a href="${url}"${targetAttr} class="text-blue-600 hover:text-blue-800 underline transition-colors duration-200" rel="noopener noreferrer">${linkText}</a>`;
          })
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/__(.*?)__/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/_(.*?)_/g, '<em>$1</em>')
          .replace(/~(.*?)~/g, '<u>$1</u>')
          .replace(/~~(.*?)~~/g, '<del>$1</del>')
          .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>')
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

    return (
        <AnimatePresence>
            <motion.div
                layoutId={layoutId}
                onClick={onClick}
                className={clsx(
                    "bg-[var(--primary-color1)]/20 px-[1rem] shadow-lg h-[150px] border border-[var(--bg-color-secondary)] rounded-md hover:bg-[var(--primary-color1)]/30 cursor-pointer flex justify-baseline items-center gap-[10%] transition-all duration-200 w-[100%] relative",
                    !isActive && !isAdmin && "opacity-[0.5] cursor-default pointer-events-none hover:border-none bg-[var(--primary-color1)]/5",
                    isCompleted && "bg-green-50 border-green-500 hover:bg-green-100"
                )}
            >
                {isCompleted && (
                    <div className="absolute -top-3 -right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        <SiTicktick className="bg-green-500 text-3xl" />
                    </div>
                )}
                
                {isAdmin && !isActive && (
                    <div className="absolute -top-3 -left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        غیرفعال
                    </div>
                )}
                
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
                    <RichText
                        content={truncatedDescription}
                        className="text-gray-600 text-sm leading-relaxed"
                    />
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export const CourseCardOpen: React.FC<CurseCardProps> = ({
    title, 
    description, 
    icon: Icon, 
    layoutId, 
    startOnClick, 
    classname,
    isActive,
    isAdmin = false
}) => {
    const renderRichText = (text: string) => {
        if (!text) return '';
        
        let html = text
          .replace(/\[([^\]]+)\]\(([^)]+)(?:\|([^)]+))?\)/g, (match, linkText, url, target) => {
            const targetAttr = target ? ` target="${target}"` : ' target="_blank"';
            return `<a href="${url}"${targetAttr} class="text-blue-600 hover:text-blue-800 underline transition-colors duration-200" rel="noopener noreferrer">${linkText}</a>`;
          })
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/__(.*?)__/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/_(.*?)_/g, '<em>$1</em>')
          .replace(/~(.*?)~/g, '<u>$1</u>')
          .replace(/~~(.*?)~~/g, '<del>$1</del>')
          .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>')
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
    return (
        <AnimatePresence>
            <motion.div
                layoutId={layoutId}
                className="flex flex-col items-center justify-center gap-[1rem] bg-[white] p-8 rounded-xl md:w-[50vw] max-w-[95vw] relative"
            >
                {/* Admin indicator for inactive courses */}
                {isAdmin && !isActive && (
                    <div className="absolute -top-3 -left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        غیرفعال
                    </div>
                )}
                
                <div 
                    className="text-center"
                >
                    <h2
                        className="text-[1.4rem] max-md:text-[1.2rem] font-bold"
                    >
                        {title}
                    </h2>
                    <RichText
                        content={description}
                    />

                </div>
                {startOnClick && (
                    <button
                        className="button-primary rounded-full mt-[1rem]"
                        onClick={startOnClick}
                    >
                        شروع کن
                    </button>
                )}
            </motion.div>
        </AnimatePresence>
    )
}

export default CourseCard;