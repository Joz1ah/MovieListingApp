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
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
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

  const cardStyles = {
    small: { width: 120, height: 180 },
    medium: { width: 150, height: 220 },
    large: { width: 180, height: 270 },
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
          style={styles.poster}
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
    borderRadius: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
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
    flex: 1,
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
    height: 70,
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