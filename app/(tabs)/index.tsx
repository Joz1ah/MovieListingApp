import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MovieCarousel from '../../components/MovieCarousel';
import { useAppSelector } from '../../store';
import {
  useGetPopularMoviesQuery,
  useGetTopRatedMoviesQuery,
  useGetTrendingMoviesQuery,
} from '../../store/api/movieApi';

export default function HomeScreen() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Safe mounting
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Safe auth check
  const { isAuthenticated } = useAppSelector(state => 
    mounted ? state.auth : { isAuthenticated: true }
  );

  // Safe navigation
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      const timer = setTimeout(() => {
        router.replace('/(auth)/login');
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [mounted, isAuthenticated, router]);

  // API queries
  const { data: trendingData, refetch: refetchTrending, isLoading: trendingLoading } = useGetTrendingMoviesQuery(undefined, {
    skip: !mounted
  });
  const { data: popularData, refetch: refetchPopular, isLoading: popularLoading } = useGetPopularMoviesQuery(undefined, {
    skip: !mounted
  });
  const { data: topRatedData, refetch: refetchTopRated, isLoading: topRatedLoading } = useGetTopRatedMoviesQuery(undefined, {
    skip: !mounted
  });

  const handleRefresh = async () => {
    if (!mounted) return;
    setRefreshing(true);
    await Promise.all([refetchTrending(), refetchPopular(), refetchTopRated()]);
    setRefreshing(false);
  };

  if (!mounted) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Loading CinemaScope...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#000000" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CinemaScope</Text>
        <Text style={styles.headerSubtitle}>Discover Amazing Movies</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#ffffff"
            colors={['#ffffff']}
          />
        }
      >
        {/* Trending Movies */}
        <MovieCarousel
          movies={trendingData?.results || []}
          title="Trending Now"
          icon="trending-up"
          loading={trendingLoading}
        />

        {/* Popular Movies */}
        <MovieCarousel
          movies={popularData?.results || []}
          title="Popular Movies"
          icon="star"
          loading={popularLoading}
        />

        {/* Top Rated Movies */}
        <MovieCarousel
          movies={topRatedData?.results || []}
          title="Top Rated"
          icon="trophy"
          loading={topRatedLoading}
        />
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
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
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#b3b3b3',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingTop: 24,
  },
  bottomSpacing: {
    height: 32,
  },
});