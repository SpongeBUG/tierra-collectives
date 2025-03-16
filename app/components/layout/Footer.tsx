// app/components/layout/Footer.tsx
import { Link } from '@remix-run/react';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/Button';
import { cn } from '~/lib/utils';
import { FadeIn } from '~/components/ui/animation/FadeIn';

interface FooterProps {
  className?: string;
}

export function Footer({ className = '' }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, submit to newsletter service
    setIsSubscribed(true);
  };
  
  return (
    <footer className={cn(`border-t border-border bg-background`, className)}>
      <div className="container-custom py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Company Information */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-serif font-bold mb-4">Tierra Collectives</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Discover the beauty of handcrafted products from artisans around the world.
              Each piece tells a story of tradition and craftsmanship.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-terracotta transition-colors"
                aria-label="Tierra Collectives on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-terracotta transition-colors"
                aria-label="Tierra Collectives on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-terracotta transition-colors"
                aria-label="Tierra Collectives on Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-base font-medium mb-4 font-serif">Explore</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/collections" className="text-muted-foreground hover:text-terracotta transition-colors inline-flex items-center">
                  <ArrowRight className="mr-2 h-3 w-3 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-terracotta transition-colors inline-flex items-center">
                  <ArrowRight className="mr-2 h-3 w-3 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-terracotta transition-colors inline-flex items-center">
                  <ArrowRight className="mr-2 h-3 w-3 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-terracotta transition-colors inline-flex items-center">
                  <ArrowRight className="mr-2 h-3 w-3 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-terracotta transition-colors inline-flex items-center">
                  <ArrowRight className="mr-2 h-3 w-3 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h4 className="text-base font-medium mb-4 font-serif">Customer Service</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-terracotta transition-colors inline-flex items-center">
                  <ArrowRight className="mr-2 h-3 w-3 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-muted-foreground hover:text-terracotta transition-colors inline-flex items-center">
                  <ArrowRight className="mr-2 h-3 w-3 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-terracotta transition-colors inline-flex items-center">
                  <ArrowRight className="mr-2 h-3 w-3 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-terracotta transition-colors inline-flex items-center">
                  <ArrowRight className="mr-2 h-3 w-3 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Information */}
          <div>
            <h4 className="text-base font-medium mb-4 font-serif">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-terracotta flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  123 Artisan Way, Craftsville<br />
                  CA 94103, United States
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-terracotta flex-shrink-0" />
                <a 
                  href="tel:+14155551234" 
                  className="text-muted-foreground hover:text-terracotta transition-colors"
                >
                  +1 (415) 555-1234
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-terracotta flex-shrink-0" />
                <a 
                  href="mailto:hello@tierracollectives.com" 
                  className="text-muted-foreground hover:text-terracotta transition-colors"
                >
                  hello@tierracollectives.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Newsletter */}
        <FadeIn>
          <div className="border-t border-border mt-12 pt-12">
            <div className="max-w-md mx-auto text-center">
              <h4 className="text-lg font-medium mb-2 font-serif">Join Our Newsletter</h4>
              <p className="text-muted-foreground mb-4">
                Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
              </p>
              
              {isSubscribed ? (
                <div className="p-4 rounded-md bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                  <p>Thank you for subscribing to our newsletter!</p>
                </div>
              ) : (
                <form className="flex flex-col sm:flex-row gap-2" onSubmit={handleSubmit}>
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="flex-grow px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-terracotta"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button 
                    type="submit" 
                    className="bg-terracotta hover:bg-terracotta-dark text-ivory transition-colors py-2 px-6 rounded-md"
                  >
                    Subscribe
                  </Button>
                </form>
              )}
            </div>
          </div>
        </FadeIn>
        
        {/* Copyright */}
        <div className="border-t border-border mt-12 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Tierra Collectives. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}