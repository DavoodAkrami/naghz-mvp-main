import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from '@/config/supabase';


interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    logOutLoading: boolean;
    error: string | null;
    users: AdminUser[];
    usersLoading: boolean;
    usersError: string | null;
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

export interface AdminUser {
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
    loading: true,
    logOutLoading: false,
    error: null,
    users: [],
    usersLoading: false,
    usersError: null,
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

// Admin: fetch all users
export const fetchAllUsers = createAsyncThunk(
    'auth/fetchAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            if (!supabase) {
                return rejectWithValue('Supabase client not initialized');
            }
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !sessionData.session) {
                return rejectWithValue(sessionError?.message || 'No active session');
            }
            const token = sessionData.session.access_token;
            const res = await fetch('/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const json = await res.json();
            if (!res.ok) {
                return rejectWithValue(json.error || 'Failed to fetch users');
            }
            return json.users as AdminUser[];
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            return rejectWithValue(errorMessage);
        }
    }
);

// Admin: update user role
export const updateUserRole = createAsyncThunk(
    'auth/updateUserRole',
    async (payload: { userId: string; role: 'admin' | 'user' }, { rejectWithValue }) => {
        try {
            if (!supabase) {
                return rejectWithValue('Supabase client not initialized');
            }
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !sessionData.session) {
                return rejectWithValue(sessionError?.message || 'No active session');
            }
            const token = sessionData.session.access_token;
            const res = await fetch(`/api/admin/users/${payload.userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ role: payload.role }),
            });
            const json = await res.json();
            if (!res.ok) {
                return rejectWithValue(json.error || 'Failed to update role');
            }
            return json.user as AdminUser;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            return rejectWithValue(errorMessage);
        }
    }
);

// Admin: delete user
export const deleteUserById = createAsyncThunk(
    'auth/deleteUserById',
    async (userId: string, { rejectWithValue }) => {
        try {
            if (!supabase) {
                return rejectWithValue('Supabase client not initialized');
            }
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !sessionData.session) {
                return rejectWithValue(sessionError?.message || 'No active session');
            }
            const token = sessionData.session.access_token;
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            const json = await res.json();
            if (!res.ok) {
                return rejectWithValue(json.error || 'Failed to delete user');
            }
            return userId;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
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
            .addCase(logoutUser.pending, (state) => {
                state.logOutLoading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.logOutLoading = false;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.logOutLoading = false;
                state.error = action.payload as string;
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
            })
            // Admin users
            .addCase(fetchAllUsers.pending, (state) => {
                state.usersLoading = true;
                state.usersError = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.usersLoading = false;
                state.users = action.payload as AdminUser[];
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.usersLoading = false;
                state.usersError = action.payload as string;
            })
            .addCase(updateUserRole.fulfilled, (state, action) => {
                const updated = action.payload as AdminUser;
                state.users = state.users.map((u) => (u.id === updated.id ? { ...u, user_metadata: { ...u.user_metadata, ...updated.user_metadata } } : u));
                // If current user updated, reflect role change locally as well
                if (state.user?.id === updated.id) {
                    state.user = { ...state.user, user_metadata: { ...state.user.user_metadata, ...updated.user_metadata } } as User;
                }
            })
            .addCase(deleteUserById.fulfilled, (state, action) => {
                const removedId = action.payload as string;
                state.users = state.users.filter((u) => u.id !== removedId);
                if (state.user?.id === removedId) {
                    state.user = null;
                    state.isAuthenticated = false;
                }
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;