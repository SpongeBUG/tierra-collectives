// app/routes/contact.tsx
import { useState, useEffect } from 'react';
import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { MainLayout } from '~/components/layout/MainLayout';
import { Button } from '~/components/ui/Button';
import { FadeIn } from '~/components/ui/animation/FadeIn';
import { SlideIn } from '~/components/ui/animation/SlideIn';
import { Mail, Phone, MapPin } from 'lucide-react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Contact Us | Tierra Collectives' },
    { name: 'description', content: 'Get in touch with the Tierra Collectives team. We\'re here to help with any questions about our handcrafted products or artisan collaborations.' },
  ];
};

type ActionData = {
  success?: boolean;
  errors?: {
    name?: string;
    email?: string;
    message?: string;
    general?: string;
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  const errors: ActionData['errors'] = {};

  // Validate inputs
  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.name = 'Name is required';
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    errors.email = 'Valid email is required';
  }

  if (!message || typeof message !== 'string' || message.trim() === '') {
    errors.message = 'Message is required';
  }

  if (Object.keys(errors).length > 0) {
    return json<ActionData>({ errors });
  }

  try {
    // In a real implementation, you would send the email here
    // For now, we'll just simulate a successful submission
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Redirect to prevent form resubmission
    return redirect('/contact?success=true');
  } catch (error) {
    return json<ActionData>({ 
      errors: { 
        general: 'Failed to send message. Please try again later.' 
      } 
    });
  }
};

export default function Contact() {
  const actionData = useActionData<typeof action>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check for success query parameter
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const showSuccessMessage = urlParams.get('success') === 'true';

  return (
    <MainLayout>
      <div className="relative bg-offblack text-ivory py-24">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Artisan workshop background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-offblack via-transparent to-offblack"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <FadeIn>
            <h1 className="font-serif text-5xl font-bold mb-6 text-center">Contact Us</h1>
            <p className="text-xl max-w-3xl mx-auto text-center text-ivory/80">
              Have a question about our products or interested in working with us? Fill out the form below, and we'll get back to you as soon as possible.
            </p>
          </FadeIn>
        </div>
      </div>
      
      <div className="container-custom py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <SlideIn direction="left" className="h-full">
            <div className="bg-ivory/5 border border-terracotta/20 p-8 rounded-lg h-full">
              <h2 className="font-serif text-2xl font-semibold mb-8">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-terracotta flex-shrink-0 mt-1" />
                  <div className="ml-4">
                    <h3 className="font-medium text-lg">Visit Us</h3>
                    <p className="text-muted-foreground">
                      123 Artisan Way<br />
                      Craftsville, CA 94103<br />
                      United States
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-terracotta flex-shrink-0 mt-1" />
                  <div className="ml-4">
                    <h3 className="font-medium text-lg">Email Us</h3>
                    <p className="text-muted-foreground">
                      <a href="mailto:hello@tierracollectives.com" className="hover:text-terracotta transition-colors">
                        hello@tierracollectives.com
                      </a>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      We aim to respond within 24 hours
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-terracotta flex-shrink-0 mt-1" />
                  <div className="ml-4">
                    <h3 className="font-medium text-lg">Call Us</h3>
                    <p className="text-muted-foreground">
                      <a href="tel:+14155551234" className="hover:text-terracotta transition-colors">
                        +1 (415) 555-1234
                      </a>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Monday-Friday: 9am-5pm PST
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <h3 className="font-serif text-xl font-medium mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                     className="h-10 w-10 rounded-full bg-muted/10 flex items-center justify-center text-muted-foreground hover:bg-terracotta hover:text-ivory transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                     className="h-10 w-10 rounded-full bg-muted/10 flex items-center justify-center text-muted-foreground hover:bg-terracotta hover:text-ivory transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                     className="h-10 w-10 rounded-full bg-muted/10 flex items-center justify-center text-muted-foreground hover:bg-terracotta hover:text-ivory transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                  </a>
                  <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" 
                     className="h-10 w-10 rounded-full bg-muted/10 flex items-center justify-center text-muted-foreground hover:bg-terracotta hover:text-ivory transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12h8"/><path d="M12 8v8"/><circle cx="12" cy="12" r="10"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </SlideIn>
          
          <SlideIn direction="right">
            {showSuccessMessage ? (
              <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-8 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                </div>
                <h2 className="text-2xl font-serif font-bold text-green-700 dark:text-green-300 mb-2">Message Sent!</h2>
                <p className="text-green-600 dark:text-green-200 mb-6">
                  Thank you for reaching out to us. We've received your inquiry and will get back to you as soon as possible.
                </p>
                <Button 
                  asChild
                  variant="outline" 
                  className="border-green-500 text-green-600 hover:bg-green-50"
                >
                  <a href="/">Return to Home</a>
                </Button>
              </div>
            ) : (
              <div className="bg-white dark:bg-offblack-light rounded-lg shadow-lg p-8 border border-border">
                <h2 className="font-serif text-2xl font-semibold mb-6">Send a Message</h2>
                
                {actionData?.errors?.general && (
                  <div className="mb-6 rounded-md bg-red-50 dark:bg-red-900/20 p-4 text-red-600 dark:text-red-300">
                    <p>{actionData.errors.general}</p>
                  </div>
                )}
                
                <Form 
                  method="post" 
                  className="space-y-6"
                  onSubmit={() => setIsSubmitting(true)}
                >
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Your Name <span className="text-terracotta">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className={`w-full rounded-md border ${
                        actionData?.errors?.name ? 'border-red-500' : 'border-border'
                      } bg-background px-4 py-3 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta transition-colors`}
                      placeholder="Your full name"
                    />
                    {actionData?.errors?.name && (
                      <p className="mt-1 text-sm text-red-500">{actionData.errors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address <span className="text-terracotta">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={`w-full rounded-md border ${
                        actionData?.errors?.email ? 'border-red-500' : 'border-border'
                      } bg-background px-4 py-3 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta transition-colors`}
                      placeholder="your.email@example.com"
                    />
                    {actionData?.errors?.email && (
                      <p className="mt-1 text-sm text-red-500">{actionData.errors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message <span className="text-terracotta">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      className={`w-full rounded-md border ${
                        actionData?.errors?.message ? 'border-red-500' : 'border-border'
                      } bg-background px-4 py-3 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta transition-colors`}
                      placeholder="How can we help you? Let us know the details..."
                    ></textarea>
                    {actionData?.errors?.message && (
                      <p className="mt-1 text-sm text-red-500">{actionData.errors.message}</p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-terracotta hover:bg-terracotta-dark text-ivory py-3"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    By submitting this form, you agree to our <a href="/privacy" className="underline hover:text-terracotta">Privacy Policy</a>.
                  </p>
                </Form>
              </div>
            )}
          </SlideIn>
        </div>
      </div>
      
      {/* Google Map Section */}
      <div className="h-96 w-full bg-muted relative overflow-hidden">
        <img 
          src="https://via.placeholder.com/1600x400?text=Google+Map+Will+Be+Embedded+Here" 
          alt="Map location" 
          className="w-full h-full object-cover"
        />
      </div>
    </MainLayout>
  );
}