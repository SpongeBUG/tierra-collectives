// app/routes/_index.tsx
import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { MainLayout } from "~/components/layout/MainLayout";
import { ProductGrid } from "~/components/product/ProductGrid";
import { FeaturedCollections } from "~/components/home/FeaturedCollections";
import { HeroSection } from "~/components/home/HeroSection";
import { FadeIn } from "~/components/ui/animation/FadeIn";
import { SlideIn } from "~/components/ui/animation/SlideIn";
import { Button } from "~/components/ui/Button";
import { SustainabilityIcon, FairTradeIcon, CraftsmanshipIcon, StarIcon } from '~/components/icons';
import productService from "~/services/product.server";
import collectionService from "~/services/collection.server";
import type { Product, Collection } from "~/types";

export const meta: MetaFunction = () => {
  return [
    { title: "Tierra Collectives - Handcrafted Products" },
    { name: "description", content: "Discover our curated collection of handcrafted products from artisans around the world." },
  ];
};

type LoaderData = {
  products: Product[];
  collections: Collection[];
  error?: string;
};

export const loader: LoaderFunction = async () => {
  // Fetch featured products
  const productsResponse = await productService.getAllProducts(8);
  
  // Fetch collections
  const collectionsResponse = await collectionService.getAllCollections(4);
  
  if (productsResponse.error || collectionsResponse.error) {
    console.error("Error fetching data:", productsResponse.error || collectionsResponse.error);
    return json<LoaderData>({ 
      products: [], 
      collections: [],
      error: "Failed to load data. Please try again later." 
    });
  }
  
  return json<LoaderData>({ 
    products: productsResponse.data.products, 
    collections: collectionsResponse.data.collections
  });
};

export default function Index() {
  const { products, collections, error } = useLoaderData<LoaderData>();
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <HeroSection 
        title="Tierra Collectives"
        subtitle="Discover the beauty of handcrafted products from artisans around the world. Each piece tells a story of tradition and craftsmanship."
        buttonText="Explore Collection"
        buttonLink="#featured-products"
        // Uncomment and set a real video URL when available
        // videoSrc="https://example.com/path/to/hero-video.mp4"
        imageSrc="https://images.unsplash.com/photo-1617806118233-18e1de247200?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2662&q=80"
      />
      
      {/* Values Section */}
      <section className="bg-background py-16 md:py-24">
        <div className="container-custom">
          <FadeIn>
            <h2 className="mb-12 text-center font-serif text-3xl font-bold md:text-4xl">Our Values</h2>
          </FadeIn>
          <div className="grid gap-8 md:grid-cols-3">
            <SlideIn direction="up" delay={100}>
              <div className="rounded-lg border border-border bg-background p-8 text-center shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-terracotta/10">
                  <SustainabilityIcon className="h-8 w-8 text-terracotta" />
                </div>
                <h3 className="mb-3 font-serif text-xl font-semibold">Sustainability</h3>
                <p className="text-muted-foreground">
                  We ensure all our products are created with environmentally responsible materials and processes.
                </p>
              </div>
            </SlideIn>
            
            <SlideIn direction="up" delay={200}>
              <div className="rounded-lg border border-border bg-background p-8 text-center shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-terracotta/10">
                  <FairTradeIcon className="h-8 w-8 text-terracotta" />
                </div>
                <h3 className="mb-3 font-serif text-xl font-semibold">Fair Trade</h3>
                <p className="text-muted-foreground">
                  We believe in fair compensation and ethical treatment for all artisans in our global network.
                </p>
              </div>
            </SlideIn>
            
            <SlideIn direction="up" delay={300}>
              <div className="rounded-lg border border-border bg-background p-8 text-center shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-terracotta/10">
                  <CraftsmanshipIcon className="h-8 w-8 text-terracotta" />
                </div>
                <h3 className="mb-3 font-serif text-xl font-semibold">Craftsmanship</h3>
                <p className="text-muted-foreground">
                  We celebrate traditional techniques and the unique character of handmade goods.
                </p>
              </div>
            </SlideIn>
          </div>
        </div>
      </section>
      
      {/* Featured Collections Section */}
      {collections.length > 0 && (
        <FeaturedCollections 
          collections={collections}
          title="Explore Our Collections"
          subtitle="Discover curated collections of handcrafted goods from around the world"
        />
      )}
      
      {/* Featured Products Section */}
      <section id="featured-products" className="bg-muted/30 py-16 md:py-24">
        <div className="container-custom">
          {error ? (
            <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          ) : (
            <>
              <FadeIn>
                <div className="mb-12 text-center">
                  <h2 className="mb-4 font-serif text-3xl font-bold md:text-4xl">Featured Products</h2>
                  <p className="mx-auto max-w-2xl text-muted-foreground">
                    Each product is handcrafted with attention to detail and carries the unique story of its creator.
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={200}>
                <ProductGrid products={products} className="animate-fade-in" />
              </FadeIn>
              <div className="mt-12 text-center">
                <Button 
                  variant="outline" 
                  className="bg-background border-terracotta text-terracotta hover:bg-terracotta hover:text-ivory"
                  asChild
                >
                  <a href="/products">View All Products</a>
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
      
      {/* Artisan Stories Section */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <FadeIn>
            <div className="mb-12 text-center">
              <h2 className="mb-4 font-serif text-3xl font-bold md:text-4xl">Artisan Stories</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Meet the incredible artisans behind our products and learn about their craft, heritage, and passion.
              </p>
            </div>
          </FadeIn>
          
          <div className="grid gap-8 md:grid-cols-2">
            <SlideIn direction="left">
              <div className="group overflow-hidden rounded-lg shadow-md">
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1604869515882-4d10fa4b0492?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2100&q=80" 
                    alt="Ceramic artisan at work" 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-offblack/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-ivory">
                    <h3 className="mb-2 font-serif text-xl font-bold">Maria Rodriguez</h3>
                    <p className="mb-4">Ceramic Artist, Mexico</p>
                    <Button 
                      className="bg-beige text-offblack hover:bg-beige-dark"
                      asChild
                    >
                      <a href="/artisans/maria-rodriguez">Read Her Story</a>
                    </Button>
                  </div>
                </div>
              </div>
            </SlideIn>
            
            <SlideIn direction="right">
              <div className="group overflow-hidden rounded-lg shadow-md">
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1594642175367-82730ffc3a63?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2100&q=80" 
                    alt="Textile weaver at loom" 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-offblack/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-ivory">
                    <h3 className="mb-2 font-serif text-xl font-bold">Arun Patel</h3>
                    <p className="mb-4">Master Weaver, India</p>
                    <Button 
                      className="bg-beige text-offblack hover:bg-beige-dark"
                      asChild
                    >
                      <a href="/artisans/arun-patel">Read His Story</a>
                    </Button>
                  </div>
                </div>
              </div>
            </SlideIn>
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              variant="outline" 
              className="bg-background border-terracotta text-terracotta hover:bg-terracotta hover:text-ivory"
              asChild
            >
              <a href="/artisans">Meet All Artisans</a>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container-custom">
          <FadeIn>
            <div className="mb-12 text-center">
              <h2 className="mb-4 font-serif text-3xl font-bold md:text-4xl">What Our Customers Say</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Discover why our customers love Tierra Collectives products and our commitment to quality.
              </p>
            </div>
          </FadeIn>
          
          <div className="grid gap-8 md:grid-cols-3">
            <SlideIn direction="up" delay={100}>
              <div className="rounded-lg border border-border bg-background p-8 shadow-sm">
                <div className="mb-4 flex justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 overflow-hidden rounded-full bg-muted">
                      <img 
                        src="https://randomuser.me/api/portraits/women/44.jpg" 
                        alt="Emily Johnson" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium">Emily Johnson</h4>
                      <p className="text-sm text-muted-foreground">New York, USA</p>
                    </div>
                  </div>
                  <div className="flex text-beige">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon key={star} className="h-5 w-5" />
                    ))}
                  </div>
                </div>
                <p className="italic text-muted-foreground">
                  "The craftsmanship of my ceramic vase is impeccable. I love knowing the story behind who made it and how it supports their community."
                </p>
              </div>
            </SlideIn>
            
            <SlideIn direction="up" delay={200}>
              <div className="rounded-lg border border-border bg-background p-8 shadow-sm">
                <div className="mb-4 flex justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 overflow-hidden rounded-full bg-muted">
                      <img 
                        src="https://randomuser.me/api/portraits/men/32.jpg" 
                        alt="Marcus Chen" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium">Marcus Chen</h4>
                      <p className="text-sm text-muted-foreground">Toronto, Canada</p>
                    </div>
                  </div>
                  <div className="flex text-beige">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon key={star} className="h-5 w-5" />
                    ))}
                  </div>
                </div>
                <p className="italic text-muted-foreground">
                  "Every piece I've purchased has been unique and of exceptional quality. The textiles are simply gorgeous and elevate my home decor."
                </p>
              </div>
            </SlideIn>
            
            <SlideIn direction="up" delay={300}>
              <div className="rounded-lg border border-border bg-background p-8 shadow-sm">
                <div className="mb-4 flex justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 overflow-hidden rounded-full bg-muted">
                      <img 
                        src="https://randomuser.me/api/portraits/women/68.jpg" 
                        alt="Sophia Martinez" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium">Sophia Martinez</h4>
                      <p className="text-sm text-muted-foreground">Barcelona, Spain</p>
                    </div>
                  </div>
                  <div className="flex text-beige">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon key={star} className="h-5 w-5" />
                    ))}
                  </div>
                </div>
                <p className="italic text-muted-foreground">
                  "I appreciate how Tierra Collectives connects me with global artisans. The wooden bowls I purchased are not just functional but works of art."
                </p>
              </div>
            </SlideIn>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section with Background */}
      <section className="relative py-16 md:py-24">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1604014363564-87a4d8a42af2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Artisan workshop" 
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-offblack/80 to-offblack/60"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="mx-auto max-w-2xl rounded-xl bg-background/10 backdrop-blur-sm p-8 md:p-10 border border-white/10 shadow-xl text-center text-ivory">
            <FadeIn>
              <h2 className="mb-4 font-serif text-3xl font-bold md:text-4xl">Join Our Community</h2>
              <p className="mb-6">
                Subscribe to our newsletter to receive updates on new arrivals, artisan stories, and exclusive offers.
              </p>
            </FadeIn>
            <FadeIn delay={200}>
              <form className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-2 sm:space-y-0">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full rounded-md border border-ivory/20 bg-offblack/30 px-4 py-3 text-ivory placeholder:text-ivory/60 focus:border-beige focus:outline-none focus:ring-2 focus:ring-beige/50 sm:w-auto sm:flex-1"
                  required
                />
                <Button 
                  type="submit" 
                  className="w-full bg-beige text-offblack hover:bg-beige-dark sm:w-auto"
                >
                  Subscribe
                </Button>
              </form>
              <p className="mt-4 text-sm text-ivory/80">
                By subscribing, you agree to our Privacy Policy and consent to receive our newsletters.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}