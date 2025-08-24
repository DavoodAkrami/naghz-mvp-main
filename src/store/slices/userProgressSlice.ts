import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '@/config/supabase';

interface UserProgress {
  id: string;
  user_id: string;
  course_id: string;
  completed_at: string;
}

interface UserProgressState {
  userProgress: UserProgress[];
  currentProgress: UserProgress | null;
  userProgressLoading: boolean;
  error: string | null;
}

const initialState: UserProgressState = {
  userProgress: [],
  currentProgress: null,
  userProgressLoading: false,
  error: null,
};

export const saveProgress = createAsyncThunk(
  'userProgress/saveProgress',
  async ({ courseId, userId }: { courseId: string; userId: string }) => {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        course_id: courseId,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
);

export const fetchUserProgress = createAsyncThunk(
  'userProgress/fetchUserProgress',
  async (userId: string) => {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  }
);

export const checkCourseCompletion = createAsyncThunk(
  'userProgress/checkCourseCompletion',
  async ({ courseId, userId }: { courseId: string; userId: string }) => {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }
);

const userProgressSlice = createSlice({
  name: 'userProgress',
  initialState,
  reducers: {
    setCurrentProgress: (state, action: PayloadAction<UserProgress>) => {
      state.currentProgress = action.payload;
    },
    clearCurrentProgress: (state) => {
      state.currentProgress = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetUserProgressState: (state) => {
      state.currentProgress = null;
      state.userProgress = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveProgress.pending, (state) => {
        state.userProgressLoading = true;
        state.error = null;
      })
      .addCase(saveProgress.fulfilled, (state, action) => {
        state.userProgressLoading = false;
        state.currentProgress = action.payload;
        // Add to userProgress array if not already present
        const existingIndex = state.userProgress.findIndex(
          progress => progress.course_id === action.payload.course_id
        );
        if (existingIndex === -1) {
          state.userProgress.push(action.payload);
        } else {
          state.userProgress[existingIndex] = action.payload;
        }
      })
      .addCase(saveProgress.rejected, (state, action) => {
        state.userProgressLoading = false;
        state.error = action.error.message || 'Failed to save progress';
      })
      .addCase(fetchUserProgress.pending, (state) => {
        state.userProgressLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProgress.fulfilled, (state, action) => {
        state.userProgressLoading = false;
        state.userProgress = action.payload;
      })
      .addCase(fetchUserProgress.rejected, (state, action) => {
        state.userProgressLoading = false;
        state.error = action.error.message || 'Failed to fetch user progress';
      })
      .addCase(checkCourseCompletion.pending, (state) => {
        state.userProgressLoading = true;
        state.error = null;
      })
      .addCase(checkCourseCompletion.fulfilled, (state, action) => {
        state.userProgressLoading = false;
        state.currentProgress = action.payload;
      })
      .addCase(checkCourseCompletion.rejected, (state, action) => {
        state.userProgressLoading = false;
        state.error = action.error.message || 'Failed to check course completion';
      });
  },
});

export const {
  setCurrentProgress,
  clearCurrentProgress,
  clearError,
  resetUserProgressState,
} = userProgressSlice.actions;

export default userProgressSlice.reducer;
