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
}

type AnswerDict = {
  A: number;
  B: number;
}

interface CoursePage {
  id: string;
  course_id: string;
  page_number: number;
  page_type: 'text' | 'test';
  title?: string;
  content?: string;
  question?: string;
  test_type?: 'Default' | 'Multiple' | 'Sequential' | 'Pluggable';
  test_grid?: 'col' | 'grid-2' | 'grid-row';
  correct_answer?: number[] | number | AnswerDict;
  page_length: number;
  order_index: number;
  why?: string;
  image?: string; 
}

interface PageOption {
  id: string;
  page_id: string;
  option_text: string;
  option_order: number;
  is_correct: boolean;
  icon_name?: string;
}

interface UserProgress {
  id: string;
  user_id: string;
  course_id: string;
  current_page: number;
  completed_pages: number[];
  // TODO: Replace 'unknown' with a specific type for test_results if possible
  test_results: unknown;
  started_at: string;
  last_accessed: string;
  completed_at?: string;
}

interface TestAttempt {
  id: string;
  user_id: string;
  page_id: string;
  // TODO: Replace 'unknown' with a specific type for user_answers if possible
  user_answers: unknown;
  score: number;
  is_correct: boolean;
  time_taken: number;
  attempted_at: string;
}

interface TestResult {
  isCorrect: boolean;
  correctAnswers: number[];
  explanation: string;
  // TODO: Replace 'unknown' with a specific type for userAnswers if possible
  userAnswers: unknown;
}

interface LearningState {
  courses: Course[];
  currentCourse: Course | null;
  currentPage: CoursePage | null;
  pageOptions: PageOption[];
  userProgress: UserProgress[];
  currentProgress: UserProgress | null;
  testAttempts: TestAttempt[];
  // TODO: Replace 'unknown' with a specific type for currentTestAnswers if possible
  currentTestAnswers: unknown;
  testResult: TestResult | null;
  loading: boolean;
  error: string | null;
  currentPageNumber: number;
  totalPages: number;
  showTestResult: boolean;
}

const initialState: LearningState = {
  courses: [],
  currentCourse: null,
  currentPage: null,
  pageOptions: [],
  userProgress: [],
  currentProgress: null,
  testAttempts: [],
  currentTestAnswers: {},
  testResult: null,
  loading: false,
  error: null,
  currentPageNumber: 1,
  totalPages: 1,
  showTestResult: false,
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

export const fetchCoursePages = createAsyncThunk(
  'course/fetchCoursePages',
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
  'course/fetchPage',
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
  'course/fetchPageOptions',
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

export const saveProgress = createAsyncThunk(
  'course/saveProgress',
  async ({ courseId, pageNumber, testAnswers }: { courseId: string; pageNumber: number; testAnswers?: unknown }) => {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        course_id: courseId,
        current_page: pageNumber,
        completed_pages: [pageNumber],
        test_results: testAnswers || {},
        last_accessed: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
);

export const submitTest = createAsyncThunk(
  'course/submitTest',
  async ({ pageId, answers, timeTaken }: { pageId: string; answers: unknown; timeTaken: number }) => {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('test_attempts')
      .insert({
        page_id: pageId,
        user_answers: answers,
        time_taken: timeTaken,
        attempted_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
);

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    setCurrentCourse: (state, action: PayloadAction<Course>) => {
      state.currentCourse = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPageNumber = action.payload;
    },
    setTestAnswer: (state, action: PayloadAction<{ questionId: string; answer: any }>) => {
      // Type assertion for currentTestAnswers as Record<string, unknown>
      (state.currentTestAnswers as Record<string, unknown>)[action.payload.questionId] = action.payload.answer;
    },
    clearTestAnswers: (state) => {
      state.currentTestAnswers = {};
    },
    setTestResult: (state, action: PayloadAction<TestResult>) => {
      state.testResult = action.payload;
      state.showTestResult = true;
    },
    hideTestResult: (state) => {
      state.showTestResult = false;
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
    resetCourseState: (state) => {
      state.currentCourse = null;
      state.currentPage = null;
      state.pageOptions = [];
      state.currentProgress = null;
      state.currentTestAnswers = {};
      state.testResult = null;
      state.showTestResult = false;
      state.currentPageNumber = 1;
      state.totalPages = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch courses';
      })
      .addCase(fetchCourseBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch course';
      })
      .addCase(fetchCoursePages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoursePages.fulfilled, (state, action) => {
        state.loading = false;
        state.totalPages = action.payload.length;
      })
      .addCase(fetchCoursePages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch course pages';
      })
      .addCase(fetchPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPage.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPage = action.payload;
      })
      .addCase(fetchPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch page';
      })
      .addCase(fetchPageOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPageOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.pageOptions = action.payload;
      })
      .addCase(fetchPageOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch page options';
      })
      .addCase(saveProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProgress = action.payload;
      })
      .addCase(saveProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to save progress';
      })
      .addCase(submitTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitTest.fulfilled, (state, action) => {
        state.loading = false;
        const result = action.payload;
        state.testResult = {
          isCorrect: result.is_correct,
          correctAnswers: result.correct_answers || [],
          explanation: result.explanation || '',
          // TODO: Replace 'unknown' with a specific type for userAnswers if possible
          userAnswers: state.currentTestAnswers,
        };
        state.showTestResult = true;
        state.testAttempts.push(result);
      })
      .addCase(submitTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to submit test';
      });
  },
});

export const {
  setCurrentCourse,
  setCurrentPage,
  setTestAnswer,
  clearTestAnswers,
  setTestResult,
  hideTestResult,
  goToNextPage,
  goToPreviousPage,
  goToPage,
  clearError,
  resetCourseState,
} = courseSlice.actions;

export default courseSlice.reducer;