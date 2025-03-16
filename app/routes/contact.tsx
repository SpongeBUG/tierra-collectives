// app/routes/contact.tsx
import { useState } from 'react';
import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { MainLayout } from '~/components/layout/MainLayout';
import { Button } from '~/components/ui/Button';

export const meta: MetaFunction = () => {
  return [
    { title: 'Contact Us | Tierra Collectives' },
    { name: 'description', content: 'Get in touch with the Tierra Collectives team.' },
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
  const urlParams = new URLSearchParams(window.location.search);
  const showSuccessMessage = urlParams.get('success') === 'true';

  return (
    <MainLayout>
      <div className="container mx-auto py-12">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-8 text-3xl font-bold">Contact Us</h1>
          
          {showSuccessMessage ? (
            <div className="mb-8 rounded-md bg-green-50 p-4 text-green-700">
              <p className="text-lg font-medium">Thank you for your message!</p>
              <p>We've received your inquiry and will get back to you as soon as possible.</p>
            </div>
          ) : (
            <>
              <p className="mb-8 text-lg text-gray-600">
                Have a question about our products or interested in working with us? 
                Fill out the form below, and we'll get back to you as soon as possible.
              </p>
              
              {actionData?.errors?.general && (
                <div className="mb-6 rounded-md bg-red-50 p-4 text-red-700">
                  <p>{actionData.errors.general}</p>
                </div>
              )}
              
              <Form 
                method="post" 
                className="space-y-6"
                onSubmit={() => setIsSubmitting(true)}
              >
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`w-full rounded-md border ${
                      actionData?.errors?.name ? 'border-red-500' : 'border-gray-300'
                    } px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                  />
                  {actionData?.errors?.name && (
                    <p className="mt-1 text-sm text-red-500">{actionData.errors.name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`w-full rounded-md border ${
                      actionData?.errors?.email ? 'border-red-500' : 'border-gray-300'
                    } px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                  />
                  {actionData?.errors?.email && (
                    <p className="mt-1 text-sm text-red-500">{actionData.errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className={`w-full rounded-md border ${
                      actionData?.errors?.message ? 'border-red-500' : 'border-gray-300'
                    } px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                  ></textarea>
                  {actionData?.errors?.message && (
                    <p className="mt-1 text-sm text-red-500">{actionData.errors.message}</p>
                  )}
                </div>
                
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </Form>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}