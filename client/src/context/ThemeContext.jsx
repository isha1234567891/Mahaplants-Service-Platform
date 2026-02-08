import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ThemeContext = createContext();

const initialState = {
  isDarkMode: localStorage.getItem('darkMode') === 'true' || false,
  isLoading: false
};

const themeReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_THEME':
      const newMode = !state.isDarkMode;
      localStorage.setItem('darkMode', newMode.toString());
      return {
        ...state,
        isDarkMode: newMode
      };
    
    case 'SET_THEME':
      localStorage.setItem('darkMode', action.payload.toString());
      return {
        ...state,
        isDarkMode: action.payload
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    default:
      return state;
  }
};

export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (state.isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.isDarkMode]);

  // Initialize theme on app load
  useEffect(() => {
    // Check for system preference if no saved preference
    if (!localStorage.getItem('darkMode')) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      dispatch({ type: 'SET_THEME', payload: prefersDark });
    }
  }, []);

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const setTheme = (isDark) => {
    dispatch({ type: 'SET_THEME', payload: isDark });
  };

  const setLoading = (isLoading) => {
    dispatch({ type: 'SET_LOADING', payload: isLoading });
  };

  const value = {
    isDarkMode: state.isDarkMode,
    isLoading: state.isLoading,
    toggleTheme,
    setTheme,
    setLoading
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