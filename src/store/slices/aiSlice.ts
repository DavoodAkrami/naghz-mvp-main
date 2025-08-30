import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import openai from "@/config/openAi";
import { parseAIScore, getNextPageId, evaluateTipScore, createFeedbackPrompt, createScoringPrompt, createTipScoringPrompt } from "@/utils/aiHelpers";


interface AiState {
    userPrompt: string;
    systemPrompt: string;
    feedBack: string;
    score: number;
    tipScore: number;
    aiLoading: boolean;
    error: string | null;
    nextPageId: string | null;
    challengeFeedBack: string;
}

const initialState: AiState = {
    userPrompt: "",
    systemPrompt: "",
    feedBack: "",
    score: 0,
    tipScore: 0,
    aiLoading: false,
    error: null,
    nextPageId: null,
    challengeFeedBack: "",
}


export const getFeedBack = createAsyncThunk(
    'ai/getFeedBack',
    async ({question, answer, subject} : {question: string, answer: string, subject: string}) => {
        const response = await openai.chat.completions.create({
            model: "gpt-5-nano",
            messages: [
                {
                    role: "system",
                    content: createFeedbackPrompt(question, subject)
                },
                {
                    role: "user",
                    content: `answer: ${answer}`
                }
            ],
        })
        return response.choices[0].message?.content ?? "";
    }
)

export const getPoint = createAsyncThunk(
    'ai/getPoint',
    async ({question, answer, subject, lowScorePageId, highScorePageId} : {question: string, answer: string, subject: string, lowScorePageId?: string | null, highScorePageId?: string | null}) => {
        const response = await openai.chat.completions.create({
            model: "gpt-5-nano",
            messages: [
                {
                    role: "system",
                    content: createScoringPrompt(question, subject)
                },
                {
                    role: "user",
                    content: `answer: ${answer}`
                }
            ],
        })
        const raw = response.choices[0].message?.content ?? '';
        const score = parseAIScore(raw);
        const nextPageId = getNextPageId(score, lowScorePageId, highScorePageId, 50);
        
        console.log("score", score);
        console.log("nextPageId", nextPageId);
        
        return { score, nextPageId }; 
    }
)

export const getPointFroTip = createAsyncThunk(
    'ai/getPointFroTip',
    async ({adminSystemPrompt, answer, question, setIsTipModalOpen, pulseTip, handleNext, wrongSound, successSound} : {adminSystemPrompt: string, answer: string, question: string, setIsTipModalOpen: (isOpen: boolean) => void, pulseTip: () => void, handleNext: () => void, wrongSound: HTMLAudioElement, successSound: HTMLAudioElement}) => {
        const response = await openai.chat.completions.create({
            model: "gpt-5-nano",
            messages: [
                {
                    role: "system",
                    content: createTipScoringPrompt(adminSystemPrompt, question, answer)
                },
                {
                    role: "user",
                    content: `answer: ${answer}`
                }
            ],
        })
        const raw = response.choices[0].message?.content ?? '';
        const score = parseAIScore(raw);
        evaluateTipScore(score, setIsTipModalOpen, pulseTip, handleNext, wrongSound, successSound);
        console.log("parsed", score);
        return score;
    }
)


export const challengeAi = createAsyncThunk(
    'ai/challengeAi',
    async ({question, prompt, answer} : {question: string, prompt: string, answer: string}) => {
        const response = await openai.chat.completions.create({
            model: "gpt-5-nano",
            messages: [
                {
                    role: "system",
                    content: `Based on this question: ${question} and this solving guidline: ${prompt}, in Persian give a feedBack to user's answer, feedback should be between 150 to 300 charecter. `
                },
                {
                    role: "user",
                    content: `Answer: ${answer}`
                }
            ],
        })
        return response.choices[0].message?.content ?? "";
    }
)


const aiSlice = createSlice({
    name: "ai",
    initialState,
    reducers: {
        setUserPrompt: (state, action) => {
            state.userPrompt = action.payload;
        },
        setSystemPrompt: (state, action) => {
            state.systemPrompt = action.payload;
        },
        clearAi: (state) => { state.feedBack = ""; state.score = 0; state.tipScore = 0; state.aiLoading = false; state.error = null; },
    },
    extraReducers(builder) {
        builder
            .addCase(getFeedBack.pending, (state) => {
                state.aiLoading = true;
            })
            .addCase(getFeedBack.fulfilled, (state, action) => {
                state.aiLoading = false;
                state.feedBack = action.payload;
            })
            .addCase(getFeedBack.rejected, (state, action) => {
                state.aiLoading = false;
                state.error = action.error.message ?? "خطا در گرفتن فیدبک";
            })
            .addCase(getPoint.pending, (state) => {
                state.aiLoading = true;
            })
            .addCase(getPoint.fulfilled, (state, action) => {
                state.aiLoading = false;
                state.score = action.payload.score;
                state.nextPageId = action.payload.nextPageId || null;
            })
            .addCase(getPoint.rejected, (state, action) => {
                state.aiLoading = false;
                state.error = action.error.message ?? "خطا در گرفتن نمره";
            })
            .addCase(getPointFroTip.pending, (state) => {
                state.aiLoading = true;
            })
            .addCase(getPointFroTip.fulfilled, (state, action) => {
                state.aiLoading = false;
                state.tipScore = action.payload;
            })
            .addCase(getPointFroTip.rejected, (state, action) => {
                state.aiLoading = false;
                state.error = action.error.message ?? "خطا در گرفتن نمره";
            })
            .addCase(challengeAi.pending, (state) => {
                state.aiLoading = true;
            })
            .addCase(challengeAi.fulfilled, (state, action) => {
                state.aiLoading = false;
                state.challengeFeedBack = action.payload;
            })
            .addCase(challengeAi.rejected, (state, action) => {
                state.aiLoading = false;
                state.error = action.error.message ?? "خطا در گرفتن فیدبک";
            })
    },
})

export const { setUserPrompt, setSystemPrompt, clearAi } = aiSlice.actions;
export default aiSlice.reducer;