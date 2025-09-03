
export const parseAIScore = (rawResponse: string): number => {
  const match = rawResponse.match(/\d+(\.\d+)?/);
  const parsed = match ? Number(match[0]) : NaN;
  
  if (!Number.isFinite(parsed)) {
    throw new Error('Model did not return a numeric score');
  }
  
  return Math.max(0, Math.min(100, Math.round(parsed)));
};

export const getNextPageId = (
  score: number,
  lowScorePageId?: string | null,
  highScorePageId?: string | null,
  threshold: number = 50
): string | null => {
  if (score < threshold) {
    return lowScorePageId || null;
  } else {
    return highScorePageId || null;
  }
};


export const evaluateTipScore = (
  score: number,
  setIsTipModalOpen: (isOpen: boolean) => void,
  pulseTip: () => void,
  handleNext: () => void,
  wrongSound: HTMLAudioElement,
  successSound: HTMLAudioElement
): void => {
  if (score < 30) {
    wrongSound.play();
    setIsTipModalOpen(true);
  } else if (score >= 30 && score < 60) {
    wrongSound.play();
    setIsTipModalOpen(true);
  } else if (score >= 60 && score <= 100) {
    successSound.play();
    handleNext();
  }
};


export const createFeedbackPrompt = (question: string, subject: string): string => {
  return `you are an assistant going to give a feedback in Persian to the answer of ${question} in ${subject} subject based on best practices. FeedBack should be short and effiction and shouldn't be more than 300 charecters`;
};


export const createScoringPrompt = (question: string, subject: string): string => {
  return `You are an evaluator. Check how logically correct the answer to "${question}" is in the subject "${subject}". Return only a score from 0 (completely wrong) to 100 (fully correct)`;
};


export const createTipScoringPrompt = (adminSystemPrompt: string, question: string, answer: string): string => {
  return `Based on this tip: ${adminSystemPrompt} and this question: ${question} give me a score between 0 and 100 (0 is the worst and 100 is the best) for the answer: ${answer}. Be strict.`;
};
