import { createSlice } from '@reduxjs/toolkit';

const getInitialUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('userInfo');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const initialState = {
  user: getInitialUser(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload;
    },
    clearCredentials: (state) => {
      state.user = null;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;

