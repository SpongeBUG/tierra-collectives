// app/components/layout/MainLayout.tsx
import { ReactNode, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollToTopButton } from '~/components/ui/ScrollToTopButton';
import { useDarkMode } from '~/hooks/useDarkMode';
import { cn } from '~/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function MainLayout({ children, className = '', fullWidth = false }: MainLayoutProps) {
  const { isLoaded } = useDarkMode();
  
  // Effect to enable smooth scrolling
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <div className={cn(
      `flex min-h-screen flex-col bg-background text-foreground font-sans transition-colors duration-300`,
      !isLoaded && 'opacity-0', // Hide content until dark mode is loaded to prevent flash
      className
    )}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}