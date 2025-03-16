// app/routes/about.tsx
import type { MetaFunction } from '@remix-run/node';
import { MainLayout } from '~/components/layout/MainLayout';

export const meta: MetaFunction = () => {
  return [
    { title: 'About Us | Tierra Collectives' },
    { name: 'description', content: 'Learn about our mission and the artisans behind Tierra Collectives.' },
  ];
};

export default function About() {
  return (
    <MainLayout>
      <div className="container mx-auto py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-8 text-4xl font-bold">About Tierra Collectives</h1>
          
          <div className="mb-12 overflow-hidden rounded-lg">
            <img 
              src="https://via.placeholder.com/1200x600" 
              alt="Tierra Collectives Artisans" 
              className="h-auto w-full object-cover"
            />
          </div>
          
          <div className="prose prose-lg max-w-none">
            <h2>Our Mission</h2>
            <p>
              Tierra Collectives was founded with a simple yet powerful mission: to connect artisans from around the world with people who appreciate handcrafted quality and cultural heritage.
            </p>
            
            <p>
              We believe in preserving traditional craftsmanship while providing sustainable livelihoods for skilled artisans. Each product in our collection tells a story of cultural heritage, meticulous attention to detail, and the human connection that's often missing in mass-produced goods.
            </p>
            
            <h2>Our Artisans</h2>
            <p>
              We work directly with over 200 artisans from 30 countries, creating a global network of makers who share their unique cultural heritage through their craft. From textile weavers in Peru to ceramic artists in Japan, our artisans represent diverse traditions that have been passed down through generations.
            </p>
            
            <p>
              By purchasing from Tierra Collectives, you're not just acquiring a beautiful object—you're supporting a sustainable ecosystem that values fair wages, ethical production, and the preservation of traditional crafts.
            </p>
            
            <h2>Sustainability Commitment</h2>
            <p>
              Sustainability is at the core of everything we do. We ensure that all our products are made using environmentally responsible materials and processes. We minimize waste, use recycled and biodegradable packaging, and continuously seek ways to reduce our carbon footprint.
            </p>
            
            <p>
              Our commitment extends beyond environmental concerns to encompass social responsibility. We ensure fair compensation for our artisans and invest in their communities through education and infrastructure projects.
            </p>
            
            <h2>Our Team</h2>
            <p>
              Tierra Collectives is led by a diverse team of individuals passionate about global craftsmanship and sustainable business practices. With backgrounds ranging from anthropology to design, our team brings together a wealth of experience and a shared commitment to our mission.
            </p>
            
            <p>
              We invite you to join us in celebrating the beauty of handcrafted goods and supporting the artisans who create them.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}