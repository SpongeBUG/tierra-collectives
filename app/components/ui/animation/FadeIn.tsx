// app/components/ui/animation/FadeIn.tsx
import { ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '~/lib/utils';

interface FadeInProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
}

export function FadeIn({ 
  children, 
  duration = 700, 
  delay = 0, 
  className = '',
  threshold = 0.1,
  once = true
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = domRef.current;
    if (!current) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { threshold }
    );

    observer.observe(current);
    
    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [threshold, once]);

  return (
    <div
      ref={domRef}
      className={cn(
        'transition-opacity',
        isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
}
