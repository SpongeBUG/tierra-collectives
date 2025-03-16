// app/routes/$404.tsx
import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { MainLayout } from '~/components/layout/MainLayout';
import { Button } from '~/components/ui/Button';

export const meta: MetaFunction = () => {
  return [
    { title: 'Page Not Found | Tierra Collectives' },
    { name: 'description', content: 'The page you were looking for could not be found.' },
  ];
};

export default function NotFound() {
  return (
    <MainLayout>
      <div className="container mx-auto py-20 text-center">
        <h1 className="mb-4 text-5xl font-bold">404</h1>
        <h2 className="mb-8 text-2xl font-medium">Page Not Found</h2>
        <p className="mx-auto mb-8 max-w-md text-gray-600">
          The page you were looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    </MainLayout>
  );
}