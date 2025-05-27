// store/slices/favoritesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoritesState {
  items: string[];
}

const initialState: FavoritesState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const programId = action.payload;
      const index = state.items.indexOf(programId);
      
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(programId);
      }
    },
    
    addToFavorites: (state, action: PayloadAction<string>) => {
      if (!state.items.includes(action.payload)) {
        state.items.push(action.payload);
      }
    },
    
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(id => id !== action.payload);
    },
    
    clearFavorites: (state) => {
      state.items = [];
    },
  },
});

export const {
  toggleFavorite,
  addToFavorites,
  removeFromFavorites,
  clearFavorites,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;


