// Fixed app/(tabs)/search.tsx - Changed to dark theme like other tabs

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
    <LinearGradient colors={['#000000', '#111111']} style={styles.container}>
      <StatusBar style="light" backgroundColor="#000000" />
      
      {/* Header - Dark theme with gradient text effect */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
        <Text style={styles.headerSubtitle}>Find your next favorite film</Text>
      </View>

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
            tintColor="#ff6b9d"
            colors={['#ff6b9d']}
          />
        }
      >
        {/* Search Results */}
        {searchQuery && (
          <MovieCarousel
            movies={searchData?.results || []}
            title={`Results for "${searchQuery}"`}
            icon="search"
            loading={searchLoading}
          />
        )}

        {/* Coming Soon Movies */}
        <MovieCarousel
          movies={upcomingData?.results || []}
          title="Coming Soon"
          icon="calendar"
          loading={upcomingLoading}
        />
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
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
    textAlign: 'center',
    color: '#ffffff',
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