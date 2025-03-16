// app/routes/about.tsx
import type { MetaFunction } from '@remix-run/node';
import { MainLayout } from '~/components/layout/MainLayout';
import { FadeIn } from '~/components/ui/animation/FadeIn';
import { SlideIn } from '~/components/ui/animation/SlideIn';
import { SustainabilityIcon, FairTradeIcon, CraftsmanshipIcon } from '~/components/icons';

export const meta: MetaFunction = () => {
  return [
    { title: 'About Us | Tierra Collectives' },
    { name: 'description', content: 'Learn about our mission and the artisans behind Tierra Collectives. Discover our commitment to sustainability, fair trade, and preserving traditional craftsmanship.' },
  ];
};

export default function About() {
  return (
    <MainLayout>
      {/* Hero Section with Parallax Effect */}
      <div className="relative h-[60vh] overflow-hidden bg-offblack">
        <div className="absolute inset-0 h-full w-full">
          <img 
            src="https://images.unsplash.com/photo-1528283648649-33347faa5d9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Artisan craftspeople" 
            className="h-full w-full object-cover transform scale-110"
            id="parallax-hero"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-offblack/60 via-offblack/40 to-offblack/80"></div>
        </div>
        
        <div className="relative flex h-full w-full items-center">
          <div className="container-custom">
            <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight text-ivory md:text-5xl lg:text-6xl">
              About Tierra Collectives
            </h1>
            <p className="max-w-2xl text-xl text-ivory/80">
              Connecting artisans with those who value the beauty and story behind handcrafted goods.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-offblack">
        <div className="container-custom">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <SlideIn direction="left">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Our Mission</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p>
                  Tierra Collectives was founded with a simple yet powerful mission: to connect artisans from around the world with people who appreciate handcrafted quality and cultural heritage.
                </p>
                
                <p>
                  We believe in preserving traditional craftsmanship while providing sustainable livelihoods for skilled artisans. Each product in our collection tells a story of cultural heritage, meticulous attention to detail, and the human connection that's often missing in mass-produced goods.
                </p>
              </div>
            </SlideIn>
            
            <SlideIn direction="right">
              <div className="rounded-xl overflow-hidden shadow-lg transform hover:scale-[1.03] transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1611048267451-e6ed903d4a38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80" 
                  alt="Artisan at work" 
                  className="w-full h-auto"
                />
              </div>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-ivory dark:bg-offblack-light">
        <div className="container-custom">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-center">Our Values</h2>
            <p className="text-xl text-center text-muted-foreground max-w-3xl mx-auto mb-16">
              Our commitment to quality craftsmanship, environmental responsibility, and fair trade drives everything we do.
            </p>
          </FadeIn>
          
          <div className="grid gap-8 md:grid-cols-3">
            <SlideIn direction="up" delay={100}>
              <div className="rounded-lg border border-border bg-background p-8 text-center shadow-md transition-transform duration-300 hover:-translate-y-2">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-terracotta/10">
                  <SustainabilityIcon className="h-8 w-8 text-terracotta" />
                </div>
                <h3 className="mb-3 font-serif text-xl font-semibold">Sustainability</h3>
                <p className="text-muted-foreground">
                  Sustainability is at the core of everything we do. We ensure that all our products are made using environmentally responsible materials and processes. We minimize waste, use recycled and biodegradable packaging, and continuously seek ways to reduce our carbon footprint.
                </p>
              </div>
            </SlideIn>
            
            <SlideIn direction="up" delay={200}>
              <div className="rounded-lg border border-border bg-background p-8 text-center shadow-md transition-transform duration-300 hover:-translate-y-2">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-terracotta/10">
                  <FairTradeIcon className="h-8 w-8 text-terracotta" />
                </div>
                <h3 className="mb-3 font-serif text-xl font-semibold">Fair Trade</h3>
                <p className="text-muted-foreground">
                  Our commitment extends beyond environmental concerns to encompass social responsibility. We ensure fair compensation for our artisans and invest in their communities through education and infrastructure projects. By purchasing from Tierra Collectives, you're supporting a sustainable ecosystem.
                </p>
              </div>
            </SlideIn>
            
            <SlideIn direction="up" delay={300}>
              <div className="rounded-lg border border-border bg-background p-8 text-center shadow-md transition-transform duration-300 hover:-translate-y-2">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-terracotta/10">
                  <CraftsmanshipIcon className="h-8 w-8 text-terracotta" />
                </div>
                <h3 className="mb-3 font-serif text-xl font-semibold">Craftsmanship</h3>
                <p className="text-muted-foreground">
                  We celebrate traditional techniques and the unique character of handmade goods. Each product in our collection represents skills that have been passed down through generations, preserving cultural heritage and artistic expression in every piece we offer.
                </p>
              </div>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* Artisans Section with Image Grid */}
      <section className="py-16 md:py-24 bg-white dark:bg-offblack">
        <div className="container-custom">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <SlideIn direction="left">
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1605883705077-8d3d583737f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80" 
                  alt="Ceramic artist" 
                  className="rounded-lg w-full h-auto transform transition-transform duration-500 hover:scale-105"
                />
                <img 
                  src="https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80" 
                  alt="Textile weaver" 
                  className="rounded-lg w-full h-auto transform transition-transform duration-500 hover:scale-105 mt-8"
                />
                <img 
                  src="https://images.unsplash.com/photo-1486946255434-2466348c2166?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80" 
                  alt="Woodworker" 
                  className="rounded-lg w-full h-auto transform transition-transform duration-500 hover:scale-105"
                />
                <img 
                  src="https://images.unsplash.com/photo-1529066792305-5e1cc3b2d8de?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80" 
                  alt="Jewelry maker" 
                  className="rounded-lg w-full h-auto transform transition-transform duration-500 hover:scale-105 mt-8"
                />
              </div>
            </SlideIn>
            
            <SlideIn direction="right">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Our Artisans</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p>
                  We work directly with over 200 artisans from 30 countries, creating a global network of makers who share their unique cultural heritage through their craft. From textile weavers in Peru to ceramic artists in Japan, our artisans represent diverse traditions that have been passed down through generations.
                </p>
                
                <p>
                  By purchasing from Tierra Collectives, you're not just acquiring a beautiful object—you're supporting a sustainable ecosystem that values fair wages, ethical production, and the preservation of traditional crafts.
                </p>
                
                <p>
                  Each artisan brings their own unique perspective, technique, and cultural heritage to their work, resulting in products that are not only beautiful but also meaningful.
                </p>
              </div>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-ivory dark:bg-offblack-light">
        <div className="container-custom">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-center">Our Team</h2>
            <p className="text-xl text-center text-muted-foreground max-w-3xl mx-auto mb-16">
              A diverse team of passionate individuals dedicated to our mission of connecting artisans with appreciative customers worldwide.
            </p>
          </FadeIn>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: "Elena Morales",
                role: "Founder & CEO",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                bio: "With a background in anthropology and design, Elena founded Tierra Collectives to celebrate global craftsmanship."
              },
              {
                name: "David Lin",
                role: "Chief Creative Officer",
                image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                bio: "David brings 15 years of experience in product design and development to our artisan collaborations."
              },
              {
                name: "Amara Okafor",
                role: "Artisan Relations",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                bio: "Amara works directly with our artisan partners to ensure fair practices and sustainable partnerships."
              },
              {
                name: "Miguel Santiago",
                role: "Sustainability Director",
                image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                bio: "Miguel leads our sustainability initiatives, ensuring our environmental impact is minimized at every step."
              }
            ].map((member, index) => (
              <SlideIn key={member.name} direction="up" delay={100 * index}>
                <div className="group rounded-lg overflow-hidden bg-background border border-border shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-semibold">{member.name}</h3>
                    <p className="text-terracotta font-medium mb-2">{member.role}</p>
                    <p className="text-muted-foreground">{member.bio}</p>
                  </div>
               </div>
              </SlideIn>
            ))}
          </div>
        </div>
      </section>
      
      {/* Join Us Section */}
      <section className="relative py-24">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1631125915902-d9afa4353e56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Artisan workshop" 
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-offblack/70"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-2xl mx-auto text-center text-ivory">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Join Our Movement</h2>
            <p className="text-xl mb-8">
              We invite you to join us in celebrating the beauty of handcrafted goods and supporting the artisans who create them.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="/collections" 
                className="bg-terracotta hover:bg-terracotta-dark text-ivory px-8 py-3 rounded-md font-medium transition-all duration-300 hover:shadow-lg"
              >
                Explore Collections
              </a>
              <a 
                href="/contact" 
                className="bg-transparent border-2 border-ivory text-ivory hover:bg-ivory/10 px-8 py-3 rounded-md font-medium transition-all duration-300 hover:shadow-lg"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}