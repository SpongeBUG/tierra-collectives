// app/components/layout/MobileMenuDrawer.tsx
import { Fragment, useState } from 'react';
import { Link } from '@remix-run/react';
import { Dialog, Transition } from '@headlessui/react';
import { Menu, X, ShoppingBag, User, Search, Heart, Sun, Moon, Home, Grid3X3, Info, Mail } from 'lucide-react';
import { useDarkMode } from '~/hooks/useDarkMode';
import { cn } from '~/lib/utils';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenuDrawer({ isOpen, onClose }: MobileMenuDrawerProps) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [searchQuery, setSearchQuery] = useState('');
  
  const links = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Collections', href: '/collections', icon: Grid3X3 },
    { name: 'Products', href: '/products', icon: ShoppingBag },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Contact', href: '/contact', icon: Mail },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, redirect to search page with query
    // history.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    onClose();
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-offblack/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start justify-end text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-x-full"
              enterTo="opacity-100 translate-x-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-x-0"
              leaveTo="opacity-0 translate-x-full"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden bg-background text-left align-middle shadow-xl transition-all h-screen flex flex-col">
                {/* Header with search */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between mb-4">
                    <Dialog.Title as="h3" className="text-xl font-serif font-medium">
                      Menu
                    </Dialog.Title>
                    <button
                      type="button"
                      className="p-2 rounded-full hover:bg-muted transition-colors"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close menu</span>
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  
                  {/* Search bar */}
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full rounded-md border border-border bg-background p-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta"
                    />
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </form>
                </div>

                {/* Main navigation */}
                <div className="flex-1 overflow-y-auto p-4">
                  <nav className="space-y-1">
                    {links.map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.name}
                          to={link.href}
                          className="flex items-center px-2 py-3 rounded-md text-base font-medium hover:bg-muted transition-colors"
                          onClick={onClose}
                        >
                          <Icon className="mr-3 h-5 w-5 text-muted-foreground" />
                          {link.name}
                        </Link>
                      );
                    })}
                  </nav>
                  
                  <div className="mt-8 border-t border-border pt-6">
                    <h4 className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Account
                    </h4>
                    <div className="mt-3 space-y-1">
                      <Link 
                        to="/account" 
                        className="flex items-center px-2 py-3 rounded-md text-base font-medium hover:bg-muted transition-colors"
                        onClick={onClose}
                      >
                        <User className="mr-3 h-5 w-5 text-muted-foreground" />
                        My Account
                      </Link>
                      
                      <Link 
                        to="/wishlist" 
                        className="flex items-center px-2 py-3 rounded-md text-base font-medium hover:bg-muted transition-colors"
                        onClick={onClose}
                      >
                        <Heart className="mr-3 h-5 w-5 text-muted-foreground" />
                        Wishlist
                      </Link>
                      
                      <Link 
                        to="/cart" 
                        className="flex items-center px-2 py-3 rounded-md text-base font-medium hover:bg-muted transition-colors"
                        onClick={onClose}
                      >
                        <ShoppingBag className="mr-3 h-5 w-5 text-muted-foreground" />
                        Cart
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Footer with theme switch */}
                <div className="border-t border-border p-4">
                  <button 
                    onClick={toggleDarkMode}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md p-3 text-base font-medium transition-colors",
                      "hover:bg-muted"
                    )}
                  >
                    <div className="flex items-center">
                      {isDarkMode ? (
                        <Sun className="mr-3 h-5 w-5 text-beige" />
                      ) : (
                        <Moon className="mr-3 h-5 w-5 text-muted-foreground" />
                      )}
                      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </div>
                    
                    <div 
                      className={cn(
                        "h-6 w-12 rounded-full p-1 transition-colors",
                        isDarkMode ? "bg-beige" : "bg-muted"
                      )}
                    >
                      <div 
                        className={cn(
                          "h-4 w-4 rounded-full bg-background transition-transform",
                          isDarkMode ? "translate-x-6" : "translate-x-0"
                        )}
                      ></div>
                    </div>
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}