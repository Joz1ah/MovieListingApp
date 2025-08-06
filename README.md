# CinemaScope - Movie Listing App

> **Technical Examination Submission for RBS Software Solutions**  
> **Position:** Mid-Level React Native Developer  
> **Assignment:** Movie Listing App (Demo Application)

## 🎬 Project Overview

CinemaScope is a professional movie discovery mobile application built with React Native, Expo SDK, and Redux Toolkit. The app provides a seamless movie browsing experience with OAuth2 authentication, real-time search, and personalized favorites management.

### 🌟 Key Features

- **🔐 OAuth2 Authentication** - Secure user authentication with session persistence
- **🎭 Movie Discovery** - Browse trending, popular, and top-rated movies
- **🔍 Real-time Search** - Instant movie search functionality
- **💖 Personal Favorites** - Save and manage your favorite movies
- **📱 Responsive Design** - Optimized for both iOS and Android
- **🌙 Dark Theme** - Professional dark mode interface

## 🛠 Technical Stack

### Core Technologies
- **React Native** (0.79.5) - Cross-platform mobile development
- **Expo SDK** (~53.0.20) - Development platform and tooling
- **TypeScript** (~5.8.3) - Type safety and better development experience
- **Redux Toolkit** (^2.8.2) - State management
- **RTK Query** - Efficient data fetching and caching

### Navigation & UI
- **Expo Router** (~5.1.4) - File-based routing system
- **React Navigation** (^7.1.17) - Navigation library
- **Expo Vector Icons** (^14.1.0) - Icon library
- **React Native Reanimated** (~3.17.4) - Smooth animations

### Authentication & Storage
- **Expo Auth Session** (~6.2.1) - OAuth2 authentication flow
- **Expo Secure Store** (~14.2.3) - Secure token storage
- **Expo Web Browser** (~14.2.0) - In-app browser for auth

### API Integration
- **The Movie Database (TMDB) API** - Movie data source
- **Axios** (^1.11.0) - HTTP client for API requests

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Expo CLI** (`npm install -g @expo/cli`)
- **iOS Simulator** (for iOS testing) or **Android Studio** (for Android testing)
- **Expo Go** app on your physical device (optional)

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone [your-repository-url]
cd MovieListingApp
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Start the Development Server
```bash
npx expo start
```

### 4. Run on Device/Simulator
- **iOS Simulator:** Press `i` in the terminal
- **Android Emulator:** Press `a` in the terminal
- **Physical Device:** Scan QR code with Expo Go app

## 🔧 Configuration

### API Configuration
The app uses The Movie Database (TMDB) API. The API key is already configured:

```typescript
// store/api/movieApi.ts
const API_KEY = 'df782bc195e54779c69a7940d5d88471';
const BASE_URL = 'https://api.themoviedb.org/3';
```

### Environment Setup (Optional)
For production deployment, create a `.env` file:

```bash
EXPO_PUBLIC_TMDB_API_KEY=your_api_key_here
EXPO_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
```

## 📱 App Architecture

### Project Structure
```
MovieListingApp/
├── app/                          # Main application screens
│   ├── (auth)/                  # Authentication screens
│   │   ├── _layout.tsx         # Auth layout
│   │   └── login.tsx           # Login screen
│   ├── (tabs)/                 # Tab navigation screens
│   │   ├── index.tsx           # Home screen
│   │   ├── search.tsx          # Search screen
│   │   ├── mylist.tsx          # Favorites screen
│   │   └── profile.tsx         # Profile screen
│   ├── movie/                  # Movie details
│   │   └── [id].tsx           # Dynamic movie details screen
│   └── _layout.tsx            # Root layout
├── components/                 # Reusable components
│   ├── MovieCard.tsx          # Movie card component
│   ├── MovieCarousel.tsx      # Movie carousel
│   ├── SearchBar.tsx          # Search input
│   └── EmptyState.tsx         # Empty state UI
├── store/                     # Redux store configuration
│   ├── api/                   # API slice
│   │   └── movieApi.ts        # TMDB API endpoints
│   ├── authSlice.ts          # Authentication state
│   ├── movieSlice.ts         # Movie state management
│   └── index.ts              # Store configuration
├── utils/                     # Utility functions
│   ├── auth.ts               # Authentication utilities
│   ├── types.ts              # TypeScript definitions
│   └── themes.ts             # Theme configuration
└── assets/                   # Static assets
```

### State Management
- **Redux Toolkit** for global state management
- **RTK Query** for efficient API data fetching and caching
- **Secure Store** for persistent authentication tokens

### Navigation Structure
- **Root Stack Navigator** (Authentication flow)
- **Tab Navigator** (Main app screens)
- **Modal Stack** (Movie details)

## 🎯 Features Implementation

### Authentication System
- **OAuth2-style Authentication** with user selection
- **Session Persistence** using Expo Secure Store
- **Automatic Token Validation** and refresh
- **Secure Logout** with token cleanup

### Movie Discovery
- **Trending Movies** - Weekly trending content
- **Popular Movies** - Current popular titles
- **Top Rated Movies** - Highest rated films
- **Upcoming Movies** - Soon-to-be-released films

### Search & Filtering
- **Real-time Search** with debounced API calls
- **Search Result Management** with Redux state
- **Empty State Handling** for no results

### Favorites Management
- **Toggle Favorites** with heart icon interaction
- **Persistent Favorites** stored in Redux state
- **Favorites List View** with grid layout
- **Bulk Clear Functionality** for favorites

### Movie Details
- **Comprehensive Movie Information** (rating, runtime, budget, etc.)
- **High-quality Images** with fallback handling
- **Production Companies** and cast information
- **Favorite Toggle** from details screen

## 🔐 OAuth2 Authentication Flow

### Implementation Details
The app implements a simplified OAuth2-style authentication:

1. **User Selection** - Choose from predefined user accounts
2. **Token Generation** - Simulate OAuth2 token creation
3. **Secure Storage** - Store tokens using Expo Secure Store
4. **Session Management** - Automatic login/logout handling
5. **Token Validation** - Check token expiry (24-hour limit)

### Authentication States
- **Loading** - During authentication process
- **Authenticated** - User logged in with valid token
- **Unauthenticated** - No valid session
- **Error** - Authentication failure handling

## 📊 API Integration

### TMDB API Endpoints Used
- `GET /trending/movie/week` - Trending movies
- `GET /movie/popular` - Popular movies  
- `GET /movie/top_rated` - Top rated movies
- `GET /movie/upcoming` - Upcoming movies
- `GET /search/movie` - Search movies
- `GET /movie/{id}` - Movie details

### Data Caching Strategy
- **RTK Query Caching** - Automatic response caching
- **Tag-based Invalidation** - Smart cache updates
- **Background Refetching** - Keep data fresh
- **Error Handling** - Graceful API failure management

## 🎨 UI/UX Design

### Design Principles
- **Dark Theme** - Professional dark color scheme
- **Consistent Typography** - Clear hierarchy and readability
- **Intuitive Navigation** - Easy-to-use tab and stack navigation
- **Responsive Layout** - Adapts to different screen sizes
- **Smooth Animations** - Polished user interactions

### Color Palette
```typescript
colors: {
  background: '#000000',    // Primary background
  surface: '#111111',       // Card backgrounds
  card: '#1a1a1a',         // Component backgrounds
  border: '#333333',        // Border colors
  text: '#ffffff',          // Primary text
  textSecondary: '#b3b3b3', // Secondary text
  accent: '#FF6B35',        // Brand accent color
}
```

## 🧪 Testing & Debugging

### Development Tools
- **Expo Development Build** - Native debugging capabilities
- **Redux DevTools** - State debugging and time-travel
- **React Native Debugger** - Component inspection
- **TypeScript Checking** - Compile-time error detection

### Error Handling
- **API Error Handling** - Graceful failure management
- **Network Error Recovery** - Retry mechanisms
- **User-friendly Error Messages** - Clear error communication
- **Loading States** - Progress indicators throughout

## 📦 Build & Deployment

### Development Build
```bash
# Start development server
npx expo start

# Run on iOS
npx expo start --ios

# Run on Android  
npx expo start --android
```

### Production Build
```bash
# Build for iOS
npx expo build:ios

# Build for Android
npx expo build:android

# Create APK for testing
npx expo build:android --type apk
```

### Environment Configuration
```bash
# Development
EXPO_PUBLIC_ENV=development

# Production
EXPO_PUBLIC_ENV=production
EXPO_PUBLIC_TMDB_API_KEY=your_production_api_key
```

## 🔍 Code Quality

### TypeScript Implementation
- **Strict Type Checking** - Full TypeScript coverage
- **Interface Definitions** - Clear data structure types
- **Generic Types** - Reusable component typing
- **Enum Usage** - Type-safe constants

### Code Organization
- **Component Separation** - Single responsibility principle
- **Custom Hooks** - Reusable logic extraction
- **Utility Functions** - Helper function organization
- **Consistent Naming** - Clear variable and function names

### Performance Optimizations
- **React.memo** - Prevent unnecessary re-renders
- **useMemo/useCallback** - Expensive computation caching
- **Image Optimization** - Lazy loading and caching
- **Bundle Optimization** - Code splitting where applicable

## 🚀 Future Enhancements

### Potential Features
- **User Reviews** - Add/view movie reviews
- **Watchlist** - Separate watchlist from favorites
- **Social Features** - Share movies with friends
- **Offline Mode** - Cache movies for offline viewing
- **Push Notifications** - New movie alerts
- **Biometric Authentication** - Fingerprint/Face ID login

### Technical Improvements
- **Unit Testing** - Jest and React Native Testing Library
- **E2E Testing** - Detox or Maestro integration
- **Performance Monitoring** - Flipper or Sentry integration
- **Accessibility** - Enhanced screen reader support
- **Internationalization** - Multi-language support

## 🤝 Contributing

### Development Guidelines
1. Follow TypeScript strict mode
2. Use Redux Toolkit patterns
3. Implement error boundaries
4. Add loading states for async operations
5. Write self-documenting code
6. Use consistent component patterns

### Code Style
- **ESLint Configuration** - Expo recommended rules
- **Prettier Integration** - Consistent code formatting
- **Import Organization** - Grouped and sorted imports
- **Component Structure** - Props, state, effects, render

## 📄 License

This project is developed as a technical examination for RBS Software Solutions and is intended for evaluation purposes.
