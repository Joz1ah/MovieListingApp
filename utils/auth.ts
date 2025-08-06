import * as SecureStore from 'expo-secure-store';
import { User } from './types';


export interface AuthResult {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

export const authenticateUser = async (): Promise<AuthResult> => {
  try {
    // For now, return a mock successful authentication
    // In a real app, you would implement proper OAuth2 flow using useAuthRequest hook
    const mockToken = 'mock_token_' + Date.now();
    const mockUser: User = {
      id: '1',
      email: 'user@example.com',
      name: 'Test User'
    };
    
    // Store token securely
    await SecureStore.setItemAsync('authToken', mockToken);
    
    return {
      success: true,
      token: mockToken,
      user: mockUser,
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Authentication failed' 
    };
  }
};

export const loadStoredToken = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync('authToken');
    return token;
  } catch (error) {
    console.error('Error loading stored token:', error);
    return null;
  }
};

export const clearStoredToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync('authToken');
  } catch (error) {
    console.error('Error clearing stored token:', error);
  }
};