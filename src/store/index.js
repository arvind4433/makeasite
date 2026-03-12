import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../features/auth/authSlice';
import { AuthAPI } from '../services/authApi.js';
import { OrderAPI } from '../services/orderApi.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [AuthAPI.reducerPath]: AuthAPI.reducer,
    [OrderAPI.reducerPath]: OrderAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      AuthAPI.middleware,
      OrderAPI.middleware,
    ),
});

setupListeners(store.dispatch);

export default store;

