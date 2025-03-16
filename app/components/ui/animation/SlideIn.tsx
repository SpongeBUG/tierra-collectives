// app/components/ui/animation/SlideIn.tsx
import { ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '~/lib/utils';

type Direction = 'left' | 'right' | 'up' | 'down';

interface SlideInProps {
  children: ReactNode;
  direction?: Direction;
  duration?: number;
  delay?: number;
  distance?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
}

export function SlideIn({ 
  children, 
  direction = 'up', 
  duration = 700, 
  delay = 0,
  distance = 50,
  className = '',
  threshold = 0.1,
  once = true
}: SlideInProps) {
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

  const getTransformValue = () => {
    switch(direction) {
      case 'left':
        return `translateX(${isVisible ? 0 : -distance}px)`;
      case 'right':
        return `translateX(${isVisible ? 0 : distance}px)`;
      case 'up':
        return `translateY(${isVisible ? 0 : -distance}px)`;
      case 'down':
        return `translateY(${isVisible ? 0 : distance}px)`;
      default:
        return 'none';
    }
  };

  return (
    <div
      ref={domRef}
      className={cn(
        'transition-all',
        isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{
        transform: getTransformValue(),
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionProperty: 'opacity, transform'
      }}
    >
      {children}
    </div>
  );
}