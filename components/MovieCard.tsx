// Updated components/MovieCard.tsx with larger card sizes to show full images

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import { toggleFavorite } from '../store/movieSlice';
import { Movie } from '../utils/types';

interface MovieCardProps {
  movie: Movie;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onPress, size = 'medium' }) => {
  const dispatch = useAppDispatch();
  const favoriteMovies = useAppSelector(state => state.movies.favoriteMovies);
  const isFavorite = favoriteMovies.includes(movie.id);

  const handleFavoritePress = (event: any): void => {
    event.stopPropagation();
    dispatch(toggleFavorite(movie.id));
  };

  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/300x450/333333/ffffff?text=No+Image';

  const formatDate = (dateString: string): string => {
    try {
      if (!dateString) return 'N/A';
      return new Date(dateString).getFullYear().toString();
    } catch {
      return 'N/A';
    }
  };

  const formatRating = (rating: number): string => {
    if (!rating || rating === 0) return 'N/A';
    return rating.toFixed(1);
  };

  // Updated card sizes to be larger and maintain aspect ratio
  const cardStyles = {
    small: { width: 140, height: 240 },
    medium: { width: 170, height: 280 },
    large: { width: 200, height: 320 },
  };

  // Poster aspect ratio is typically 2:3, so adjust accordingly
  const posterStyles = {
    small: { height: 190 },
    medium: { height: 215 },
    large: { height: 240 },
  };

  return (
    <TouchableOpacity 
      style={[styles.container, cardStyles[size]]} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      {/* Movie Poster */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: imageUrl }} 
          style={[styles.poster, posterStyles[size]]}
          resizeMode="cover"
        />
        
        {/* Favorite Button */}
        <TouchableOpacity 
          onPress={handleFavoritePress} 
          style={styles.favoriteButton}
        >
          <LinearGradient
            colors={isFavorite ? ['#ff6b9d', '#4ecdc4'] : ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
            style={styles.favoriteGradient}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={18}
              color="white"
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
      
      {/* Movie Info */}
      <View style={styles.movieInfo}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title || 'Unknown Title'}
        </Text>
        
        <View style={styles.movieMeta}>
          <Text style={styles.year}>
            {formatDate(movie.release_date)}
          </Text>
          
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#ffce00" />
            <Text style={styles.rating}>
              {formatRating(movie.vote_average)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333333',
  },
  imageContainer: {
    position: 'relative',
    flex: 1,
  },
  poster: {
    width: '100%',
    backgroundColor: '#333333',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  favoriteGradient: {
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  movieInfo: {
    padding: 12,
    paddingTop: 0,
    height: 65,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
    lineHeight: 18,
  },
  movieMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  year: {
    fontSize: 12,
    color: '#b3b3b3',
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    color: '#b3b3b3',
    marginLeft: 2,
    fontWeight: '600',
  },
});

export default MovieCard;