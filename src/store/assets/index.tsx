import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Asset interface (metadata + preview URL)
export interface Asset {
  id: string;       // <-- added unique id
  name: string;
  size: number;
  type: string;
  url: string;
}

// Slice state type
interface AssetsState {
  assets: Asset[];
  selectedAssests: Asset[];
}

const initialState: AssetsState = {
  assets: [],
  selectedAssests: []
};

// Utility to generate a unique id (simple UUID-like)
const generateId = () => crypto.randomUUID?.() || Math.random().toString(36).substring(2, 9);

export const assetSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    addAsset: (state, action: PayloadAction<Omit<Asset, 'id'>[]>) => {
      const newAssets = action.payload.map(asset => ({
        ...asset,
        id: generateId(), // assign unique id here
      }));
      state.assets = [...state.assets, ...newAssets];
    },

    selectAsset: (state,action:PayloadAction<Asset>) => {
       state.selectedAssests = [...state.selectedAssests, action.payload]
    }
  },
});

export const { addAsset, selectAsset } = assetSlice.actions;
export default assetSlice.reducer;
