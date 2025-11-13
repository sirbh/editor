import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Asset interface (metadata + preview URL)
export interface Asset {
  id: string;       // <-- added unique id
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface SelectedAsset extends Asset {
   start: number
   end: number
   select_id:string
}
// Slice state type
interface AssetsState {
  assets: Asset[];
  selectedAssests: SelectedAsset[];
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

    selectAsset: (state, action: PayloadAction<Asset>) => {
      const original = action.payload;

      const selected: SelectedAsset = {
        ...original,
        select_id: generateId(),  // link back to the source asset
        start: 0,                 // default start
        end: 100000,                   // default end
      };

      state.selectedAssests.push(selected);
    },
    updateSelectedAssetRange: (
      state,
      action: PayloadAction<{ id: string; start: number; end: number }>
    ) => {
      const index = state.selectedAssests.findIndex(a => a.select_id === action.payload.id);
      if (index !== -1) {
        state.selectedAssests[index].start = action.payload.start;
        state.selectedAssests[index].end = action.payload.end;
      }
    },
  },
});

export const { addAsset, selectAsset, updateSelectedAssetRange } = assetSlice.actions;
export default assetSlice.reducer;
