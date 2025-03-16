// app/components/layout/Header.tsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from '@remix-run/react';
import { ShoppingCart, Search, Menu, Moon, Sun, X } from 'lucide-react';
import { Button } from '~/components/ui/Button';
import { useCart } from '~/context/CartContext';
import { MobileMenuDrawer } from './MobileMenuDrawer';
import { useDarkMode } from '~/hooks/useDarkMode';
import { cn } from '~/lib/utils';

interface HeaderProps {
  className?: string;
}

export function Header({ className = '' }: HeaderProps) {
  const { cart, toggleCart } = useCart();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  
  // Listen for scroll events to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initialize on first render
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchExpanded(false);
  }, [location.pathname]);
  
  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, redirect to search page with query
    // history.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsSearchExpanded(false);
  };
  
  return (
    <header 
      className={cn(
        "sticky top-0 z-40 w-full border-b transition-all duration-300",
        isScrolled 
          ? "border-border/80 bg-background/95 backdrop-blur" 
          : "border-transparent bg-transparent",
        className
      )}
    >
      <div className="container-custom flex h-16 items-center justify-between">
        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden p-2 rounded-md hover:bg-muted/80 transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-serif font-bold">Tierra Collectives</span>
          </Link>
          <nav className="hidden md:flex md:gap-6">
            <Link 
              to="/collections" 
              className="text-sm font-medium transition-colors hover:text-terracotta"
            >
              Collections
            </Link>
            <Link 
              to="/products" 
              className="text-sm font-medium transition-colors hover:text-terracotta"
            >
              Products
            </Link>
            <Link 
              to="/about" 
              className="text-sm font-medium transition-colors hover:text-terracotta"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-sm font-medium transition-colors hover:text-terracotta"
            >
              Contact
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button 
            className="p-2 rounded-full hover:bg-muted/80 transition-colors"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          
          {/* Search */}
          <div className="relative">
            {isSearchExpanded ? (
              <form 
                onSubmit={handleSearchSubmit}
                className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center rounded-md border border-border bg-background/80 backdrop-blur-sm overflow-hidden transition-all duration-300"
                style={{ width: isSearchExpanded ? '240px' : '40px' }}
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-3 py-2 bg-transparent text-sm focus:outline-none"
                  autoFocus
                />
                <button 
                  type="button" 
                  className="p-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsSearchExpanded(false)}
                  aria-label="Close search"
                >
                  <X className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsSearchExpanded(true)}
                aria-label="Search"
                className="hover:bg-muted/80"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            )}
          </div>
          
          {/* Cart */}
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleCart} 
              className="relative hover:bg-muted/80"
              aria-label={`Cart with ${cart.itemCount} items`}
            >
              <ShoppingCart className="h-5 w-5" />
              {cart.itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-xs font-medium text-white">
                  {cart.itemCount}
                </span>
              )}
            </Button>
            {cart.itemCount > 0 && (
              <Link 
                to="/cart"
                className="ml-2 hidden text-sm font-medium hover:text-terracotta transition-colors md:block"
              >
                {cart.subtotal}
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Drawer */}
      <MobileMenuDrawer 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </header>
  );
}