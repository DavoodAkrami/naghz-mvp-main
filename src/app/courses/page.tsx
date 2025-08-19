"use client"
import { useState, useEffect } from "react";
import CourseCard, { CourseCardOpen } from "@/components/courseCard";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchCourses } from "@/store/slices/courseSlice";
import * as LuIcons from "react-icons/lu";

const getIconComponent = (iconName?: string): typeof LuIcons.LuBrain => {
    if (!iconName) return LuIcons.LuBrain;
    return (LuIcons as Record<string, typeof LuIcons.LuBrain>)[iconName] || LuIcons.LuBrain;
};

const Curses: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState<string | null>(null);
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { courses, loading, error } = useSelector((state: RootState) => state.course);

    useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch]);

    const handleModalOpen = (id: string | null) => {
        setIsModalOpen(id);
    }

    const handleStartOnClick = (slug: string) => {
        router.push(`/courses/${slug}`)
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)]" dir="rtl">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--primary-color2)] mx-auto mb-4"></div>
                <p className="text-[var(--text-secondary)] text-lg">
                    در حال بارگذاری...
                </p>
            </div>
        </div>
    )
    if (error) return <div>Error: {error}</div>
    return (
        <div
            dir="rtl"
            className="mt-[2rem] p-12"
        >
            <h1 className="text-center text-[4rem] font-bold maxx-md:text-[2rem] mb-[2rem]">دوره های آموزشی</h1>
            <div
                className="w-[70%] md:grid flex flex-col justify-center items-center md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-[2rem] mx-auto"
            >
                <AnimatePresence>
                    {courses.map((course) => (
                        <CourseCard
                            key={course.id}
                            title={course.title}
                            description={course.description}
                            icon={getIconComponent(course.icon_name)}
                            layoutId={course.slug}
                            isActive={course.is_active}
                            onClick={() => handleModalOpen(course.id!)}
                        />
                    ))}
                </AnimatePresence>
                {isModalOpen !== null &&
                    <div className="fixed inset-0 z-50000 flex items-center justify-center">
                        <motion.div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => handleModalOpen(null)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                        />

                        <div className="relative z-10" onClick={e => e.stopPropagation()}>
                            {(() => {
                                const course = courses.find(course => course.id === isModalOpen);
                                if (!course) return null;

                                return (
                                    <CourseCardOpen
                                        key={course.id}
                                        title={course.title}
                                        description={course.description}
                                        icon={getIconComponent(course.icon_name)}
                                        layoutId={course.slug}
                                        isActive={course.is_active}
                                        onClick={() => handleModalOpen(null)}
                                        startOnClick={course.slug ? () => handleStartOnClick(course.slug!) : undefined}
                                    />
                                );
                            })()}
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Curses;