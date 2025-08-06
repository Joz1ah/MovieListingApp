# Movie Listing App - API Credentials & Configuration

> **RBS Software Solutions Technical Examination**  
> **Confidential Documentation for Development Use**

## 🔐 OAuth2 Authentication Configuration

### Mock OAuth2 Credentials
For this technical examination, we're using a simplified OAuth2 implementation with predefined user accounts:

```typescript
// Authentication Configuration
const OAUTH2_CONFIG = {
  clientId: 'movieapp_client_2024',
  clientSecret: 'exam_secret_rbs_solutions',
  redirectUri: 'movielistingapp://auth/callback',
  scope: 'read:movies write:favorites',
  grantType: 'authorization_code'
};

// Predefined User Accounts (OAuth2 Style)
const MOCK_USERS = [
  {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo'
  },
  {
    id: '2', 
    email: 'test@gmail.com',
    name: 'Test User',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test'
  },
  {
    id: '3',
    email: 'user@movieapp.com', 
    name: 'Movie Lover',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=movielover'
  }
];
```

### OAuth2 Flow Implementation
```typescript
// Token Generation
const generateToken = (userId: string): string => {
  return `oauth2_token_${userId}_${Date.now()}_${Math.random().toString(36)}`;
};

// Token Validation
const validateToken = (token: string): boolean => {
  // Simulated token validation logic
  return token.startsWith('oauth2_token_') && token.length > 30;
};
```

## 🎬 The Movie Database (TMDB) API

### Primary API Configuration
```typescript
const TMDB_CONFIG = {
  baseURL: 'https://api.themoviedb.org/3',
  apiKey: 'df782bc195e54779c69a7940d5d88471',
  imageBaseURL: 'https://image.tmdb.org/t/p/',
  imageSizes: {
    poster: 'w500',
    backdrop: 'w1280',
    profile: 'w185'
  }
};
```

### API Rate Limits
- **Requests per second:** 40
- **Daily requests:** 1,000,000
- **Authentication:** API Key based
- **HTTPS Required:** Yes

### Required API Endpoints

#### 1. Trending Movies
```http
GET /trending/movie/week?api_key={api_key}
```
**Description:** Get trending movies for the current week
**Response:** MovieResponse with trending movies array

#### 2. Popular Movies
```http
GET /movie/popular?api_key={api_key}
```
**Description:** Get list of popular movies
**Response:** MovieResponse with popular movies array

#### 3. Top Rated Movies
```http
GET /movie/top_rated?api_key={api_key}
```
**Description:** Get top rated movies of all time
**Response:** MovieResponse with top rated movies array

#### 4. Upcoming Movies
```http
GET /movie/upcoming?api_key={api_key}
```
**Description:** Get upcoming movie releases
**Response:** MovieResponse with upcoming movies array

#### 5. Search Movies
```http
GET /search/movie?api_key={api_key}&query={search_term}
```
**Description:** Search for movies by title
**Parameters:**
- `query` (required): Search term
- `page` (optional): Page number (default: 1)

#### 6. Movie Details
```http
GET /movie/{movie_id}?api_key={api_key}
```
**Description:** Get detailed information about a specific movie
**Parameters:**
- `movie_id` (required): TMDB movie ID

### Image URLs Configuration
```typescript
// Image URL Construction
const getImageURL = (path: string, size: string = 'w500'): string => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Usage Examples
const posterURL = getImageURL(movie.poster_path, 'w500');
const backdropURL = getImageURL(movie.backdrop_path, 'w1280');
```

## 📊 API Response Schemas

### MovieResponse Interface
```typescript
interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}
```

### Movie Interface
```typescript
interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}
```

### MovieDetails Interface (Extended)
```typescript
interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number | null;
  budget: number;
  revenue: number;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string | null;
  homepage: string | null;
  imdb_id: string | null;
}
```

## 🔧 Environment Variables

### Development Configuration
```bash
# .env.development
EXPO_PUBLIC_ENV=development
EXPO_PUBLIC_API_BASE_URL=https://api.themoviedb.org/3
EXPO_PUBLIC_TMDB_API_KEY=df782bc195e54779c69a7940d5d88471
EXPO_PUBLIC_IMAGE_BASE_URL=https://image.tmdb.org/t/p/
EXPO_PUBLIC_ENABLE_LOGGING=true
```

### Production Configuration
```bash
# .env.production
EXPO_PUBLIC_ENV=production
EXPO_PUBLIC_API_BASE_URL=https://api.themoviedb.org/3
EXPO_PUBLIC_TMDB_API_KEY=your_production_api_key
EXPO_PUBLIC_IMAGE_BASE_URL=https://image.tmdb.org/t/p/
EXPO_PUBLIC_ENABLE_LOGGING=false
```

## 🛡️ Security Configuration

### API Key Security
```typescript
// For production apps, implement secure API key handling
const getAPIKey = (): string => {
  if (__DEV__) {
    return 'df782bc195e54779c69a7940d5d88471'; // Development key
  }
  
  // In production, fetch from secure storage or backend
  return process.env.EXPO_PUBLIC_TMDB_API_KEY || '';
};
```

### Token Storage Security
```typescript
// Using Expo Secure Store for token persistence
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'oauth_token';
const USER_KEY = 'user_data';

export const secureStorage = {
  async setToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },
  
  async getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  },
  
  async removeToken(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
};
```

## 📱 Platform-Specific Configuration

### iOS Configuration
```json
// app.json - iOS specific settings
{
  "expo": {
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.rbssolutions.movielistingapp",
      "buildNumber": "1.0.0"
    }
  }
}
```

### Android Configuration
```json
// app.json - Android specific settings
{
  "expo": {
    "android": {
      "package": "com.rbssolutions.movielistingapp",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#000000"
      }
    }
  }
}
```

## 🚀 Deployment Configuration

### Expo Application Services (EAS)
```json
// eas.json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

## 📋 Testing Configuration

### API Testing Credentials
```typescript
// For testing purposes
const TEST_CONFIG = {
  mockAPI: {
    enabled: __DEV__,
    delay: 1000, // Simulate network delay
    errorRate: 0.1 // 10% chance of error for testing
  },
  
  testUsers: [
    { id: 'test1', email: 'test1@example.com', name: 'Test User 1' },
    { id: 'test2', email: 'test2@example.com', name: 'Test User 2' }
  ]
};
```
