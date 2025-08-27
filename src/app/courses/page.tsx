"use client"
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchFullCourses, FullCourse } from "@/store/slices/fullCourseSlice";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { IconType } from "react-icons";
import FullCourseCard from "@/components/FullCourseCard";
import { useRouter } from "next/navigation";
import NeatBackground from "@/components/NeatBg";


const FullCourseDetailPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { fullCourses, fullCourseLoading, error } = useSelector((state: RootState) => state.fullCourse);
    const params = useParams();
    const fullCourseSlug = params.full_course as string;
    const route = useRouter();

    useEffect(() => {
        dispatch(fetchFullCourses());
    }, [dispatch]);

    const handleOpenCourseDetails = (slug: string) => {
        route.push(`/courses/${slug}`)
    }


    if (error) {
        console.error(error);
        return <div>Error: {error}</div>;
    }
    
    return (
        <div
            dir="rtl"
            className="py-[5vh] px-[10vw] max-md:px-[5vw]"
        >
            <NeatBackground />
            <h2
                className="mb-[8vh] mt-[3vh] h1 text-center"
            >
                دوره‌ها
            </h2>
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[3rem] max-md:gap-[1.6rem]">
                {fullCourseLoading || fullCourses.length === 0 ? (
                    Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="w-full animate-pulse">
                            <div className="bg-[var(--primary-color1)]/20 backdrop-blur-xl px-[2rem] py-[1.5rem] rounded-lg">
                                <div className="flex items-center justify-center gap-2 mb-3">
                                    <div className="h-80 w-full bg-white/30 rounded"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-white/30 rounded w-full"></div>
                                    <div className="h-4 bg-white/30 rounded w-3/4"></div>
                                    <div className="h-4 bg-white/30 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    fullCourses.map((course: FullCourse) => (
                        <FullCourseCard 
                            key={course.id}
                            title={course.title}
                            description={course.description}
                            icon_name={course.icon_name}
                            is_active={true}
                            onClick={() => handleOpenCourseDetails(course.slug)}
                            image={course.image}
                            fullCourseLaoding={fullCourseLoading}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default FullCourseDetailPage;