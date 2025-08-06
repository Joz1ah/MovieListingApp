// Fixed store/authSlice.ts - Proper async handling

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { clearStoredToken } from '../utils/auth';
import { AuthState, User } from '../utils/types';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = false;
      // Clear stored token asynchronously
      clearStoredToken().catch(console.error);
    },
    loadStoredAuth: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = true;
      state.token = action.payload;
      state.loading = false;
      state.error = null;
      // Set a mock user for stored token
      state.user = {
        id: '1',
        email: 'user@example.com',
        name: 'Test User'
      };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  loadStoredAuth, 
  clearError 
} = authSlice.actions;

export default authSlice.reducer;