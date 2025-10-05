import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Asset interface (metadata + preview URL)
export interface Asset {
  name: string;
  size: number;
  type: string;
  url: string;
}

// Slice state type
interface AssetsState {
  assets: Asset[];
}

// Correct initial state
const initialState: AssetsState = {
  assets: [],
};

export const assetSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    addAsset: (state, action: PayloadAction<Asset[]>) => {
      state.assets = [...state.assets, ...action.payload];
    },
  },
});

export const { addAsset } = assetSlice.actions;

export default assetSlice.reducer;
