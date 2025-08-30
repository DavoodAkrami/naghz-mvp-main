"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import ChallengPopUp from '@/components/ChallengPopUp';
import { useRouter, usePathname } from 'next/navigation';

interface ChallengeContextType {
    showChallengePopup: boolean;
    closeChallengePopup: () => void;
    handleAcceptChallenge: () => void;
    handleDeclineChallenge: () => void;
}

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

export const useChallenge = () => {
    const context = useContext(ChallengeContext);
    if (context === undefined) {
        throw new Error('useChallenge must be used within a ChallengeProvider');
    }
    return context;
};

interface ChallengeProviderProps {
    children: ReactNode;
}

export const ChallengeProvider: React.FC<ChallengeProviderProps> = ({ children }) => {
    const [showChallengePopup, setShowChallengePopup] = useState<boolean>(false);
    const router = useRouter();
    const pathname = usePathname();
    
    const { userProgress } = useSelector((state: RootState) => state.userProgress);
    const { challenges } = useSelector((state: RootState) => state.challengse);
    const { user } = useSelector((state: RootState) => state.auth);

    // Check if user has passed a course that has a challenge
    const hasPassedCourseWithChallenge = () => {
        if (!user || !userProgress || !challenges || challenges.length === 0) {
            return false;
        }

        // Get all completed course IDs
        const completedCourseIds = userProgress
            .filter(progress => progress.completed_at)
            .map(progress => progress.course_id);

        // Check if any challenge's course_id matches a completed course
        return challenges.some(challenge => 
            completedCourseIds.includes(challenge.course_id)
        );
    };

    // Check if we should show the challenge popup
    const shouldShowChallengePopup = () => {
        // Don't show popup if user is on today-challenge page
        if (pathname === '/today-challenge') {
            return false;
        }

        // Check if it's a new day and reset localStorage
        const today = new Date().toISOString().split('T')[0];
        const lastCheckDate = localStorage.getItem('challengeCheckDate');
        
        if (lastCheckDate !== today) {
            // New day - reset challenge completion status
            localStorage.removeItem('isChallengeCompleted');
            localStorage.setItem('challengeCheckDate', today);
        }

        // Check if challenge was already completed today
        const isChallengeCompleted = localStorage.getItem('isChallengeCompleted') === 'true';
        
        // Check if user declined and 1 hour hasn't passed yet
        const declinedTime = localStorage.getItem('challengeDeclinedTime');
        let isWithinDeclineWindow = false;
        
        if (declinedTime) {
            const now = Date.now();
            const declinedAt = parseInt(declinedTime);
            const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
            
            if (now - declinedAt < oneHour) {
                isWithinDeclineWindow = true;
            } else {
                // 1 hour has passed, remove the declined time
                localStorage.removeItem('challengeDeclinedTime');
            }
        }

        return hasPassedCourseWithChallenge() && !isChallengeCompleted && !isWithinDeclineWindow;
    };

    useEffect(() => {
        if (shouldShowChallengePopup()) {
            // Show popup after 4 seconds
            const timer = setTimeout(() => {
                setShowChallengePopup(true);
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [user, userProgress, challenges, pathname]);

    const closeChallengePopup = () => {
        setShowChallengePopup(false);
    };

    const handleAcceptChallenge = () => {
        setShowChallengePopup(false);
        // Redirect to challenge page
        router.push('/today_challenge');
    };

    const handleDeclineChallenge = () => {
        setShowChallengePopup(false);
        // Set declined time to prevent showing popup for 1 hour
        localStorage.setItem('challengeDeclinedTime', Date.now().toString());
    };

    const value: ChallengeContextType = {
        showChallengePopup,
        closeChallengePopup,
        handleAcceptChallenge,
        handleDeclineChallenge,
    };

    return (
        <ChallengeContext.Provider value={value}>
            {children}
            
            {showChallengePopup && (
                <ChallengPopUp 
                    type="text"
                    text="چالش امروزتو انجام بده!"
                    openPopUp={showChallengePopup}
                    onClose={handleDeclineChallenge}
                    onAccept={handleAcceptChallenge}
                />
            )}
        </ChallengeContext.Provider>
    );
};

export default ChallengeProvider;