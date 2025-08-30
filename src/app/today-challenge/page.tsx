"use client"
import React, { useState, useEffect } from "react";
import LearningSlider from "@/components/LearningSlider";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchTodaysChallenge } from "@/store/slices/challengesSlice";
import { useRouter } from "next/navigation";

const Challenge = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
    const router = useRouter();
    
    const { challengesLoading, challenges, error} = useSelector((state: RootState) => state.challengse);
    

    useEffect(() => {
        dispatch(fetchTodaysChallenge());
    }, [dispatch]);


    const transformedChallenges: any[] = challenges.map((challenge: any, index: number) => ({
        id: challenge.id,
        page_number: index + 1,
        page_type: "testNext" as const,
        name: `Challenge ${index + 1}`,
        title: `Challenge ${index + 1}`,
        content: "",
        question: challenge.question || "",
        test_type: "Input" as const,
        test_grid: "col" as const,
        correct_answer: [],
        image: "",
        why: null,
        ai_enabled: true,
        give_feedback: true,
        give_point: false,
        give_point_by_ai: false,
        score_threshold: 50,
        low_score_page_id: null,
        high_score_page_id: null,
        tip: "",
        system_prompt: challenge.prompt || "",
    }));


    const finalLearningPage = {
        id: "final-learning",
        page_number: challenges.length + 1,
        page_type: "text" as const,
        name: "یادگیری نهایی",
        title: "چالش‌های امروز با موفقیت به پایان رسید",
        content: "شما با موفقیت تمام چالش‌های امروز را پشت سر گذاشتید!",
        question: "",
        test_type: "Default" as const,
        test_grid: "col" as const,
        correct_answer: [],
        image: "",
        why: null,
        ai_enabled: true,
        give_feedback: true,
        give_point: false,
        give_point_by_ai: false,
        score_threshold: 50,
        low_score_page_id: null,
        high_score_page_id: null,
        tip: "",
        system_prompt: ""
    };

    transformedChallenges.push(finalLearningPage);


    const handleNext = () => {
        if (currentChallengeIndex < transformedChallenges.length - 1) {
            setCurrentChallengeIndex(prev => prev + 1);
            
 
            if (currentChallengeIndex === transformedChallenges.length - 2) {
                localStorage.setItem("isChallengeCompleted", "true");
            }
        } else {
            localStorage.setItem("isChallengeCompleted", "true");
            router.push('/');
        }
    };


    const handlePrev = () => {
        if (currentChallengeIndex > 0) {
            setCurrentChallengeIndex(prev => prev - 1);
        }
    };

    if (challengesLoading || challenges.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)]" dir="rtl">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--primary-color2)] mx-auto mb-4"></div>
                    <p className="text-[var(--text-secondary)] text-lg">
                        در حال بارگذاری چالش‌ها...
                    </p>
                </div>
            </div>
        );
    }

    const currentChallenge = transformedChallenges[currentChallengeIndex];

    return (
        <div className="min-h-screen bg-[var(--bg-color)]" dir="rtl">
            <LearningSlider 
                key={`${currentChallenge.id}-${currentChallengeIndex}`}
                id={currentChallenge.id}
                page_type="testNext"
                test_type="Input"
                question={currentChallenge.question}
                course_id="challenge-course"
                page_number={currentChallenge.page_number}
                pageLength={transformedChallenges.length}
                header={currentChallenge.title}
                text={currentChallenge.content}
                name={currentChallenge.name}
                test_grid="col"
                options={[]}
                correct_answer={[]}
                image=""
                why={null}
                ai_enabled={currentChallenge.ai_enabled}
                give_feedback={currentChallenge.give_feedback}
                give_point={currentChallenge.give_point}
                give_point_by_ai={currentChallenge.give_point_by_ai}
                score_threshold={currentChallenge.score_threshold}
                low_score_page_id={currentChallenge.low_score_page_id}
                high_score_page_id={currentChallenge.high_score_page_id}
                tip={currentChallenge.tip}
                system_prompt={currentChallenge.system_prompt}

                preloadedPages={transformedChallenges}
                preloadedOptions={{}}
                skipDatabase={true}

                handleNext={handleNext}
                handlePrev={handlePrev}
                challengePage={true}
            />
        </div>
    );
};

export default Challenge;