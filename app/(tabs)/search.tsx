import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import MovieCarousel from '../../components/MovieCarousel';
import SearchBar from '../../components/SearchBar';
import { useAppDispatch, useAppSelector } from '../../store';
import {
    useGetUpcomingMoviesQuery,
    useSearchMoviesQuery,
} from '../../store/api/movieApi';
import { setSearchQuery } from '../../store/movieSlice';

export default function SearchScreen() {
  const dispatch = useAppDispatch();
  const { searchQuery } = useAppSelector(state => state.movies);
  const [refreshing, setRefreshing] = useState(false);

  const { data: searchData, isLoading: searchLoading } = useSearchMoviesQuery(searchQuery, {
    skip: !searchQuery,
  });
  const { data: upcomingData, refetch: refetchUpcoming, isLoading: upcomingLoading } = useGetUpcomingMoviesQuery();

  const handleSearch = (text: string) => {
    dispatch(setSearchQuery(text));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchUpcoming();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <LinearGradient
        colors={['#f8f9fa', '#ffffff']}
        style={styles.header}
      >
        <LinearGradient
          colors={['#34c759', '#00d4ff']}
          style={styles.titleGradient}
        >
          <Text style={styles.headerTitle}>Search</Text>
        </LinearGradient>
        <Text style={styles.headerSubtitle}>Find your next favorite film</Text>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Search for movies..."
        />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#34c759']}
          />
        }
      >
        {/* Search Results */}
        {searchQuery && (
          <MovieCarousel
            movies={searchData?.results || []}
            title={`🔍 Results for "${searchQuery}"`}
            loading={searchLoading}
          />
        )}

        {/* Coming Soon Movies */}
        <MovieCarousel
          movies={upcomingData?.results || []}
          title="🎬 Coming Soon"
          loading={upcomingLoading}
        />
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    alignItems: 'center',
  },
  titleGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8e8e93',
    textAlign: 'center',
  },
  searchContainer: {
    paddingTop: 16,
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  bottomSpacing: {
    height: 32,
  },
});