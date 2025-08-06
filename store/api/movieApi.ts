import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { MovieDetails, MovieResponse } from '../../utils/types';

const API_KEY = 'df782bc195e54779c69a7940d5d88471'; 
const BASE_URL = 'https://api.themoviedb.org/3';

export const movieApi = createApi({
  reducerPath: 'movieApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Movie'],
  endpoints: (builder) => ({
    getTrendingMovies: builder.query<MovieResponse, void>({
      query: () => `/trending/movie/week?api_key=${API_KEY}`,
      providesTags: ['Movie'],
    }),
    
    getPopularMovies: builder.query<MovieResponse, void>({
      query: () => `/movie/popular?api_key=${API_KEY}`,
      providesTags: ['Movie'],
    }),
    
    getTopRatedMovies: builder.query<MovieResponse, void>({
      query: () => `/movie/top_rated?api_key=${API_KEY}`,
      providesTags: ['Movie'],
    }),
    
    getUpcomingMovies: builder.query<MovieResponse, void>({
      query: () => `/movie/upcoming?api_key=${API_KEY}`,
      providesTags: ['Movie'],
    }),
    
    searchMovies: builder.query<MovieResponse, string>({
      query: (searchTerm) => `/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchTerm)}`,
      providesTags: ['Movie'],
    }),
    
    getMovieDetails: builder.query<MovieDetails, number>({
      query: (movieId) => `/movie/${movieId}?api_key=${API_KEY}`,
      providesTags: ['Movie'],
    }),
  }),
});

export const {
  useGetTrendingMoviesQuery,
  useGetPopularMoviesQuery,
  useGetTopRatedMoviesQuery,
  useGetUpcomingMoviesQuery,
  useSearchMoviesQuery,
  useGetMovieDetailsQuery,
} = movieApi;