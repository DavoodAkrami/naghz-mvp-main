import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '@/config/supabase';

export interface FullCourse {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon_name?: string;
  image?: string;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

interface FullCourseState {
  fullCourses: FullCourse[];
  currentFullCourse: FullCourse | null;
  fullCourseLoading: boolean;
  error: string | null;
}

const initialState: FullCourseState = {
  fullCourses: [],
  currentFullCourse: null,
  fullCourseLoading: false,
  error: null,
};

export const fetchFullCourses = createAsyncThunk(
  'fullCourse/fetchFullCourses',
  async () => {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('full_courses')
      .select('*')
      .eq('is_active', true)
      .order('order_index');
    
    if (error) throw error;
    return data || [];
  }
);

export const createFullCourse = createAsyncThunk(
  'fullCourse/createFullCourse',
  async (fullCourseData: Omit<FullCourse, 'id' | 'created_at' | 'updated_at'>) => {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('full_courses')
      .insert({
        ...fullCourseData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
);

export const updateFullCourse = createAsyncThunk(
  'fullCourse/updateFullCourse',
  async ({ id, updates }: { id: string; updates: Partial<Omit<FullCourse, 'id' | 'created_at' | 'updated_at'>> }) => {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('full_courses')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
);

export const deleteFullCourse = createAsyncThunk(
  'fullCourse/deleteFullCourse',
  async (id: string) => {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { error } = await supabase
      .from('full_courses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return id;
  }
);

export const uploadFullCourseImage = createAsyncThunk(
  'fullCourse/uploadFullCourseImage',
  async ({ fullCourseId, file }: {fullCourseId: string; file: File;}) => {
    if (!supabase) throw new Error('Supabase not configured');

    const bucket = 'full-course-images';
    const extension = file.name.split('.').pop() || 'jpg';
    const filePath = `courses/${fullCourseId}/${Date.now()}.${extension}`;

    const { error: uploadError } = await  supabase
      .storage
      .from(bucket)
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicData} = supabase
      .storage
      .from(bucket)
      .getPublicUrl(filePath);

    const publicUrl = publicData?.publicUrl || '';

    const { data, error } = await supabase
      .from('full_courses')
      .update({ image: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', fullCourseId)
      .select()
      .single();

    if (error) throw error;
    return { fullCourse: data, publicUrl };
  }
)

const fullCourseSlice = createSlice({
  name: 'fullCourse',
  initialState,
  reducers: {
    setCurrentFullCourse: (state, action: PayloadAction<FullCourse>) => {
      state.currentFullCourse = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetFullCourseState: (state) => {
      state.currentFullCourse = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFullCourses.pending, (state) => {
        state.fullCourseLoading = true;
        state.error = null;
      })
      .addCase(fetchFullCourses.fulfilled, (state, action) => {
        state.fullCourseLoading = false;
        state.fullCourses = action.payload;
      })
      .addCase(fetchFullCourses.rejected, (state, action) => {
        state.fullCourseLoading = false;
        state.error = action.error.message || 'Failed to fetch full courses';
      })
      .addCase(createFullCourse.pending, (state) => {
        state.fullCourseLoading = true;
        state.error = null;
      })
      .addCase(createFullCourse.fulfilled, (state, action) => {
        state.fullCourseLoading = false;
        state.fullCourses.push(action.payload);
      })
      .addCase(createFullCourse.rejected, (state, action) => {
        state.fullCourseLoading = false;
        state.error = action.error.message || 'Failed to create full course';
      })
      .addCase(updateFullCourse.pending, (state) => {
        state.fullCourseLoading = true;
        state.error = null;
      })
      .addCase(updateFullCourse.fulfilled, (state, action) => {
        state.fullCourseLoading = false;
        const updatedFullCourse = action.payload;
        const index = state.fullCourses.findIndex(fc => fc.id === updatedFullCourse.id);
        if (index !== -1) {
          state.fullCourses[index] = updatedFullCourse;
        }
      })
      .addCase(updateFullCourse.rejected, (state, action) => {
        state.fullCourseLoading = false;
        state.error = action.error.message || 'Failed to update full course';
      })
      .addCase(deleteFullCourse.pending, (state) => {
        state.fullCourseLoading = true;
        state.error = null;
      })
      .addCase(deleteFullCourse.fulfilled, (state, action) => {
        state.fullCourseLoading = false;
        state.fullCourses = state.fullCourses.filter(fc => fc.id !== action.payload);
      })
      .addCase(deleteFullCourse.rejected, (state, action) => {
        state.fullCourseLoading = false;
        state.error = action.error.message || 'Failed to delete full course';
      })
      .addCase(uploadFullCourseImage.pending, (state) => {
        state.fullCourseLoading = true;
        state.error = null;
      })
      .addCase(uploadFullCourseImage.fulfilled, (state, action) => {
        state.fullCourseLoading = false;
        const updated = action.payload.fullCourse;
        const index = state.fullCourses.findIndex(fc => fc.id === updated.id);
        if (index !== -1) {
          state.fullCourses[index] = updated;
        }
        if (state.currentFullCourse && state.currentFullCourse.id === updated.id) {
          state.currentFullCourse = updated;
        }
      })
      .addCase(uploadFullCourseImage.rejected, (state, action) => {
        state.fullCourseLoading = false;
        state.error = action.error.message || 'Failed to upload full course image';
      });
  },
});

export const {
  setCurrentFullCourse,
  clearError,
  resetFullCourseState,
} = fullCourseSlice.actions;

export default fullCourseSlice.reducer;
