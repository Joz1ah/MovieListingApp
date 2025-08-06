import { useRouter } from 'expo-router';
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
      <Text style={styles.title}>CinemaScope</Text>
      <Text style={styles.subtitle}>Your movie discovery app</Text>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      
      <TouchableOpacity 
        style={[styles.loginButton, loading && styles.disabledButton]} 
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.loginButtonText}>Login to Continue</Text>
        )}
      </TouchableOpacity>
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FF6B35',
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: 40,
    textAlign: 'center',
  },
  errorText: {
    color: '#FF1744',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 200,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});