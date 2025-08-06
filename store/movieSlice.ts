import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MovieState } from '../utils/types';

const initialState: MovieState = {
  favoriteMovies: [],
  searchQuery: '',
  currentFilter: 'popular',
};

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const movieId = action.payload;
      const index = state.favoriteMovies.findIndex(id => id === movieId);
      
      if (index >= 0) {
        state.favoriteMovies.splice(index, 1);
      } else {
        state.favoriteMovies.push(movieId);
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setCurrentFilter: (state, action: PayloadAction<'trending' | 'popular' | 'favorited'>) => {
      state.currentFilter = action.payload;
    },
    clearFavorites: (state) => {
      state.favoriteMovies = [];
    },
  },
});

export const { 
  toggleFavorite, 
  setSearchQuery, 
  setCurrentFilter, 
  clearFavorites 
} = movieSlice.actions;

export default movieSlice.reducer;