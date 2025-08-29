import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import openai from "@/config/openAi";


interface AiState {
    userPrompt: string;
    systemPrompt: string;
    feedBack: string;
    score: number;
    tipScore: number;
    aiLoading: boolean;
    error: string | null;
    nextPageId: string | null;
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
}


export const getFeedBack = createAsyncThunk(
    'ai/getFeedBack',
    async ({question, answer, subject} : {question: string, answer: string, subject: string}) => {
        const response = await openai.chat.completions.create({
            model: "gpt-5-nano",
            messages: [
                {
                    role: "system",
                    content: `you are an assistant going to give a feedback in Persian to the answer of ${question} in ${subject} subject based on best practices. FeedBack should be short and effiction and shouldn't be more than 300 charecters`
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
                    content: `You are an evaluator. Check how logically correct the answer to "${question}" is in the subject "${subject}". Return only a score from 0 (completely wrong) to 100 (fully correct)`
                },
                {
                    role: "user",
                    content: `answer: ${answer}`
                }
            ],
        })
        const raw = response.choices[0].message?.content ?? '';

        const match = raw.match(/\d+(\.\d+)?/);
        const parsed = match ? Number(match[0]) : NaN;
        if (!Number.isFinite(parsed)) {
          throw new Error('Model did not return a numeric score');
        }

        const score = Math.max(0, Math.min(100, Math.round(parsed)));

        let nextPageId = null;
        if (score < 50) {
            nextPageId = lowScorePageId;
        } else {
            nextPageId = highScorePageId;
        }
        
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
                    content: `Based on this tip: ${adminSystemPrompt} and this question: ${question} give me a score between 0 and 100 (0 is the worst and 100 is the best) for the answer: ${answer}. Be extremely strict.`
                },
                {
                    role: "user",
                    content: `answer: ${answer}`
                }
            ],
        })
        const raw = response.choices[0].message?.content ?? '';
        const match = raw.match(/\d+(\.\d+)?/);
        const parsed = match ? Number(match[0]) : NaN;
        if (!Number.isFinite(parsed)) {
          throw new Error('Model did not return a numeric score');
        }
        if (parsed < 30) {
            wrongSound.play();
            setIsTipModalOpen(true);
        } else if (30 < parsed && parsed < 60) {
            wrongSound.play();
            setIsTipModalOpen(true);
        }  else if (60 < parsed && parsed < 100) {
            successSound.play();
            handleNext();
        }
        console.log("parsed", parsed);
        return parsed;
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
    },
})

export const { setUserPrompt, setSystemPrompt, clearAi } = aiSlice.actions;
export default aiSlice.reducer;