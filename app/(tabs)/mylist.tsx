// Fixed app/(tabs)/mylist.tsx - Clean gradient text without background

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MovieCard from '../../components/MovieCard';
import { useAppDispatch, useAppSelector } from '../../store';
import { useGetMovieDetailsQuery } from '../../store/api/movieApi';
import { clearFavorites } from '../../store/movieSlice';

const { width } = Dimensions.get('window');
const numColumns = 2;
const itemWidth = (width - 48) / numColumns;

// Component to render individual favorite movie
const FavoriteMovieItem: React.FC<{ movieId: number }> = ({ movieId }) => {
  const router = useRouter();
  const { data: movie, isLoading } = useGetMovieDetailsQuery(movieId);

  const handlePress = () => {
    if (movie) {
      router.push(`/movie/${movie.id}`);
    }
  };

  if (isLoading || !movie) {
    return (
      <View style={[styles.movieItem, { width: itemWidth }]}>
        <View style={styles.loadingCard}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.movieItem, { width: itemWidth }]}>
      <MovieCard
        movie={movie}
        onPress={handlePress}
        size="medium"
      />
    </View>
  );
};

export default function MyListScreen() {
  const dispatch = useAppDispatch();
  const { favoriteMovies } = useAppSelector(state => state.movies);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleClearAll = () => {
    dispatch(clearFavorites());
  };

  const renderItem = ({ item }: { item: number }) => (
    <FavoriteMovieItem movieId={item} />
  );

  return (
    <LinearGradient colors={['#000000', '#111111']} style={styles.container}>
      <StatusBar style="light" backgroundColor="#000000" />
      
      {/* Header - Clean with gradient text effect */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My List</Text>
        <Text style={styles.headerSubtitle}>
          {favoriteMovies.length} movie{favoriteMovies.length !== 1 ? 's' : ''}
        </Text>
        
        {favoriteMovies.length > 0 && (
          <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
            <LinearGradient
              colors={['#ff6b9d', '#4ecdc4']}
              style={styles.clearButtonGradient}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      {favoriteMovies.length === 0 ? (
        /* Empty State */
        <View style={styles.emptyContainer}>
          <LinearGradient
            colors={['#ffffff', '#ff6b9d', '#4ecdc4']}
            style={styles.emptyIconContainer}
          >
            <Ionicons 
              name="heart-outline" 
              size={60} 
              color="#000000"
            />
          </LinearGradient>
          
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptySubtitle}>
            Start adding movies to your list by tapping the heart icon on any movie
          </Text>
        </View>
      ) : (
        /* Favorites Grid */
        <FlatList
          data={favoriteMovies}
          renderItem={renderItem}
          keyExtractor={(item) => item.toString()}
          numColumns={numColumns}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#ff6b9d"
              colors={['#ff6b9d']}
            />
          }
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: '#ffffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    elevation: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#b3b3b3',
    textAlign: 'center',
    marginBottom: 16,
  },
  clearButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  clearButtonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  clearButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#b3b3b3',
    textAlign: 'center',
    lineHeight: 22,
  },
  listContainer: {
    padding: 16,
  },
  movieItem: {
    marginBottom: 16,
    marginRight: 16,
  },
  loadingCard: {
    height: 220,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  loadingText: {
    color: '#b3b3b3',
    fontSize: 14,
  },
});