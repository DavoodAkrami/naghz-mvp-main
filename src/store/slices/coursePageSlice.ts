import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '@/config/supabase';

export interface CoursePage {
  id: string;
  course_id: string;
  page_number: number;
  page_type: 'text' | 'test' | 'testNext';
  title?: string;
  content?: string;
  question?: string;
  test_type?: 'Default' | 'Multiple' | 'Sequential' | 'Pluggable' | 'Input';
  test_grid?: 'col' | 'grid-2' | 'grid-row';
  correct_answer?: number[] | number;
  page_length: number;
  order_index: number;
  why?: string;
  image?: string; 
  feedback_by_ai?: string | null;
  point_by_ai?: number | null;
  ai_enabled?: boolean;
  give_feedback?: boolean;
  give_point?: boolean;
  score_threshold?: number;
  low_score_page_id?: string | null;
  high_score_page_id?: string | null;
}

export interface PageOption {
  id: string;
  page_id: string;
  option_text: string;
  option_order: number;
  is_correct: boolean;
  icon_name?: string;
}

interface CoursePageState {
  pages: CoursePage[];
  currentPage: CoursePage | null;
  pageOptions: PageOption[];
  coursePageLoading: boolean;
  error: string | null;
  currentPageNumber: number;
  totalPages: number;
}

const initialState: CoursePageState = {
  pages: [],
  currentPage: null,
  pageOptions: [],
  coursePageLoading: false,
  error: null,
  currentPageNumber: 1,
  totalPages: 1,
};

export const fetchCoursePages = createAsyncThunk(
  'coursePage/fetchCoursePages',
  async (courseId: string) => {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('course_pages')
      .select('*')
      .eq('course_id', courseId)
      .order('page_number');
    
    if (error) throw error;
    return data || [];
  }
);

export const fetchPage = createAsyncThunk(
  'coursePage/fetchPage',
  async ({ courseId, pageNumber }: { courseId: string; pageNumber: number }) => {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('course_pages')
      .select('*')
      .eq('course_id', courseId)
      .eq('page_number', pageNumber)
      .single();
    
    if (error) throw error;
    return data;
  }
);

export const fetchPageOptions = createAsyncThunk(
  'coursePage/fetchPageOptions',
  async (pageId: string) => {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('page_options')
      .select('*')
      .eq('page_id', pageId)
      .order('option_order');
    
    if (error) throw error;
    return data || [];
  }
);

export const uploadPageImage = createAsyncThunk(
  'coursePage/uploadPageImage',
  async ({ pageId, file }: { pageId: string; file: File }) => {
    if (!supabase) throw new Error('Supabase not configured');

    const bucket = 'course-page-images';
    const extension = file.name.split('.').pop() || 'jpg';
    const filePath = `pages/${pageId}/${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase
      .storage
      .from(bucket)
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (uploadError) throw uploadError;

    const { data: publicData } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(filePath);

    const publicUrl = publicData?.publicUrl || '';

    const { data, error } = await supabase
      .from('course_pages')
      .update({ image: publicUrl })
      .eq('id', pageId)
      .select()
      .single();

    if (error) throw error;
    return { page: data, publicUrl };
  }
);

const coursePageSlice = createSlice({
  name: 'coursePage',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPageNumber = action.payload;
    },
    goToNextPage: (state) => {
      if (state.currentPageNumber < state.totalPages) {
        state.currentPageNumber += 1;
      }
    },
    goToPreviousPage: (state) => {
      if (state.currentPageNumber > 1) {
        state.currentPageNumber -= 1;
      }
    },
    goToPage: (state, action: PayloadAction<number>) => {
      state.currentPageNumber = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetPageState: (state) => {
      state.currentPage = null;
      state.pageOptions = [];
      state.currentPageNumber = 1;
      state.totalPages = 1;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoursePages.pending, (state) => {
        state.coursePageLoading = true;
        state.error = null;
      })
      .addCase(fetchCoursePages.fulfilled, (state, action) => {
        state.coursePageLoading = false;
        state.totalPages = action.payload.length;
      })
      .addCase(fetchCoursePages.rejected, (state, action) => {
        state.coursePageLoading = false;
        state.error = action.error.message || 'Failed to fetch course pages';
      })
      .addCase(fetchPage.pending, (state) => {
        state.coursePageLoading = true;
        state.error = null;
      })
      .addCase(fetchPage.fulfilled, (state, action) => {
        state.coursePageLoading = false;
        state.currentPage = action.payload;
      })
      .addCase(fetchPage.rejected, (state, action) => {
        state.coursePageLoading = false;
        state.error = action.error.message || 'Failed to fetch page';
      })
      .addCase(fetchPageOptions.pending, (state) => {
        state.coursePageLoading = true;
        state.error = null;
      })
      .addCase(fetchPageOptions.fulfilled, (state, action) => {
        state.coursePageLoading = false;
        state.pageOptions = action.payload;
      })
      .addCase(fetchPageOptions.rejected, (state, action) => {
        state.coursePageLoading = false;
        state.error = action.error.message || 'Failed to fetch page options';
      })
      .addCase(uploadPageImage.pending, (state) => {
        state.coursePageLoading = true;
        state.error = null;
      })
      .addCase(uploadPageImage.fulfilled, (state, action) => {
        state.coursePageLoading = false;
        if (state.currentPage && state.currentPage.id === action.payload.page.id) {
          state.currentPage = action.payload.page;
        }
      })
      .addCase(uploadPageImage.rejected, (state, action) => {
        state.coursePageLoading = false;
        state.error = action.error.message || 'Failed to upload page image';
      });
  },
});

export const {
  setCurrentPage,
  goToNextPage,
  goToPreviousPage,
  goToPage,
  clearError,
  resetPageState,
} = coursePageSlice.actions;

export default coursePageSlice.reducer;
