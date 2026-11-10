import { configureStore } from '@reduxjs/toolkit'
import { ainaApi } from '@/api/ainaApi'
import { authReducer } from '@/features/auth/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [ainaApi.reducerPath]: ainaApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ainaApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
