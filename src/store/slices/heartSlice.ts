import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/config/supabase";


export interface user_hearts {
    user_id: string;
    hearts: number;
    hearts_updated_at: string; 
}

interface HeartsSliceState extends user_hearts {
    heartsLoading: boolean;
    error: string | null;
}

const inisialStates: HeartsSliceState = {
    user_id: "",
    hearts: 3,
    hearts_updated_at: "",
    heartsLoading: false,
    error: null,
}




export const fetchAndRefillHearts = createAsyncThunk(
    'hearts/fetchAndRefillHearts',
    async (userId: string, { rejectWithValue }) => {
      try {
        if (!supabase) throw new Error('Supabase not configured');
  
        const { data, error } = await supabase
          .rpc('refill_hearts', { user_uuid: userId }); 
  
        if (error) throw error;
  
        return data[0]; 
      } catch (err: any) {
        return rejectWithValue(err?.message || 'failed_to_refill_hearts');
      }
    }
);

export const reduceHeart = createAsyncThunk(
    'hearts/reduceHeart',
    async (userId: string, { rejectWithValue }) => {
        try {
            if (!supabase) throw new Error('Supabase not configured');

            const { data: existing, error: sel1Err } = await supabase
                .from('user_hearts')
                .select('user_id, hearts, hearts_updated_at')
                .eq('user_id', userId)
                .maybeSingle();
            if (sel1Err) throw sel1Err;
            if (!existing) {
                const { error: insErr } = await supabase
                    .from('user_hearts')
                    .insert({ user_id: userId });
                if (insErr) throw insErr;
            }

            const { data: current, error: selErr } = await supabase
                .from('user_hearts')
                .select('hearts')
                .eq('user_id', userId)
                .single();
            if (selErr) throw selErr;

            const currentHearts = typeof current?.hearts === 'number' ? current.hearts : 3;
            const newHearts = Math.max(0, currentHearts - 1);
            const nowIso = new Date().toISOString();

            const { data: updated, error: updErr } = await supabase
                .from('user_hearts')
                .update({ hearts: newHearts, hearts_updated_at: nowIso })
                .eq('user_id', userId)
                .select('user_id, hearts, hearts_updated_at')
                .single();
            if (updErr) throw updErr;

            return updated as user_hearts;
        } catch (err: any) {
            return rejectWithValue(err?.message || 'failed_to_reduce_heart');
        }
    }
);

export const addHeart = createAsyncThunk(
    'hearts/addHeart',
    async (userId: string, { rejectWithValue }) => {
        try {
            if (!supabase) throw new Error('Supabase not configured');


            const { data: existing, error: sel1Err } = await supabase
                .from('user_hearts')
                .select('user_id, hearts, hearts_updated_at')
                .eq('user_id', userId)
                .maybeSingle();
            if (sel1Err) throw sel1Err;
            if (!existing) {
                const { error: insErr } = await supabase
                    .from('user_hearts')
                    .insert({ user_id: userId });
                if (insErr) throw insErr;
            }

            const { data: current, error: selErr } = await supabase
                .from('user_hearts')
                .select('hearts')
                .eq('user_id', userId)
                .single();
            if (selErr) throw selErr;

            const currentHearts = typeof current?.hearts === 'number' ? current.hearts : 3;
            const newHearts = Math.min(3, currentHearts + 1);
            const nowIso = new Date().toISOString();

            const { data: updated, error: updErr } = await supabase
                .from('user_hearts')
                .update({ hearts: newHearts, hearts_updated_at: nowIso })
                .eq('user_id', userId)
                .select('user_id, hearts, hearts_updated_at')
                .single();
            if (updErr) throw updErr;

            return updated as user_hearts;
        } catch (err: any) {
            return rejectWithValue(err?.message || 'failed_to_add_heart');
        }
    }
);


export const fetchUserHearts = createAsyncThunk(
    'hearts/fetchUserHearts',
    async (userId: string, { rejectWithValue }) => {
        try {
            if (!supabase) throw new Error('Supabase not configured');

            const { data, error } = await supabase
                .from('user_hearts')
                .select('user_id, hearts, hearts_updated_at')
                .eq('user_id', userId)
                .maybeSingle();
            if (error) throw error;

            if (!data) {
                return { user_id: userId, hearts: 3, hearts_updated_at: '' } as user_hearts;
            }
            return data as user_hearts;
        }
        catch (err: any) {
            return rejectWithValue(err?.message || 'failed_to_fetch_hearts');
        }
    } 
)

const heartSlice = createSlice({
    name: 'hearts',
    initialState: inisialStates,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserHearts.pending, (state) => {
                state.heartsLoading = true;
                state.error = null;
            })
            .addCase(fetchUserHearts.fulfilled, (state, action) => {
                state.user_id = action.payload.user_id;
                state.hearts = action.payload.hearts;
                state.hearts_updated_at = action.payload.hearts_updated_at;
                state.heartsLoading = false;
            })
            .addCase(fetchUserHearts.rejected, (state, action) => {
                state.heartsLoading = false;
                state.error = (action.payload as string) || 'failed_to_fetch_hearts';
            })
            .addCase(fetchAndRefillHearts.pending, (state) => {
                state.heartsLoading = true;
                state.error = null;
            })
            .addCase(fetchAndRefillHearts.fulfilled, (state, action: any) => {
                if (action.payload) {
                    state.user_id = action.payload.user_id ?? state.user_id;
                    state.hearts = typeof action.payload.hearts === 'number' ? action.payload.hearts : state.hearts;
                    state.hearts_updated_at = action.payload.hearts_updated_at ?? state.hearts_updated_at;
                }
                state.heartsLoading = false;
            })
            .addCase(fetchAndRefillHearts.rejected, (state, action) => {
                state.heartsLoading = false;
                state.error = (action.payload as string) || 'failed_to_refill_hearts';
            })
            .addCase(reduceHeart.pending, (state) => {
                state.heartsLoading = true;
                state.error = null;
            })
            .addCase(reduceHeart.fulfilled, (state, action) => {
                state.user_id = action.payload.user_id;
                state.hearts = action.payload.hearts;
                state.hearts_updated_at = action.payload.hearts_updated_at;
                state.heartsLoading = false;
            })
            .addCase(reduceHeart.rejected, (state, action) => {
                state.heartsLoading = false;
                state.error = (action.payload as string) || 'failed_to_reduce_heart';
            })
            .addCase(addHeart.pending, (state) => {
                state.heartsLoading = true;
                state.error = null;
            })
            .addCase(addHeart.fulfilled, (state, action) => {
                state.user_id = action.payload.user_id;
                state.hearts = action.payload.hearts;
                state.hearts_updated_at = action.payload.hearts_updated_at;
                state.heartsLoading = false;
            })
            .addCase(addHeart.rejected, (state, action) => {
                state.heartsLoading = false;
                state.error = (action.payload as string) || 'failed_to_add_heart';
            });
    },
});

export default heartSlice.reducer;