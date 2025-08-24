"use client"
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchCourseBySlug } from "@/store/slices/courseSlice";
import { fetchPage, fetchPageOptions } from "@/store/slices/coursePageSlice";
import { useEffect } from "react";
import { use } from "react";
import LearningSlider from "@/components/LearningSlider";

export default function CoursePage({ params }: { params: Promise<{ microLearning: string; }> }) {
    const resolvedParams = use(params);
    const { microLearning } = resolvedParams;
    const dispatch = useDispatch<AppDispatch>();
    const { currentCourse, loading, error } = useSelector((state: RootState) => state.course);
    const { currentPage, pageOptions } = useSelector((state: RootState) => state.coursePage);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseData = await dispatch(fetchCourseBySlug(microLearning)).unwrap();
                if (courseData?.id) {
                    const pageData = await dispatch(fetchPage({ courseId: courseData.id, pageNumber: 1 })).unwrap();
                    if (pageData?.id) {
                        await dispatch(fetchPageOptions(pageData.id)).unwrap();
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        
        fetchData();
    }, [dispatch, microLearning]);

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
    if (error) return <div>خطا: {error}</div>;
    if (!currentPage) return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)]" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--primary-color2)] mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)] text-lg">
            در حال بارگذاری...
          </p>
        </div>
      </div>
    )

    const normalizedCorrectAnswer = Array.isArray(currentPage.correct_answer)
        ? currentPage.correct_answer as number[]
        : (typeof currentPage.correct_answer === 'number')
            ? [currentPage.correct_answer as number]
            : undefined;

    const transformedData = {
        id: currentPage.id,
        page_type: currentPage.page_type,
        header: currentPage.title,
        text: currentPage.content,
        test_type: currentPage.test_type,
        test_grid: currentPage.test_grid,
        question: currentPage.question,
        options: pageOptions.map(option => ({
            id: parseInt(option.id),
            text: option.option_text,
            isCorrect: option.is_correct,
            icon_name: option.icon_name
        })),
        correct_answer: normalizedCorrectAnswer,
        course_id: currentCourse?.id || "",
        page_number: currentPage.page_number,
        pageLength: currentPage.page_length,
        image: currentPage.image
    };

    return (
        <div dir="rtl">
            <LearningSlider {...transformedData} />
        </div>
    );
}