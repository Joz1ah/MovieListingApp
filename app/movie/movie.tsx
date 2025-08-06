import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store';
import { useGetMovieDetailsQuery } from '../../store/api/movieApi';
import { toggleFavorite } from '../../store/movieSlice';
import { Genre, ProductionCompany } from '../../utils/types';

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const movieId = parseInt(id as string);
  
  const { data: movie, isLoading, error } = useGetMovieDetailsQuery(movieId);
  const favoriteMovies = useAppSelector(state => state.movies.favoriteMovies);
  const isFavorite = favoriteMovies.includes(movieId);

  const handleFavoritePress = (): void => {
    dispatch(toggleFavorite(movieId));
    
    // Show feedback
    Alert.alert(
      isFavorite ? 'Removed from Favorites' : 'Added to Favorites',
      isFavorite 
        ? 'Movie removed from your favorites list' 
        : 'Movie added to your favorites list',
      [{ text: 'OK' }]
    );
  };

  const formatRuntime = (minutes: number | null): string => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number): string => {
    if (!amount || amount === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    try {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Loading movie details...</Text>
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#ffffff" />
        <Text style={styles.errorTitle}>Error loading movie</Text>
        <Text style={styles.errorSubtitle}>
          {error ? 'Failed to load movie details' : 'Movie not found'}
        </Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750/333333/ffffff?text=No+Image';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Backdrop Image */}
      {backdropUrl && (
        <View style={styles.backdropContainer}>
          <Image source={{ uri: backdropUrl }} style={styles.backdrop} />
          <View style={styles.backdropOverlay} />
        </View>
      )}

      {/* Content */}
      <View style={[
        styles.content,
        backdropUrl && {
          marginTop: -20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }
      ]}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Image source={{ uri: posterUrl }} style={styles.poster} />
          
          <View style={styles.basicInfo}>
            <Text style={styles.title}>{movie.title}</Text>
            
            {movie.tagline && (
              <Text style={styles.tagline}>&ldquo;{movie.tagline}&rdquo;</Text>
            )}
            
            <View style={styles.metaInfo}>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>
                  {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                </Text>
                <Text style={styles.voteCount}>
                  ({movie.vote_count ? movie.vote_count.toLocaleString() : '0'} votes)
                </Text>
              </View>
              
              <Text style={styles.releaseDate}>
                {formatDate(movie.release_date)}
              </Text>
              
              <Text style={styles.runtime}>
                {formatRuntime(movie.runtime)}
              </Text>
            </View>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <View style={styles.genresContainer}>
                {movie.genres.map((genre: Genre) => (
                  <View key={genre.id} style={styles.genreTag}>
                    <Text style={styles.genreText}>{genre.name}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Favorite Button */}
            <TouchableOpacity 
              style={[
                styles.favoriteButton,
                isFavorite && styles.favoriteButtonActive
              ]} 
              onPress={handleFavoritePress}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={20}
                color={isFavorite ? 'black' : 'white'}
              />
              <Text style={[
                styles.favoriteButtonText,
                isFavorite && styles.favoriteButtonTextActive
              ]}>
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Overview Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.overview}>
            {movie.overview || 'No overview available for this movie.'}
          </Text>
        </View>

        {/* Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={styles.detailValue}>{movie.status || 'Unknown'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Original Language:</Text>
            <Text style={styles.detailValue}>
              {movie.original_language ? movie.original_language.toUpperCase() : 'N/A'}
            </Text>
          </View>
          
          {movie.budget && movie.budget > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Budget:</Text>
              <Text style={styles.detailValue}>
                {formatCurrency(movie.budget)}
              </Text>
            </View>
          )}
          
          {movie.revenue && movie.revenue > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Revenue:</Text>
              <Text style={styles.detailValue}>
                {formatCurrency(movie.revenue)}
              </Text>
            </View>
          )}
        </View>

        {/* Production Companies */}
        {movie.production_companies && movie.production_companies.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Production Companies</Text>
            {movie.production_companies.map((company: ProductionCompany) => (
              <Text key={company.id} style={styles.companyName}>
                • {company.name}
              </Text>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#b3b3b3',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#000000',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#b3b3b3',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  backdropContainer: {
    height: 220,
    position: 'relative',
  },
  backdrop: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: '#000000',
    padding: 20,
    minHeight: 400,
  },
  headerSection: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    resizeMode: 'cover',
    backgroundColor: '#333333',
    borderWidth: 1,
    borderColor: '#444444',
  },
  basicInfo: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    lineHeight: 26,
  },
  tagline: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#b3b3b3',
    marginBottom: 12,
    lineHeight: 18,
  },
  metaInfo: {
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 4,
  },
  voteCount: {
    fontSize: 12,
    color: '#b3b3b3',
    marginLeft: 4,
  },
  releaseDate: {
    fontSize: 14,
    color: '#b3b3b3',
    marginBottom: 4,
  },
  runtime: {
    fontSize: 14,
    color: '#b3b3b3',
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  genreTag: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#444444',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 6,
  },
  genreText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#444444',
  },
  favoriteButtonActive: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
  },
  favoriteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    color: '#ffffff',
  },
  favoriteButtonTextActive: {
    color: '#000000',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  overview: {
    fontSize: 16,
    lineHeight: 24,
    color: '#b3b3b3',
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    width: 140,
  },
  detailValue: {
    fontSize: 14,
    color: '#b3b3b3',
    flex: 1,
  },
  companyName: {
    fontSize: 14,
    color: '#b3b3b3',
    marginBottom: 6,
    lineHeight: 18,
  },
});