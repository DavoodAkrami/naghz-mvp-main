import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from '@/config/supabase';


interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

interface User {
    id: string;
    email?: string;
    user_metadata?: {
        full_name?: string;
        role?: string;
        created_at?: string;
    };
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
}


export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        try {
            if (!supabase) {
                return rejectWithValue('Supabase client not initialized');
            }
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            return data.user;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            return rejectWithValue(errorMessage);
        }
    }
);


export const signupUser = createAsyncThunk(
    'auth/signupUser',
    async (signupData: { email: string; password: string; full_name?: string }, { rejectWithValue }) => {
      try {
        if (!supabase) {
          return rejectWithValue('Supabase client not initialized');
        }
        const { email, password, full_name } = signupData;
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: full_name || email.split('@')[0], 
              role: 'user', 
              created_at: new Date().toISOString(),
            }
          }
        });
        
        if (error) throw error;
        return data.user;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        return rejectWithValue(errorMessage);
      }
    }
);


export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { rejectWithValue }) => {
        try {
            if (!supabase) {
                return rejectWithValue('Supabase client not initialized');
            }
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            return null;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            return rejectWithValue(errorMessage);
        }
    }
);

// Check current auth status
export const checkAuthStatus = createAsyncThunk(
    'auth/checkAuthStatus',
    async (_, { rejectWithValue }) => {
      try {
        if (!supabase) {
          return rejectWithValue('Supabase client not initialized');
        }
        const { data, error } = await supabase.auth.getUser();
  
        if (error || !data.user) {
          return rejectWithValue(error?.message || "No authenticated user");
        }
  
        return data.user;
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        return rejectWithValue(errorMessage);
      }
    }
);


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state: AuthState) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
        
        // Signup
        builder
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
        
        // Logout
        builder
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false;
                state.error = null;
            })
        
        // Check auth status
        builder
            .addCase(checkAuthStatus.fulfilled, (state, action) => {
                if (action.payload) {
                    state.user = action.payload;
                    state.isAuthenticated = true;
                }
                state.loading = false;
            })
            .addCase(checkAuthStatus.rejected, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false;
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;