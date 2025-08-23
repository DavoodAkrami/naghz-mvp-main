"use client"
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchFullCourses } from "@/store/slices/courseSlice";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { IconType } from "react-icons";
import FullCourseCard from "@/components/CourseCard";
import { useRouter } from "next/navigation";


const FullCourseDetailPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { fullCourses, loading, error } = useSelector((state: RootState) => state.course);
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
            className="py-[5vh] px-[10vw]"
        >
            <h2
                className="mb-[8vh] mt-[3vh] h1 text-center"
            >
                دوره‌ها
            </h2>
            <div className="flex flex-col gap-[2rem]">
                {loading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="w-full animate-pulse">
                            <div className="bg-[var(--primary-color1)]/20 backdrop-blur-xl px-[2rem] py-[1.5rem] rounded-lg">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-5 h-5 bg-white/30 rounded"></div>
                                    <div className="h-6 bg-white/30 rounded w-1/3"></div>
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
                    fullCourses.map((course: any) => (
                        <FullCourseCard 
                            key={course.id}
                            title={course.title}
                            description={course.description}
                            icon={course.icon_name as unknown as IconType}
                            isActive={true}
                            onClick={() => handleOpenCourseDetails(course.slug)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default FullCourseDetailPage;