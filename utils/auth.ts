import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { User } from './types';

export interface AuthResult {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

export interface StoredAuthData {
  user: User;
  token: string;
  timestamp: number;
}

// Mock user database for OAuth2-style selection
const mockUsers: User[] = [
  {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
  },
  {
    id: '2', 
    email: 'test@gmail.com',
    name: 'Test User',
  },
  {
    id: '3',
    email: 'user@movieapp.com', 
    name: 'Movie Lover',
  }
];

export const authenticateUser = async (): Promise<AuthResult> => {
  return new Promise((resolve) => {
    // OAuth2-style user selection dialog
    Alert.alert(
      'OAuth2 Authentication',
      'Select your account to continue:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => resolve({ success: false, error: 'Authentication cancelled' })
        },
        {
          text: 'Demo User',
          onPress: () => loginWithUser(mockUsers[0], resolve)
        },
        {
          text: 'Test User', 
          onPress: () => loginWithUser(mockUsers[1], resolve)
        },
        {
          text: 'Movie Lover',
          onPress: () => loginWithUser(mockUsers[2], resolve)
        }
      ]
    );
  });
};

const loginWithUser = async (user: User, resolve: (result: AuthResult) => void) => {
  try {
    // Simulate OAuth2 network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const token = `oauth2_token_${user.id}_${Date.now()}`;
    
    // Store auth data securely (like OAuth2 tokens)
    const authData: StoredAuthData = {
      user,
      token,
      timestamp: Date.now()
    };
    
    await SecureStore.setItemAsync('authData', JSON.stringify(authData));
    
    resolve({
      success: true,
      token,
      user
    });
  } catch {
    resolve({
      success: false,
      error: 'OAuth2 authentication failed'
    });
  }
};

// Export the loadStoredAuth function
export const loadStoredAuth = async (): Promise<AuthResult | null> => {
  try {
    const stored = await SecureStore.getItemAsync('authData');
    if (!stored) return null;
    
    const authData: StoredAuthData = JSON.parse(stored);
    
    // Check if token is expired (24 hours)
    const dayInMs = 24 * 60 * 60 * 1000;
    if (Date.now() - authData.timestamp > dayInMs) {
      await clearStoredAuth();
      return null;
    }
    
    return {
      success: true,
      token: authData.token,
      user: authData.user
    };
  } catch (error) {
    console.error('Error loading stored auth:', error);
    await clearStoredAuth(); // Clear corrupted data
    return null;
  }
};

export const clearStoredAuth = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync('authData');
  } catch (error) {
    console.error('Error clearing auth:', error);
  }
};

// Legacy functions for backward compatibility
export const loadStoredToken = async (): Promise<string | null> => {
  const auth = await loadStoredAuth();
  return auth?.token || null;
};

export const clearStoredToken = clearStoredAuth;