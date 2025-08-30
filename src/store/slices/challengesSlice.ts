import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/config/supabase";

interface challengesArray {
    id: string;
    prompt: string;
    question: string;
    course_id: string;
    date: Date;
}

interface challengesProp {
    challenges: challengesArray[],
    challengesLoading: boolean,
    error: string | null;
}

const initialState: challengesProp = {
    challenges: [] as challengesArray[],
    challengesLoading: false,
    error: null as string | null,
}


export const fetchTodaysChallenge = createAsyncThunk(
    'challenge/fetchTodaysChallenge',
    async () => {
        if (!supabase) throw new Error('Supabase not configured');

        const { data, error} = await supabase 
        .from('challenges')
        .select('*')
        .eq('date', new Date().toISOString().split('T')[0])

        if (error) throw error;
        return data || [];
    }
)

export const addNewChallenge = createAsyncThunk(
    'challenge/addNewChallenge',
    async (challenge: Omit<challengesArray, 'id'>) => {
        if (!supabase) throw new Error('Supabase not configured');
        
        const { data, error } = await supabase
            .from('challenges')
            .insert(challenge)
            .select();
            
        if (error) throw error;
        return data?.[0] || challenge;
    }
)

export const editChallenge = createAsyncThunk(
    'challenge/editChallenge',
    async ({ id, updates }: { id: string; updates: Partial<challengesArray> }) => {
        if (!supabase) throw new Error('Supabase not configured');

        const { data, error } = await supabase
            .from('challenges')
            .update(updates)
            .eq('id', id)
            .select();
            
        if (error) throw error;
        return data?.[0];
    }
)

export const deleteChallenge = createAsyncThunk(
    'challenge/deleteChallenge',
    async (challengeId: string) => {
        if (!supabase) throw new Error('Supabase not configured');
        
        const { error } = await supabase
            .from('challenges')
            .delete()
            .eq('id', challengeId);
            
        if (error) throw error;
        return challengeId;
    }
)



const challengesSlice = createSlice({
    name: "challengesSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodaysChallenge.pending, (state) => {
                state.challengesLoading = true;
                state.error = null;
            })
            .addCase(fetchTodaysChallenge.fulfilled, (state, action) => {
                state.challengesLoading = false;
                state.challenges = action.payload;
            })
            .addCase(fetchTodaysChallenge.rejected, (state, action) => {
                state.challengesLoading = false;
                state.error = action.error.message || 'Failed to fetch challenges';
            })
            .addCase(addNewChallenge.pending, (state) => {
                state.challengesLoading = true;
                state.error = null;
            })
            .addCase(addNewChallenge.fulfilled, (state, action) => {
                state.challengesLoading = false;
                state.challenges.push(action.payload);
            })
            .addCase(addNewChallenge.rejected, (state, action) => {
                state.challengesLoading = false;
                state.error = action.error.message || 'Failed to add challenge';
            })
            .addCase(editChallenge.pending, (state) => {
                state.challengesLoading = true;
                state.error = null;
            })
            .addCase(editChallenge.fulfilled, (state, action) => {
                state.challengesLoading = false;
                const index = state.challenges.findIndex(c => c.id === action.payload.id);
                if (index !== -1) {
                    state.challenges[index] = action.payload;
                }
            })
            .addCase(editChallenge.rejected, (state, action) => {
                state.challengesLoading = false;
                state.error = action.error.message || 'Failed to edit challenge';
            })
            .addCase(deleteChallenge.pending, (state) => {
                state.challengesLoading = true;
                state.error = null;
            })
            .addCase(deleteChallenge.fulfilled, (state, action) => {
                state.challengesLoading = false;
                state.challenges = state.challenges.filter(c => c.id !== action.payload);
            })
            .addCase(deleteChallenge.rejected, (state, action) => {
                state.challengesLoading = false;
                state.error = action.error.message || 'Failed to delete challenge';
            });
    }
})



export const { } = challengesSlice.actions;

export default challengesSlice.reducer;
