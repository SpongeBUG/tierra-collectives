// app/components/product/RecentlyViewed.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from '@remix-run/react';
import type { Product } from '~/types';
import { ProductCard } from './ProductCard';
import { SlideIn } from '~/components/ui/animation/SlideIn';

interface RecentlyViewedProps {
  currentProductId: string;
  maxItems?: number;
}

// Custom hook to manage recently viewed products
export function useRecentlyViewed(currentProductId: string, maxItems: number = 4) {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load recently viewed products from localStorage
    const loadRecentlyViewed = () => {
      try {
        const storedItems = localStorage.getItem('recentlyViewedProducts');
        let items: Product[] = storedItems ? JSON.parse(storedItems) : [];
        
        // Filter out the current product and keep only the latest items
        items = items
          .filter(item => item.id !== currentProductId)
          .slice(0, maxItems);
          
        setRecentlyViewed(items);
      } catch (error) {
        console.error('Failed to load recently viewed products:', error);
        setRecentlyViewed([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRecentlyViewed();
  }, [currentProductId, maxItems]);

  // Function to add a product to recently viewed
  const addToRecentlyViewed = (product: Product) => {
    try {
      const storedItems = localStorage.getItem('recentlyViewedProducts');
      let items: Product[] = storedItems ? JSON.parse(storedItems) : [];
      
      // Remove the product if it's already in the list
      items = items.filter(item => item.id !== product.id);
      
      // Add the product to the beginning of the list
      items.unshift(product);
      
      // Keep only the latest items
      items = items.slice(0, maxItems + 1); // +1 to account for current product
      
      // Save to localStorage
      localStorage.setItem('recentlyViewedProducts', JSON.stringify(items));
      
      // Update state (excluding current product)
      setRecentlyViewed(items.filter(item => item.id !== currentProductId).slice(0, maxItems));
    } catch (error) {
      console.error('Failed to save recently viewed product:', error);
    }
  };

  return { recentlyViewed, addToRecentlyViewed, isLoading };
}

export function RecentlyViewed({ currentProductId, maxItems = 4 }: RecentlyViewedProps) {
  const { recentlyViewed, isLoading } = useRecentlyViewed(currentProductId, maxItems);
  
  // Don't render if there are no recently viewed products or still loading
  if (isLoading || recentlyViewed.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 border-t border-border pt-12">
      <SlideIn direction="up">
        <h2 className="mb-8 text-2xl font-serif font-bold">Recently Viewed</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {recentlyViewed.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </SlideIn>
    </div>
  );
}