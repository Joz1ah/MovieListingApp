import { LinearGradient } from 'expo-linear-gradient';
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
  loading?: boolean;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ movies, title, loading }) => {
  const router = useRouter();

  const handleMoviePress = (movieId: number) => {
    router.push(`/movie/${movieId}`);
  };

  const renderMovie = ({ item }: { item: Movie }) => (
    <MovieCard
      movie={item}
      onPress={() => handleMoviePress(item.id)}
      size="medium"
    />
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#ffffff', '#ff6b9d', '#4ecdc4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.titleGradient}
        >
          <Text style={styles.sectionTitle}>{title}</Text>
        </LinearGradient>
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
        <LinearGradient
          colors={['#ffffff', '#ff6b9d', '#4ecdc4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.titleGradient}
        >
          <Text style={styles.sectionTitle}>{title}</Text>
        </LinearGradient>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No movies available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#ffffff', '#ff6b9d', '#4ecdc4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.titleGradient}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
      </LinearGradient>
      
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
  titleGradient: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  loadingContainer: {
    height: 220,
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
    height: 220,
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