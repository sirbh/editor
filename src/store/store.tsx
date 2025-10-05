import { configureStore } from '@reduxjs/toolkit'
import assetReducer from './assets'

export const store = configureStore({
  reducer: {
    assets: assetReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch