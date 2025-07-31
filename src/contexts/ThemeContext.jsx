import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to 'system'
    const savedTheme = localStorage.getItem('invenai-theme');
    return savedTheme || 'system';
  });

  const [isDarkMode, setIsDarkMode] = useState(false);

  // Function to determine if system prefers dark mode
  const getSystemTheme = () => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  // Function to apply the actual theme
  const applyTheme = (newTheme) => {
    let shouldBeDark = false;
    
    if (newTheme === 'dark') {
      shouldBeDark = true;
    } else if (newTheme === 'system') {
      shouldBeDark = getSystemTheme();
    }
    // 'light' theme: shouldBeDark remains false
    
    setIsDarkMode(shouldBeDark);
    
    // Apply theme to document
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Function to change theme
  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('invenai-theme', newTheme);
    applyTheme(newTheme);
  };

  // Initialize theme on mount
  useEffect(() => {
    applyTheme(theme);
  }, []);

  // Listen for system theme changes when using 'system' mode
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const value = {
    theme,
    isDarkMode,
    changeTheme,
    toggleDarkMode: () => changeTheme(isDarkMode ? 'light' : 'dark')
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};