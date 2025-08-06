import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
    FlatList,
    ListRenderItem,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import EmptyState from '../components/EmptyState';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import { useAppDispatch, useAppSelector } from '../store';
import {
    useGetPopularMoviesQuery,
    useGetTrendingMoviesQuery,
    useSearchMoviesQuery,
} from '../store/api/movieApi';
import { logout } from '../store/authSlice';
import { setCurrentFilter, setSearchQuery } from '../store/movieSlice';
import { Movie, RootStackParamList } from '../utils/types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { currentFilter, searchQuery, favoriteMovies } = useAppSelector(state => state.movies);
  const [refreshing, setRefreshing] = useState(false);

  // RTK Query hooks
  const { data: trendingData, refetch: refetchTrending, isLoading: trendingLoading } = useGetTrendingMoviesQuery();
  const { data: popularData, refetch: refetchPopular, isLoading: popularLoading } = useGetPopularMoviesQuery();
  const { data: searchData, isLoading: searchLoading } = useSearchMoviesQuery(searchQuery, {
    skip: !searchQuery,
  });

  const getCurrentMovies = (): Movie[] => {
    if (searchQuery) return searchData?.results || [];
    
    switch (currentFilter) {
      case 'trending':
        return trendingData?.results || [];
      case 'popular':
        return popularData?.results || [];
      case 'favorited':
        // For favorited movies, you might want to fetch full movie data
        // For now, return empty array if no favorites
        return [];
      default:
        return popularData?.results || [];
    }
  };

  const handleRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await Promise.all([refetchTrending(), refetchPopular()]);
    setRefreshing(false);
  };

  const handleLogout = (): void => {
    dispatch(logout());
  };

  const handleSearch = (text: string): void => {
    dispatch(setSearchQuery(text));
  };

  const handleFilterPress = (filter: 'trending' | 'popular' | 'favorited'): void => {
    dispatch(setCurrentFilter(filter));
    if (searchQuery) {
      dispatch(setSearchQuery(''));
    }
  };

  const handleMoviePress = (movieId: number): void => {
    navigation.navigate('MovieDetails', { movieId });
  };

  const renderFilterButton = (filter: 'trending' | 'popular' | 'favorited', title: string) => (
    <TouchableOpacity
      key={filter}
      style={[
        styles.filterButton,
        currentFilter === filter && styles.activeFilterButton,
      ]}
      onPress={() => handleFilterPress(filter)}
    >
      <Text
        style={[
          styles.filterButtonText,
          currentFilter === filter && styles.activeFilterButtonText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderMovie: ListRenderItem<Movie> = ({ item }) => (
    <MovieCard
      movie={item}
      onPress={() => handleMoviePress(item.id)}
    />
  );

  const movies = getCurrentMovies();
  const isLoading = trendingLoading || popularLoading || searchLoading;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Movies</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search movies..."
      />

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {renderFilterButton('trending', 'Trending')}
        {renderFilterButton('popular', 'Popular')}
        {renderFilterButton('favorited', `Favorited (${favoriteMovies.length})`)}
      </View>

      {/* Movie List */}
      {movies.length > 0 ? (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMovie}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          title={isLoading ? "Loading..." : "No movies found"}
          subtitle={
            isLoading 
              ? "Fetching movies..." 
              : searchQuery 
                ? "Try a different search term" 
                : "Pull to refresh"
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50, // Account for status bar
    backgroundColor: 'white',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#FF3B30',
    borderRadius: 15,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeFilterButton: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  listContainer: {
    padding: 20,
  },
});

export default HomeScreen;