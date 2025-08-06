import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { loadStoredAuth } from '../store/authSlice';
import { loadStoredToken } from '../utils/auth';

import HomeScreen from '../app/HomeScreen';
import LoginScreen from '../app/LoginScreen';
import MovieDetailsScreen from '../app/MovieDetailsScreen';
import { RootStackParamList } from '../utils/types';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  useEffect(() => {
    const loadAuth = async (): Promise<void> => {
      const token = await loadStoredToken();
      if (token) {
        dispatch(loadStoredAuth(token));
      }
    };
    
    loadAuth();
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="MovieDetails" 
              component={MovieDetailsScreen}
              options={{
                headerShown: true,
                title: 'Movie Details',
                headerStyle: {
                  backgroundColor: '#007AFF',
                },
                headerTintColor: 'white',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
          </>
        ) : (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;