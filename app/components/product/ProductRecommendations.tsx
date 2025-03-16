// app/components/product/ProductRecommendations.tsx
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '~/types';
import { ProductCard } from './ProductCard';
import { FadeIn } from '~/components/ui/animation/FadeIn';

interface ProductRecommendationsProps {
  currentProductId: string;
  currentProductTags: string[];
  allProducts: Product[];
  title?: string;
  maxItems?: number;
}

export function ProductRecommendations({
  currentProductId,
  currentProductTags,
  allProducts,
  title = "You May Also Like",
  maxItems = 4
}: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Find products with similar tags
  useEffect(() => {
    // Filter out the current product
    const otherProducts = allProducts.filter(
      product => product.id !== currentProductId
    );
    
    // Score each product based on tag similarity
    const scoredProducts = otherProducts.map(product => {
      // Count how many tags match
      const matchingTags = product.tags.filter(tag => 
        currentProductTags.includes(tag)
      ).length;
      
      // Give higher score to products with matching vendor or product type
      let score = matchingTags;
      
      return { product, score };
    });
    
    // Sort by score (highest first) and take the top N
    const topRecommendations = scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, maxItems)
      .map(item => item.product);
    
    // If we don't have enough recommendations, add random products
    if (topRecommendations.length < maxItems) {
      const needed = maxItems - topRecommendations.length;
      const randomProducts = otherProducts
        .filter(product => !topRecommendations.some(rec => rec.id === product.id))
        .sort(() => 0.5 - Math.random())  // Shuffle
        .slice(0, needed);
      
      topRecommendations.push(...randomProducts);
    }
    
    setRecommendations(topRecommendations);
  }, [currentProductId, currentProductTags, allProducts, maxItems]);
  
  // Scroll controls for mobile
  const scrollLeft = () => {
    if (!containerRef.current) return;
    containerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    updateScrollPosition();
  };
  
  const scrollRight = () => {
    if (!containerRef.current) return;
    containerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    updateScrollPosition();
  };
  
  const updateScrollPosition = () => {
    if (!containerRef.current) return;
    setScrollPosition(containerRef.current.scrollLeft);
  };
  
  // Don't render if there are no recommendations
  if (recommendations.length === 0) {
    return null;
  }
  
  // Check if we can scroll
  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = containerRef.current
    ? scrollPosition < containerRef.current.scrollWidth - containerRef.current.clientWidth
    : false;
  
  return (
    <div className="mt-16 border-t border-border pt-12">
      <FadeIn>
        <h2 className="mb-8 text-2xl font-serif font-bold">{title}</h2>
        
        <div className="relative">
          {/* Scroll Buttons (Only show on mobile) */}
          {canScrollLeft && (
            <button
              onClick={scrollLeft}
              className="absolute -left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background p-2 shadow-md border border-border hover:bg-muted transition-colors md:hidden"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          
          {canScrollRight && (
            <button
              onClick={scrollRight}
              className="absolute -right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background p-2 shadow-md border border-border hover:bg-muted transition-colors md:hidden"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
          
          {/* Products Container */}
          <div 
            ref={containerRef} 
            className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar md:grid md:grid-cols-2 lg:grid-cols-4"
            onScroll={updateScrollPosition}
          >
            {recommendations.map((product) => (
              <div key={product.id} className="w-64 flex-shrink-0 md:w-auto">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}