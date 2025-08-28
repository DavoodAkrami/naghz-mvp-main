"use client"
import { useState, useEffect, useMemo } from "react";
import CourseCard, { CourseCardOpen } from "@/components/CourseCard";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchCourses, fetchAllCourses } from "@/store/slices/courseSlice";
import { fetchUserProgress } from "@/store/slices/userProgressSlice";
import { fetchFullCourses, FullCourse } from "@/store/slices/fullCourseSlice";
import * as LuIcons from "react-icons/lu";
import { usePathname } from "next/navigation";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import Image from "next/image";
import NeatBackground from "@/components/NeatBg";


const getIconComponent = (iconName?: string): typeof LuIcons.LuBrain => {
    if (!iconName) return LuIcons.LuBrain;
    return (LuIcons as Record<string, typeof LuIcons.LuBrain>)[iconName] || LuIcons.LuBrain;
};

const Curses: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState<string | null>(null);
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const params = useParams();
    const pathname = usePathname();
    const fullCourseSlug = params.full_course as string;
    const { courses, courseloading, error } = useSelector((state: RootState) => state.course);
    const { userProgress } = useSelector((state: RootState) => state.userProgress);
    const { fullCourses } = useSelector((state: RootState) => state.fullCourse);
    const { user } = useSelector((state: RootState) => state.auth);
    const [ pageHeader, setPageHeader] = useState<string>("");
    const [fullCourse, setFullCourse] = useState<FullCourse | null>(null);

    const startSound = useMemo(() => new Audio('/sounds/start-lesson.mp3'), [])


    useEffect(() => {
        dispatch(fetchFullCourses());
    }, [dispatch]);

    useEffect(() => {
        if (fullCourses.length > 0) {
            const foundCourse: FullCourse | undefined = fullCourses.find(course => pathname.includes(course.slug));
            setPageHeader(foundCourse?.title || "");
            setFullCourse(foundCourse || null);
        }
    }, [fullCourses, pathname])

    useEffect(() => {
        if (user?.user_metadata?.role === 'admin') {
            dispatch(fetchAllCourses());
        } else {
            dispatch(fetchCourses());
        }
        if (user?.id) {
            dispatch(fetchUserProgress(user.id));
        }
    }, [dispatch, user?.id, user?.user_metadata?.role]);

    const handleModalOpen = (id: string | null) => {
        setIsModalOpen(id);
    }

    const handleStartOnClick = (slug: string) => {
        router.push(`/courses/${fullCourseSlug}/${slug}`)
        startSound.play();
    }

    const isCourseCompleted = (courseId: string): boolean => {
        return userProgress.some(progress => progress.course_id === courseId);
    };

    if (courseloading) return (
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
            className="mt-[3rem] mb-[2rem] p-12 max-md:p-8" 
        >
            <NeatBackground />
            <div
                className="flex items-start max-md:flex-col max-md:items-center gap-[3rem] max-md:gap-[0.4rem]"
            >
                <div
                    className="w-[40%] md:sticky top-[10vh] max-md:w-[100%] max-md:mt-[2rem]"
                >
                    <div className="min-h-[40vh] max-md:min-h-[20vh] bg-[var(--primary-color1)]/50 backdrop-blur-2xl shadow-lg p-6 rounded-3xl border-[2.5px] border-[var(--primary-color1)]">
                        {fullCourse?.image && <Image
                            src={fullCourse?.image || ""}
                            alt={fullCourse?.title || ""}
                            width={500}
                            height={500}
                            className="object-cover rounded-3xl mx-auto max-w-[80%]"
                        />}
                        <h1 className="h1 text-center mb-[1rem]">
                            {fullCourse?.title}
                        </h1>
                        <p className="text-[1.2rem] leading-relaxed">
                            {fullCourse?.description}
                        </p>
                    </div>
                    <div
                        className="flex flex-col gap-[1rem] py-[3vh]"
                    >
                        <button
                            onClick={() => router.push("/courses")}
                            className="w-[100%] max-md:absolute max-md:top-[1rem] max-md:left-[1rem] max-md:w-auto max-md:p-0 md:button-secondary md:rounded-3xl md:font-bold md:border-[1.8px] md:border-transparent md:outline md:outline-[1px] md:outline-[var(--text-desable)] md:py-3 md:px-6 md:cursor-pointer md:transition-all md:duration-300 md:hover:bg-[var(--accent-color1)] md:hover:text-[var(--primary-color4)]"
                        >
                            <span className="max-md:hidden">بازگشت</span>
                            <IoArrowBackCircleOutline className="text-[4rem] text-[var(--accent-color1)] rounded-full hover:bg-[var(--accent-color1)] hover:text-[var(--primary-color4)] cursor-pointer transition-all duration-300 md:hidden" />
                        </button>
                    </div>
                </div>
                <div
                    className="w-[50%] flex flex-col gap-[2rem] max-md:w-[100%]"
                >
                    <AnimatePresence>
                        {courses.filter(course => course.full_course_id === fullCourse?.id).map((course) => (
                            <CourseCard
                                key={course.id}
                                title={course.title}
                                description={course.description}
                                icon={getIconComponent(course.icon_name)}
                                layoutId={course.slug}
                                isActive={course.is_active}
                                isCompleted={isCourseCompleted(course.id)}
                                onClick={() => handleModalOpen(course.id!)}
                                isAdmin={user?.user_metadata?.role === 'admin'}
                            />
                        ))}
                    </AnimatePresence>
                </div>
                {isModalOpen !== null &&
                    <div className="fixed inset-0 z-50000 flex items-center justify-center">
                        <motion.div
                            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
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
                                        isCompleted={isCourseCompleted(course.id)}
                                        onClick={() => handleModalOpen(null)}
                                        startOnClick={course.slug ? () => handleStartOnClick(course.slug!) : undefined}
                                        isAdmin={user?.user_metadata?.role === 'admin'}
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