import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const themes = {
  light: {
    name: 'light',
    colors: {
      primary: '#6366f1',      // Modern indigo
      secondary: '#8b5cf6',    // Vibrant violet
      accent: '#e879f9',       // Bright magenta
      background: '#ffffff',   // Pure white
      surface: '#f8fafc',      // Very light gray
      surfaceHover: '#f1f5f9', // Light gray on hover
      text: '#0f172a',         // Dark slate
      textSecondary: '#475569', // Medium slate
      textMuted: '#94a3b8',    // Light slate
      border: '#e2e8f0',       // Very light border
      borderHover: '#cbd5e1',  // Light border on hover
      success: '#10b981',      // Emerald green
      warning: '#f59e0b',      // Amber
      error: '#ef4444',        // Red
      info: '#3b82f6',         // Blue
      card: '#ffffff',         // Card background
      cardHover: '#f9fafb'     // Card hover state
    },
    gradients: {
      primary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      secondary: 'linear-gradient(135deg, #8b5cf6 0%, #e879f9 100%)',
      hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      mesh: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)'
    },
    shadows: {
      xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      glow: '0 0 20px rgba(99, 102, 241, 0.3)'
    }
  },
  dark: {
    name: 'dark',
    colors: {
      primary: '#6366f1',      // Same modern indigo
      secondary: '#8b5cf6',    // Same vibrant violet
      accent: '#e879f9',       // Same bright magenta
      background: '#0f172a',   // Very dark slate
      surface: '#1e293b',      // Dark slate
      surfaceHover: '#334155', // Medium dark slate
      text: '#f1f5f9',         // Very light slate
      textSecondary: '#cbd5e1', // Light slate
      textMuted: '#64748b',    // Medium slate
      border: '#334155',       // Dark border
      borderHover: '#475569',  // Medium border on hover
      success: '#10b981',      // Same emerald green
      warning: '#f59e0b',      // Same amber
      error: '#ef4444',        // Same red
      info: '#3b82f6',         // Same blue
      card: '#1e293b',         // Dark card background
      cardHover: '#334155'     // Card hover state
    },
    gradients: {
      primary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      secondary: 'linear-gradient(135deg, #8b5cf6 0%, #e879f9 100%)',
      hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      mesh: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)'
    },
    shadows: {
      xs: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
      sm: '0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)',
      soft: '0 2px 15px -3px rgba(0, 0, 0, 0.4), 0 10px 20px -2px rgba(0, 0, 0, 0.3)',
      glow: '0 0 20px rgba(99, 102, 241, 0.4)'
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  const [systemPreference, setSystemPreference] = useState('light');

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPreference(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e) => {
      setSystemPreference(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply theme to document
  useEffect(() => {
    const theme = currentTheme === 'system' ? systemPreference : currentTheme;
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(theme);
    
    // Update CSS custom properties
    const themeConfig = themes[theme];
    Object.entries(themeConfig.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    Object.entries(themeConfig.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });

    Object.entries(themeConfig.gradients).forEach(([key, value]) => {
      root.style.setProperty(`--gradient-${key}`, value);
    });
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.content = themeConfig.colors.background;
    }
  }, [currentTheme, systemPreference]);

  const setTheme = (theme) => {
    setCurrentTheme(theme);
    if (theme === 'system') {
      localStorage.removeItem('theme');
    } else {
      localStorage.setItem('theme', theme);
    }
  };

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const getTheme = () => {
    const actualTheme = currentTheme === 'system' ? systemPreference : currentTheme;
    return themes[actualTheme];
  };

  const isDark = () => {
    const actualTheme = currentTheme === 'system' ? systemPreference : currentTheme;
    return actualTheme === 'dark';
  };

  const value = {
    currentTheme,
    systemPreference,
    theme: getTheme(),
    isDark: isDark(),
    setTheme,
    toggleTheme,
    themes
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
