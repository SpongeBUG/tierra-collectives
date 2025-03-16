// app/components/home/FeaturedCollections.tsx
import { useRef, useState, useEffect } from 'react';
import { Link } from '@remix-run/react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import type { Collection } from '~/types';
import { FadeIn } from '~/components/ui/animation/FadeIn';
import { cn } from '~/lib/utils';

interface FeaturedCollectionsProps {
  collections: Collection[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function FeaturedCollections({
  collections,
  title = "Our Collections",
  subtitle = "Explore our curated collections of handcrafted products from around the world.",
  className = "",
}: FeaturedCollectionsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [scrollAmount, setScrollAmount] = useState(300);
  
  // Update scroll amount based on container width
  useEffect(() => {
    const updateScrollAmount = () => {
      if (scrollContainerRef.current) {
        const containerWidth = scrollContainerRef.current.offsetWidth;
        setScrollAmount(containerWidth * 0.75); // 75% of the container width
      }
    };
    
    updateScrollAmount();
    window.addEventListener('resize', updateScrollAmount);
    
    return () => {
      window.removeEventListener('resize', updateScrollAmount);
    };
  }, []);
  
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 20);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20); // 20px buffer
  };
  
  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  };
  
  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };
  
  if (!collections.length) {
    return null;
  }
  
  return (
    <section className={cn("bg-background py-16 md:py-24", className)}>
      <div className="container-custom">
        <FadeIn>
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-serif text-3xl font-bold md:text-4xl">{title}</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">{subtitle}</p>
          </div>
        </FadeIn>
        
        <div className="relative">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={scrollLeft}
              className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/90 p-3 shadow-md hover:bg-muted transition-colors md:left-0"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          
          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={scrollRight}
              className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/90 p-3 shadow-md hover:bg-muted transition-colors md:right-0"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
          
          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="hide-scrollbar -mx-4 flex snap-x overflow-x-auto px-4 pb-8 pt-4"
            onScroll={handleScroll}
          >
            {collections.map((collection) => (
              <Link
                key={collection.id}
                to={`/collections/${collection.handle}`}
                className="group mr-6 flex-shrink-0 overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl snap-start"
                style={{ width: 'calc(100% - 2rem)', maxWidth: '400px' }}
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  {collection.image ? (
                    <img
                      src={collection.image.url}
                      alt={collection.image.altText || collection.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <p className="text-muted-foreground">No image available</p>
                    </div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-offblack/80 via-transparent to-transparent"></div>
                  
                  {/* Collection Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-ivory">
                    <h3 className="mb-2 font-serif text-xl font-bold">{collection.title}</h3>
                    <p className="line-clamp-2 text-sm text-ivory/80">
                      {collection.description}
                    </p>
                    
                    <div className="mt-4 flex">
                      <span className="inline-flex items-center text-sm font-medium text-ivory/90 transition-colors group-hover:text-beige">
                        Explore Collection
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* View All Collections Button */}
        <div className="mt-10 text-center">
          <Link 
            to="/collections" 
            className="inline-flex items-center font-medium text-terracotta hover:text-terracotta-dark transition-colors"
          >
            View All Collections
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
      
      {/* Custom CSS for hiding scrollbar but allowing scroll */}
      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;  /* Chrome, Safari, Opera */
        }
      `}</style>
    </section>
  );
}