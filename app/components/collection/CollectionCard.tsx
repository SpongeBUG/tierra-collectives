// app/components/collection/CollectionCard.tsx
import { Link } from '@remix-run/react';
import { ChevronRight } from 'lucide-react';
import type { Collection } from '~/types';

interface CollectionCardProps {
  collection: Collection;
  className?: string;
}

export function CollectionCard({ collection, className = '' }: CollectionCardProps) {
  // Collection placeholder images based on collection name
  const getPlaceholderImage = (name: string) => {
    // Create a consistent hash from the collection name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash) + name.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // List of high-quality placeholder images
    const placeholders = [
      "https://images.unsplash.com/photo-1481437156560-3205f6a55735?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605883705077-8d3d583737f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1604014136283-d7a115655cb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1486946255434-2466348c2166?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ];
    
    // Select an image based on the hash
    const index = Math.abs(hash) % placeholders.length;
    return placeholders[index];
  };
  
  return (
    <Link
      to={`/collections/${collection.handle}`}
      className={`group block overflow-hidden rounded-xl transition-all hover:-translate-y-1 hover:shadow-xl ${className}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {collection.image ? (
          <img
            src={collection.image.url}
            alt={collection.image.altText || collection.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <img
            src={getPlaceholderImage(collection.title)}
            alt={`${collection.title} collection`}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
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
              <ChevronRight className="ml-1 h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}