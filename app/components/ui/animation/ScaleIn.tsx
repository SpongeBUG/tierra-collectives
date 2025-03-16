// app/components/ui/animation/ScaleIn.tsx
import { ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '~/lib/utils';

interface ScaleInProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
  threshold?: number;
  scale?: number;
}

export function ScaleIn({ 
  children, 
  duration = 700, 
  delay = 0, 
  className = '',
  threshold = 0.1,
  scale = 0.95
}: ScaleInProps) {
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
            observer.unobserve(entry.target);
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
  }, [threshold]);

  return (
    <div
      ref={domRef}
      className={cn(
        'transition-all',
        isVisible ? 'opacity-100 scale-100' : `opacity-0 scale-${scale * 100}`,
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionProperty: 'opacity, transform'
      }}
    >
      {children}
    </div>
  );
}