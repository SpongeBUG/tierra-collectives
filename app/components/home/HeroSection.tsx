// app/components/home/HeroSection.tsx
import { useEffect, useRef, useState } from 'react';
import { Link } from '@remix-run/react';
import { ArrowDown } from 'lucide-react';
import { Button } from '~/components/ui/Button';
import { cn } from '~/lib/utils';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  videoSrc?: string;
  imageSrc?: string;
  className?: string;
}

export function HeroSection({
  title = "Tierra Collectives",
  subtitle = "Discover the beauty of handcrafted products from artisans around the world. Each piece tells a story of tradition and craftsmanship.",
  buttonText = "Explore Collection",
  buttonLink = "#featured-products",
  videoSrc,
  imageSrc = "https://images.unsplash.com/photo-1617806118233-18e1de247200?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2662&q=80",
  className = "",
}: HeroSectionProps) {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  
  // Handle parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        // Only update parallax when hero section is in view
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setScrollY(window.scrollY);
          if (!isInView) setIsInView(true);
        } else {
          if (isInView) setIsInView(false);
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    // Initialize on first render
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isInView]);
  
  // Scroll to featured products section
  const handleExploreClick = () => {
    const featuredSection = document.getElementById('featured-products');
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <section
      ref={heroRef}
      className={cn("relative h-[90vh] w-full overflow-hidden", className)}
    >
      {/* Background Video or Image */}
      <div className="absolute inset-0 h-full w-full">
        {videoSrc ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
            style={{ transform: isInView ? `translateY(${scrollY * 0.25}px) scale(1.1)` : 'none' }}
          >
            <source src={videoSrc} type="video/mp4" />
            {/* Fallback image if video doesn't load */}
            <img
              src={imageSrc}
              alt="Tierra Collectives"
              className="h-full w-full object-cover"
            />
          </video>
        ) : (
          <img
            src={imageSrc}
            alt="Tierra Collectives"
            className="h-full w-full object-cover transition-transform duration-300"
            style={{ transform: isInView ? `translateY(${scrollY * 0.2}px) scale(1.1)` : 'none' }}
          />
        )}
        
        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-offblack/60 via-offblack/40 to-offblack/70"></div>
      </div>
      
      {/* Content */}
      <div className="relative flex h-full w-full items-center justify-center text-center">
        <div className="container mx-auto px-4">
          <div 
            className="mx-auto max-w-3xl opacity-0 transform translate-y-8 transition-all duration-1000"
            style={{ 
              opacity: isInView ? 1 : 0,
              transform: isInView ? 'translateY(0)' : 'translateY(2rem)',
              transitionDelay: '300ms'
            }}
          >
            <h1 
              className="mb-6 font-serif text-4xl font-bold tracking-tight text-ivory sm:text-5xl md:text-6xl"
              style={{ 
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              {title}
            </h1>
            
            <p 
              className="mx-auto mb-8 max-w-2xl text-lg text-ivory/90 sm:text-xl"
              style={{ 
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              {subtitle}
            </p>
            
            <div 
              className="opacity-0 transform translate-y-4 transition-all duration-1000"
              style={{ 
                opacity: isInView ? 1 : 0, 
                transform: isInView ? 'translateY(0)' : 'translateY(1rem)',
                transitionDelay: '600ms'
              }}
            >
              {buttonLink.startsWith('#') ? (
                <Button
                  onClick={handleExploreClick}
                  className="bg-terracotta hover:bg-terracotta-dark text-ivory transition-all duration-300 hover:shadow-lg"
                  size="lg"
                >
                  {buttonText}
                </Button>
              ) : (
                <Button
                  asChild
                  className="bg-terracotta hover:bg-terracotta-dark text-ivory transition-all duration-300 hover:shadow-lg"
                  size="lg"
                >
                  <Link to={buttonLink}>
                    {buttonText}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-ivory opacity-0 transition-opacity duration-1000"
        style={{ opacity: isInView ? 1 : 0, transitionDelay: '900ms' }}
      >
        <div className="flex flex-col items-center">
          <span className="mb-2 text-sm">Scroll to discover</span>
          <ArrowDown className="h-5 w-5 animate-bounce" />
        </div>
      </div>
    </section>
  );
}