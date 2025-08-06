import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import { useGetMovieDetailsQuery } from '../store/api/movieApi';
import { toggleFavorite } from '../store/movieSlice';
import { RootStackParamList } from '../utils/types';

type MovieDetailsRouteProp = RouteProp<RootStackParamList, 'MovieDetails'>;
type MovieDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'MovieDetails'>;

const { width: screenWidth } = Dimensions.get('window');

const MovieDetailsScreen: React.FC = () => {
  const route = useRoute<MovieDetailsRouteProp>();
  const navigation = useNavigation<MovieDetailsNavigationProp>();
  const dispatch = useAppDispatch();
  const { movieId } = route.params;
  
  const { data: movie, isLoading, error } = useGetMovieDetailsQuery(movieId);
  const favoriteMovies = useAppSelector(state => state.movies.favoriteMovies);
  const isFavorite = favoriteMovies.includes(movieId);

  const handleFavoritePress = (): void => {
    dispatch(toggleFavorite(movieId));
  };

  const formatRuntime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading movie details...</Text>
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
        <Text style={styles.errorTitle}>Error loading movie</Text>
        <Text style={styles.errorSubtitle}>Please try again later</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => navigation.goBack()}
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
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <ScrollView style={styles.container}>
      {/* Backdrop Image */}
      {backdropUrl && (
        <View style={styles.backdropContainer}>
          <Image source={{ uri: backdropUrl }} style={styles.backdrop} />
          <View style={styles.backdropOverlay} />
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        {/* Poster and Basic Info */}
        <View style={styles.headerSection}>
          <Image source={{ uri: posterUrl }} style={styles.poster} />
          
          <View style={styles.basicInfo}>
            <Text style={styles.title}>{movie.title}</Text>
            
            {movie.tagline && (
              <Text style={styles.tagline}>"{movie.tagline}"</Text>
            )}
            
            <View style={styles.metaInfo}>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>
                  {movie.vote_average.toFixed(1)}
                </Text>
                <Text style={styles.voteCount}>
                  ({movie.vote_count.toLocaleString()} votes)
                </Text>
              </View>
              
              <Text style={styles.releaseDate}>
                {new Date(movie.release_date).getFullYear()}
              </Text>
              
              {movie.runtime && (
                <Text style={styles.runtime}>
                  {formatRuntime(movie.runtime)}
                </Text>
              )}
            </View>

            {/* Genres */}
            <View style={styles.genresContainer}>
              {movie.genres.map((genre) => (
                <View key={genre.id} style={styles.genreTag}>
                  <Text style={styles.genreText}>{genre.name}</Text>
                </View>
              ))}
            </View>

            {/* Favorite Button */}
            <TouchableOpacity 
              style={styles.favoriteButton} 
              onPress={handleFavoritePress}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={20}
                color={isFavorite ? '#FF3B30' : '#007AFF'}
              />
              <Text style={[
                styles.favoriteButtonText,
                { color: isFavorite ? '#FF3B30' : '#007AFF' }
              ]}>
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.overview}>{movie.overview}</Text>
        </View>

        {/* Additional Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={styles.detailValue}>{movie.status}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Original Language:</Text>
            <Text style={styles.detailValue}>
              {movie.original_language.toUpperCase()}
            </Text>
          </View>
          
          {movie.budget > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Budget:</Text>
              <Text style={styles.detailValue}>
                {formatCurrency(movie.budget)}
              </Text>
            </View>
          )}
          
          {movie.revenue > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Revenue:</Text>
              <Text style={styles.detailValue}>
                {formatCurrency(movie.revenue)}
              </Text>
            </View>
          )}
        </View>

        {/* Production Companies */}
        {movie.production_companies.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Production Companies</Text>
            {movie.production_companies.map((company) => (
              <Text key={company.id} style={styles.companyName}>
                {company.name}
              </Text>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f5f5f5',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  backdropContainer: {
    height: 200,
    position: 'relative',
  },
  backdrop: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  content: {
    backgroundColor: 'white',
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
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
  },
  basicInfo: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 12,
  },
  metaInfo: {
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
  voteCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  releaseDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  runtime: {
    fontSize: 14,
    color: '#666',
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  genreTag: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  genreText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  favoriteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  overview: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 6,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    width: 120,
  },
  detailValue: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  companyName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default MovieDetailsScreen;