import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '@/config/supabase';

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon_name?: string;
  is_active: boolean;
  order_index: number;
  full_course_id?: string;
  order_within_full_course?: number;
}

interface LearningState {
  courses: Course[];
  currentCourse: Course | null;
  courseloading: boolean;
  error: string | null;
}

const initialState: LearningState = {
  courses: [],
  currentCourse: null,
  courseloading: false,
  error: null,
};

export const fetchCourses = createAsyncThunk(
  'course/fetchCourses',
  async () => {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_active', true)
      .order('order_index');
    
    if (error) throw error;
    return data || [];
  }
);

export const fetchAllCourses = createAsyncThunk(
  'course/fetchAllCourses',
  async () => {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('order_index');
    
    if (error) throw error;
    return data || [];
  }
);

export const fetchCourseBySlug = createAsyncThunk(
  'course/fetchCourseBySlug',
  async (slug: string) => {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data;
  }
);

export const fetchCoursesByFullCourse = createAsyncThunk(
  'course/fetchCoursesByFullCourse',
  async (fullCourseId: string) => {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('full_course_id', fullCourseId)
      .eq('is_active', true)
      .order('order_within_full_course');
    
    if (error) throw error;
    return data || [];
  }
);

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    setCurrentCourse: (state, action: PayloadAction<Course>) => {
      state.currentCourse = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetCourseState: (state) => {
      state.currentCourse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.courseloading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.courseloading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.courseloading = false;
        state.error = action.error.message || 'Failed to fetch courses';
      })
      .addCase(fetchAllCourses.pending, (state) => {
        state.courseloading = true;
        state.error = null;
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.courseloading = false;
        state.courses = action.payload;
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.courseloading = false;
        state.error = action.error.message || 'Failed to fetch all courses';
      })
      .addCase(fetchCourseBySlug.pending, (state) => {
        state.courseloading = true;
        state.error = null;
      })
      .addCase(fetchCourseBySlug.fulfilled, (state, action) => {
        state.courseloading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseBySlug.rejected, (state, action) => {
        state.courseloading = false;
        state.error = action.error.message || 'Failed to fetch course';
      })
      .addCase(fetchCoursesByFullCourse.pending, (state) => {
        state.courseloading = true;
        state.error = null;
      })
      .addCase(fetchCoursesByFullCourse.fulfilled, (state, action) => {
        state.courseloading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCoursesByFullCourse.rejected, (state, action) => {
        state.courseloading = false;
        state.error = action.error.message || 'Failed to fetch courses by full course';
      });
  },
});

export const {
  setCurrentCourse,
  clearError,
  resetCourseState,
} = courseSlice.actions;

export default courseSlice.reducer;