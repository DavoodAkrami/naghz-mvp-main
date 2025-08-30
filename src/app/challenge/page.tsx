"use client"
import React, { useState, useEffect } from "react";
import LearningSlider from "@/components/LearningSlider";
import challenges from "@/Data/questions.json"

const Challenge = () => {
    const [transformedChallenges, setTransformedChallenges] = useState<any[]>([]);
    const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
    
    useEffect(() => {
        const transformed = challenges.map((challenge, index) => ({
            id: challenge.id,
            page_number: index + 1,
            page_type: "testNext" as const,
            name: `Challenge ${index + 1}`,
            title: `Challenge ${index + 1}`,
            content: challenge.prompt || "",
            question: challenge.question || "",
            test_type: "Input" as const,
            test_grid: "col" as const,
            correct_answer: [],
            image: "",
            why: null,
            ai_enabled: false,
            give_feedback: false,
            give_point: false,
            give_point_by_ai: false,
            score_threshold: 50,
            low_score_page_id: null,
            high_score_page_id: null,
            tip: "",
            system_prompt: ""
        }));
        
        setTransformedChallenges(transformed);
    }, []);

    const handleNext = () => {
        if (currentChallengeIndex < transformedChallenges.length - 1) {
            setCurrentChallengeIndex(prev => prev + 1);
        } else {
            console.log("All challenges completed!");
        }
    };


    const handlePrev = () => {
        if (currentChallengeIndex > 0) {
            setCurrentChallengeIndex(prev => prev - 1);
        }
    };

    if (transformedChallenges.length === 0) {
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
                ai_enabled={false}
                give_feedback={false}
                give_point={false}
                give_point_by_ai={false}
                score_threshold={50}
                low_score_page_id={null}
                high_score_page_id={null}
                tip=""
                system_prompt=""
                // New props to bypass database
                preloadedPages={transformedChallenges}
                preloadedOptions={{}}
                skipDatabase={true}
                // Navigation handlers
                handleNext={handleNext}
                handlePrev={handlePrev}
            />
        </div>
    );
};

export default Challenge;