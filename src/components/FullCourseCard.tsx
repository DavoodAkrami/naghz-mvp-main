import { FullCourse } from "@/store/slices/fullCourseSlice"
import React from "react"
import * as LuIcons from "react-icons/lu";
import clsx from "clsx";

const getIconComponent = (iconName?: string): typeof LuIcons.LuBrain => {
    if (!iconName) return LuIcons.LuBrain;
    return (LuIcons as Record<string, typeof LuIcons.LuBrain>)[iconName] || LuIcons.LuBrain;
};




const FullCourseCard: React.FC<FullCourse & { onClick?: () => void }> = ({ title, description, icon_name, is_active, image, onClick }) => {
    const truncatedDescription = description.length > 80 ? `${description.slice(0, 80)}...` : description;
    const IconComponent = getIconComponent(icon_name);

    return (
        <div
            onClick={onClick}
            className={clsx(
                "bg-[var(--primary-color1)]/40 backdrop-blur-xl",
                !is_active && "opacity-[0.6] pointer-events-none"
            )}
        >
            <img 
                src={image} 
                alt="Course image" 
            />
            <div>
                <div className="flex items-center gap-2">
                    <IconComponent className="w-5 h-5" />
                    <h3>
                        {title}
                    </h3>
                </div>
                <p>
                    {truncatedDescription}
                </p>
            </div>
        </div>
    )
}

export default FullCourseCard;