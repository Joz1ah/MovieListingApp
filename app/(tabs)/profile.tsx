// Fixed app/(tabs)/profile.tsx - Changed to dark theme like other tabs

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/authSlice';
import { clearFavorites } from '../../store/movieSlice';

interface ProfileOptionProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  destructive?: boolean;
}

const ProfileOption: React.FC<ProfileOptionProps> = ({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  destructive = false 
}) => (
  <TouchableOpacity style={styles.option} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.optionLeft}>
      <View style={[styles.iconContainer, destructive && styles.destructiveIcon]}>
        <Ionicons 
          name={icon} 
          size={24} 
          color={destructive ? '#ff6b9d' : '#4ecdc4'} 
        />
      </View>
      <View style={styles.optionText}>
        <Text style={[styles.optionTitle, destructive && styles.destructiveText]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.optionSubtitle}>{subtitle}</Text>
        )}
      </View>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#666666" />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const { favoriteMovies } = useAppSelector(state => state.movies);

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
            router.replace('/(auth)/login');
          }
        },
      ]
    );
  };

  const handleClearFavorites = () => {
    if (favoriteMovies.length === 0) {
      Alert.alert('No Favorites', 'You don\'t have any favorite movies to clear.');
      return;
    }

    Alert.alert(
      'Clear Favorites',
      `Are you sure you want to remove all ${favoriteMovies.length} movies from your favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: () => {
            dispatch(clearFavorites());
            Alert.alert('Success', 'All favorites have been cleared.');
          }
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Coming Soon', 'Profile editing will be available in a future update.');
  };

  const handleSettings = () => {
    Alert.alert('Coming Soon', 'Settings will be available in a future update.');
  };

  const handleAbout = () => {
    Alert.alert(
      'About CinemaScope',
      'Version 1.0.0\n\nA beautiful movie discovery app built with React Native and powered by TMDB.\n\nDeveloped as a portfolio project.',
      [{ text: 'OK' }]
    );
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <LinearGradient colors={['#000000', '#111111']} style={styles.container}>
      <StatusBar style="light" backgroundColor="#000000" />
      
      {/* Header - Dark theme with gradient text effect */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerSubtitle}>Manage your account</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info Card */}
        <View style={styles.userCard}>
          <LinearGradient
            colors={['#ff6b9d', '#4ecdc4']}
            style={styles.avatarContainer}
          >
            <Ionicons name="person" size={40} color="white" />
          </LinearGradient>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Movie Lover'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
            <View style={styles.favoriteCountContainer}>
              <LinearGradient
                colors={['#4ecdc4', '#ff6b9d']}
                style={styles.favoriteCountBadge}
              >
                <Text style={styles.favoriteCount}>
                  {favoriteMovies.length} favorite{favoriteMovies.length !== 1 ? 's' : ''}
                </Text>
              </LinearGradient>
            </View>
          </View>
        </View>

        {/* Profile Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <ProfileOption
            icon="person-outline"
            title="Edit Profile"
            subtitle="Update your personal information"
            onPress={handleEditProfile}
          />
          
          <ProfileOption
            icon="settings-outline"
            title="Settings"
            subtitle="App preferences and notifications"
            onPress={handleSettings}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Content</Text>
          
          <ProfileOption
            icon="heart-outline"
            title="Manage Favorites"
            subtitle={`${favoriteMovies.length} movies in your list`}
            onPress={() => router.push('/(tabs)/mylist')}
          />
          
          <ProfileOption
            icon="trash-outline"
            title="Clear All Favorites"
            subtitle="Remove all movies from your list"
            onPress={handleClearFavorites}
            destructive
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <ProfileOption
            icon="information-circle-outline"
            title="About"
            subtitle="App version and information"
            onPress={handleAbout}
          />
        </View>

        <View style={styles.section}>
          <ProfileOption
            icon="log-out-outline"
            title="Logout"
            subtitle="Sign out of your account"
            onPress={handleLogout}
            destructive
          />
        </View>
        
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
  content: {
    flex: 1,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    margin: 16,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#b3b3b3',
    marginBottom: 12,
  },
  favoriteCountContainer: {
    alignSelf: 'flex-start',
  },
  favoriteCountBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  favoriteCount: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666666',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  destructiveIcon: {
    backgroundColor: '#2a1a1a',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  destructiveText: {
    color: '#ff6b9d',
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#b3b3b3',
  },
  bottomSpacing: {
    height: 32,
  },
});