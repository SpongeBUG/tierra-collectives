// app/hooks/useDarkMode.ts
import { useState, useEffect } from 'react';

/**
 * A hook to manage dark mode state with system preference detection
 * and localStorage persistence
 */
export function useDarkMode() {
  // Initialize with null and set correct value after hydration
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Effect to initialize the dark mode state
  useEffect(() => {
    // Check if user has a stored preference
    const storedPreference = localStorage.getItem('tierraCollectives-theme');
    
    if (storedPreference) {
      // Use stored preference
      setIsDarkMode(storedPreference === 'dark');
    } else {
      // Otherwise, use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
    
    // Add listener for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if there's no stored preference
      if (!localStorage.getItem('tierraCollectives-theme')) {
        setIsDarkMode(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    setIsLoaded(true);
    
    // Clean up listener
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Effect to update document when dark mode changes
  useEffect(() => {
    if (isDarkMode === null) return; // Skip during initial hydration
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('tierraCollectives-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('tierraCollectives-theme', 'light');
    }
  }, [isDarkMode]);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return { 
    isDarkMode: isDarkMode ?? false, 
    toggleDarkMode,
    isLoaded
  };
}