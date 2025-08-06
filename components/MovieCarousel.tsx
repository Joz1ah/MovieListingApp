// Fixed components/MovieCarousel.tsx - Clean gradient text without background

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Movie } from '../utils/types';
import MovieCard from './MovieCard';

interface MovieCarouselProps {
  movies: Movie[];
  title: string;
  icon?: string;
  loading?: boolean;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ movies, title, icon, loading }) => {
  const router = useRouter();

  const handleMoviePress = (movieId: number) => {
    router.push(`/movie/${movieId}`);
  };

  const renderMovie = ({ item }: { item: Movie }) => (
    <MovieCard
      movie={item}
      onPress={() => handleMoviePress(item.id)}
      size="large"
    />
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          {icon && <Ionicons name={icon as any} size={20} color="#ff6b9d" style={styles.titleIcon} />}
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff6b9d" />
          <Text style={styles.loadingText}>Loading movies...</Text>
        </View>
      </View>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          {icon && <Ionicons name={icon as any} size={20} color="#ff6b9d" style={styles.titleIcon} />}
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No movies available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        {icon && <Ionicons name={icon as any} size={20} color="#ff6b9d" style={styles.titleIcon} />}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      
      <FlatList
        data={movies}
        renderItem={renderMovie}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  titleIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'left',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  loadingContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  loadingText: {
    color: '#b3b3b3',
    fontSize: 16,
    marginTop: 12,
  },
  emptyContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  emptyText: {
    color: '#b3b3b3',
    fontSize: 16,
  },
});

export default MovieCarousel;