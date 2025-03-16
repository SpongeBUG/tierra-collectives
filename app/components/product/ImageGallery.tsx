// app/components/product/ImageGallery.tsx
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, ExpandIcon, MinimizeIcon } from 'lucide-react';
import { Button } from '~/components/ui/Button';
import { cn } from '~/lib/utils';
import type { ProductImage } from '~/types';

interface ImageGalleryProps {
  images: ProductImage[];
  productTitle: string;
}

export function ImageGallery({ images, productTitle }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const currentImage = images[currentIndex];
  
  // Function to handle next image
  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);
  
  // Function to handle previous image
  const handlePrevious = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);
  
  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (isZoomed) setIsZoomed(false);
  };
  
  // Toggle zoom mode
  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };
  
  // Handle mouse move for zoom positioning
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };
  
  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  // Handle touch end for swipe gestures
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  };
  
  // Add keyboard navigation in fullscreen mode
  useEffect(() => {
    if (!isFullscreen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
      } else if (e.key === 'z') {
        toggleZoom();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen, handleNext, handlePrevious]);
  
  if (images.length === 0) {
    return (
      <div className="flex h-96 w-full items-center justify-center rounded-lg bg-muted">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div 
        className={cn(
          "relative overflow-hidden rounded-lg transition-all duration-300",
          isFullscreen ? "fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4" : "h-[500px] w-full"
        )}
      >
        {/* Close button for fullscreen mode */}
        {isFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="absolute right-4 top-4 z-10 rounded-full bg-offblack/40 p-2 text-ivory hover:bg-offblack/60 transition-colors"
            aria-label="Close fullscreen"
          >
            <X size={24} />
          </button>
        )}
        
        {/* The main image container */}
        <div
          className={cn(
            "relative h-full w-full cursor-zoom-in transition-all duration-300",
            isFullscreen && isZoomed ? "cursor-move" : "",
            isFullscreen && !isZoomed ? "max-h-[calc(100vh-8rem)] max-w-4xl mx-auto" : ""
          )}
          onClick={isFullscreen ? toggleZoom : toggleFullscreen}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            backgroundImage: `url(${currentImage.url})`,
            backgroundPosition: isZoomed ? `${zoomPosition.x}% ${zoomPosition.y}%` : "center",
            backgroundSize: isZoomed ? "200%" : "contain",
            backgroundRepeat: "no-repeat",
            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
          }}
        ></div>
        
        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 text-offblack shadow-md hover:bg-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 text-offblack shadow-md hover:bg-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
        
        {/* Fullscreen controls */}
        {!isFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="absolute bottom-4 right-4 z-10 rounded-full bg-white/80 p-2 text-offblack shadow-md hover:bg-white transition-colors"
            aria-label="View fullscreen"
          >
            <ExpandIcon size={18} />
          </button>
        )}
        
        {/* Zoom controls in fullscreen mode */}
        {isFullscreen && (
          <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-offblack/40 px-4 py-2 text-ivory">
            <button onClick={(e) => {
              e.stopPropagation();
              toggleZoom();
            }} className="flex items-center gap-2">
              {isZoomed ? (
                <>
                  <ZoomOut size={16} />
                  <span>Zoom Out</span>
                </>
              ) : (
                <>
                  <ZoomIn size={16} />
                  <span>Zoom In</span>
                </>
              )}
            </button>
          </div>
        )}
        
        {/* Image count indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 z-10 rounded-full bg-offblack/40 px-3 py-1 text-xs text-ivory">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
      
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "flex-shrink-0 overflow-hidden rounded-md border-2 transition-all duration-200",
                currentIndex === index 
                  ? "border-terracotta" 
                  : "border-transparent opacity-70 hover:opacity-100"
              )}
              aria-label={`View ${productTitle} image ${index + 1}`}
            >
              <img
                src={image.url}
                alt={image.altText || `${productTitle} image ${index + 1}`}
                className="h-20 w-20 object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}