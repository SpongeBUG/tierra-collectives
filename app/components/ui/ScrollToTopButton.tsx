// app/components/ui/ScrollToTopButton.tsx
import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '~/lib/utils';

interface ScrollToTopButtonProps {
  className?: string;
}

export function ScrollToTopButton({ className = '' }: ScrollToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Toggle visibility based on scroll position
  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', toggleVisibility);

    // Clean up
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-6 right-6 z-30 rounded-full p-3 shadow-lg transition-all duration-300",
        "bg-terracotta text-ivory hover:bg-terracotta-dark focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2",
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none',
        className
      )}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}