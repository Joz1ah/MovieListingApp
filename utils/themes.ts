export const theme = {
    colors: {
      // Dark theme colors
      background: '#000000',
      surface: '#111111',
      card: '#1a1a1a',
      border: '#333333',
      
      // Gradient colors (white to pink to blue)
      gradientStart: '#ffffff',
      gradientMid: '#ff6b9d',
      gradientEnd: '#4ecdc4',
      
      // Text colors
      text: '#ffffff',
      textSecondary: '#b3b3b3',
      textMuted: '#666666',
      
      // Status colors
      success: '#10dc60',
      warning: '#ffce00',
      error: '#f04141',
      
      // Special
      overlay: 'rgba(0, 0, 0, 0.8)',
      shadow: 'rgba(0, 0, 0, 0.3)',
    },
    
    gradients: {
      primary: ['#ffffff', '#ff6b9d', '#4ecdc4'],
      secondary: ['#ff6b9d', '#4ecdc4'],
      accent: ['#4ecdc4', '#45b7d1'],
      header: ['#111111', '#1a1a1a'],
    },
    
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    
    borderRadius: {
      sm: 6,
      md: 12,
      lg: 16,
      xl: 20,
    },
    
    shadows: {
      small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
      },
    },
  };