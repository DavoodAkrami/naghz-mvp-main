import React from "react"
import * as LuIcons from "react-icons/lu";
import clsx from "clsx";
import Image from "next/image";

const getIconComponent = (iconName?: string): typeof LuIcons.LuBrain => {
    if (!iconName) return LuIcons.LuBrain;
    return (LuIcons as Record<string, typeof LuIcons.LuBrain>)[iconName] || LuIcons.LuBrain;
};




interface FullCourseCardProps {
    title: string;
    description: string;
    icon_name?: string;
    is_active: boolean;
    image?: string;
    onClick?: () => void;
    fullCourseLaoding: boolean;
}

const FullCourseCard: React.FC<FullCourseCardProps> = ({ title, description, icon_name, is_active, image, onClick, fullCourseLaoding }) => {
    const truncatedDescription = description.length > 80 ? `${description.slice(0, 80)}...` : description;
    const IconComponent = getIconComponent(icon_name);

    return (
        <div
            onClick={onClick}
            className={clsx(
                "bg-[var(--primary-color1)]/40 backdrop-blur-xl px-[1rem] flex flex-col justify-center items-center gap-[1rem] rounded-3xl py-[1rem] border-[3px] border-[var(--primary-color1)]/60 hover:border-[var(--primary-color1)] hover:shadow-[0_0_12px_var(--primary-color1)] transition-all duration-200 cursor-pointer",
                !is_active && "opacity-[0.6] pointer-events-none"
            )}
        >
            {image ? (
                <Image 
                    src={image}
                    height={400}
                    width={550}
                    alt="Course image" 
                    className="rounded-2xl"
                />
            ) : fullCourseLaoding ? (
                <div className="w-400 h-300 animate-pulse bg-white/30 rounded-lg"></div>
            ) : (
                <div className="w-400 h-300 animate-pulse bg-white/30 rounded-lg"></div>
            )}
            <div
                className=""
            >
                <div className="flex items-center gap-2 justify-center">
                    <h3 className="h3 text-center">
                        {title}
                    </h3>
                </div>
                <p
                    className="text-[1.2rem]"
                >
                    {truncatedDescription}
                </p>
            </div>
        </div>
    )
}

export default FullCourseCard;