export const theme = {
  colors: {
    // Primary colors
    primary: {
      main: '#6D28D9', // Deep purple
      light: '#8B5CF6',
      dark: '#5B21B6',
    },
    // Secondary colors for different categories
    categories: {
      data: {
        main: '#2563EB', // Blue
        light: '#3B82F6',
        dark: '#1D4ED8',
      },
      mobile: {
        main: '#059669', // Emerald
        light: '#10B981',
        dark: '#047857',
      },
      blockchain: {
        main: '#F7931A', // Bitcoin orange
        light: '#FBAE42',
        dark: '#D97D0D',
      },
      data_analysis: {
        main: '#4A90E2',
        light: '#64A5E8',
        dark: '#2B5A8C'
      },
      visualization: {
        main: '#50E3C2',
        light: '#72E8D0',
        dark: '#2E8C77'
      },
      business_intel: {
        main: '#F5A623',
        light: '#F7B84B',
        dark: '#A66D15'
      },
      predictive: {
        main: '#B8E986',
        light: '#C9EEA3',
        dark: '#7A9B58'
      }
    },
    // Background colors
    background: {
      primary: '#0A0A0F',
      secondary: '#12121A'
    },
    // Text colors
    text: {
      primary: '#F8FAFC',
      secondary: '#CBD5E1',
      accent: '#94A3B8',
    },
  },
  // Animation settings
  animation: {
    defaultTransition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
    pageTransition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  // Gradients
  gradients: {
    primary: 'linear-gradient(to bottom right, #6D28D9, #2563EB)',
    glow: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.15), transparent 80%)',
    card: 'linear-gradient(to bottom right, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9))',
  },
}; 