import { configureStore } from '@reduxjs/toolkit'
import assetReducer from './assets'
import  sizeReducer from './video'

export const store = configureStore({
  reducer: {
    assets: assetReducer,
    videoData: sizeReducer,
  },
  devTools:true
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch