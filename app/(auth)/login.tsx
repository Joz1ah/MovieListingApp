// app/(auth)/login.tsx - Perfect for technical examination
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store';
import { loginFailure, loginStart, loginSuccess } from '../../store/authSlice';
import { authenticateUser, loadStoredAuth as loadStoredAuthUtil } from '../../utils/auth';

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector(state => state.auth);
  const router = useRouter();
  const [initialLoading, setInitialLoading] = useState(true);

  // Check for stored auth on mount
  useEffect(() => {
    const checkStoredAuth = async () => {
      try {
        const authResult = await loadStoredAuthUtil();
        if (authResult && authResult.success) {
          dispatch(loginSuccess({
            user: authResult.user!,
            token: authResult.token!,
          }));
        }
      } catch {
        console.log('No stored auth found');
      } finally {
        setInitialLoading(false);
      }
    };
    
    checkStoredAuth();
  }, [dispatch]);

  // Navigate when authenticated
  useEffect(() => {
    if (isAuthenticated && !initialLoading) {
      const timer = setTimeout(() => {
        router.replace('/(tabs)');
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, initialLoading, router]);

  const handleOAuth2Login = async (): Promise<void> => {
    dispatch(loginStart());
    
    try {
      const result = await authenticateUser();
      
      if (result.success && result.user && result.token) {
        dispatch(loginSuccess({
          user: result.user,
          token: result.token,
        }));
      } else {
        dispatch(loginFailure(result.error || 'OAuth2 authentication failed'));
        
        Alert.alert(
          'Authentication Failed',
          result.error || 'Unable to authenticate. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'OAuth2 authentication failed';
      dispatch(loginFailure(errorMessage));
      
      Alert.alert(
        'Authentication Error',
        errorMessage,
        [{ text: 'OK' }]
      );
    }
  };

  // Show loading screen while checking stored auth
  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>🎬</Text>
          </View>
        </View>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Checking authentication...</Text>
      </View>
    );
  }

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
      <Text style={styles.subtitle}>Movie Discovery Platform</Text>
      <Text style={styles.description}>
        Secure OAuth2 authentication required to access your personalized movie experience.
      </Text>
      
      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      {/* OAuth2 Login Button */}
      <TouchableOpacity 
        style={[styles.loginButton, loading && styles.disabledButton]} 
        onPress={handleOAuth2Login}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <View style={styles.loadingButtonContent}>
            <ActivityIndicator color="white" size="small" />
            <Text style={styles.loadingButtonText}>Authenticating...</Text>
          </View>
        ) : (
          <View style={styles.buttonContent}>
            <Text style={styles.oauthIcon}>🔐</Text>
            <Text style={styles.loginButtonText}>Authenticate with OAuth2</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* OAuth2 Features */}
      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <Text style={styles.featureEmoji}>🔒</Text>
          </View>
          <Text style={styles.featureText}>Secure Authentication</Text>
        </View>
        
        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <Text style={styles.featureEmoji}>💾</Text>
          </View>
          <Text style={styles.featureText}>Session Persistence</Text>
        </View>
        
        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <Text style={styles.featureEmoji}>👤</Text>
          </View>
          <Text style={styles.featureText}>User Profiles</Text>
        </View>
      </View>

      {/* Technical Info */}
      <View style={styles.techInfo}>
        <Text style={styles.techTitle}>Technical Implementation:</Text>
        <Text style={styles.techText}>• OAuth2 Authentication Flow</Text>
        <Text style={styles.techText}>• Redux Toolkit State Management</Text>
        <Text style={styles.techText}>• Secure Token Storage</Text>
        <Text style={styles.techText}>• Session Persistence</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Technical Examination - RBS Software Solutions
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
    fontSize: 14,
    color: '#b3b3b3',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 20,
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
    maxWidth: 320,
  },
  errorText: {
    color: '#FF1744',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 280,
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
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  oauthIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 300,
    marginBottom: 30,
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
    fontSize: 11,
    color: '#b3b3b3',
    textAlign: 'center',
    fontWeight: '500',
  },
  techInfo: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    maxWidth: 280,
  },
  techTitle: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  techText: {
    color: '#b3b3b3',
    fontSize: 12,
    marginBottom: 2,
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