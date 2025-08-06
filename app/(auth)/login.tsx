import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store';
import { loadStoredAuth, loginStart, loginSuccess } from '../../store/authSlice';
import { loadStoredToken } from '../../utils/auth';

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector(state => state.auth);
  const router = useRouter();

  // Check for stored auth on mount - but safely
  useEffect(() => {
    const checkStoredAuth = async () => {
      try {
        const token = await loadStoredToken();
        if (token) {
          dispatch(loadStoredAuth(token));
        }
      } catch {
        console.log('No stored token found');
      }
    };
    
    checkStoredAuth();
  }, [dispatch]);

  // Navigate when authenticated - but with a delay to ensure component is ready
  useEffect(() => {
    if (isAuthenticated) {
      // Use setTimeout to ensure component is fully mounted
      const timer = setTimeout(() => {
        router.replace('/(tabs)');
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (): Promise<void> => {
    dispatch(loginStart());
    
    // Mock login for testing - replace with real OAuth2 later
    setTimeout(() => {
      dispatch(loginSuccess({
        user: { id: '1', email: 'test@example.com', name: 'Test User' },
        token: 'mock_token_123',
      }));
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#000000" />
      
      {/* App Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>🎬</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>CinemaScope</Text>
      <Text style={styles.subtitle}>Your movie discovery app</Text>
      <Text style={styles.description}>
        Discover amazing movies, create your personal watchlist, and never miss a great film again.
      </Text>
      
      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      {/* Login Button */}
      <TouchableOpacity 
        style={[styles.loginButton, loading && styles.disabledButton]} 
        onPress={handleLogin}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text style={styles.loginButtonText}>Login to Continue</Text>
        )}
      </TouchableOpacity>

      {/* Features List */}
      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <Text style={styles.featureEmoji}>🔥</Text>
          </View>
          <Text style={styles.featureText}>Trending Movies</Text>
        </View>
        
        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <Text style={styles.featureEmoji}>❤️</Text>
          </View>
          <Text style={styles.featureText}>Personal Favorites</Text>
        </View>
        
        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <Text style={styles.featureEmoji}>🔍</Text>
          </View>
          <Text style={styles.featureText}>Smart Search</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Powered by The Movie Database (TMDB)
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000000',
  },
  logoContainer: {
    marginBottom: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  logoText: {
    fontSize: 32,
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#b3b3b3',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    color: '#b3b3b3',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  errorContainer: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FF1744',
  },
  errorText: {
    color: '#FF1744',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 200,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 300,
    marginBottom: 40,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  featureEmoji: {
    fontSize: 20,
  },
  featureText: {
    fontSize: 12,
    color: '#b3b3b3',
    textAlign: 'center',
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
});