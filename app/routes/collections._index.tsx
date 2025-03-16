// app/routes/collections._index.tsx
import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import { MainLayout } from '~/components/layout/MainLayout';
import { Card, CardContent } from '~/components/ui/Card';
import { FadeIn } from '~/components/ui/animation/FadeIn';
import collectionService from '~/services/collection.server';
import type { Collection } from '~/types';

export const meta: MetaFunction = () => {
  return [
    { title: 'Collections | Tierra Collectives' },
    { name: 'description', content: 'Browse our curated collections of handcrafted products.' },
  ];
};

type LoaderData = {
  collections: Collection[];
  error?: string;
};

export const loader: LoaderFunction = async () => {
  const response = await collectionService.getAllCollections();
  
  if (response.error) {
    console.error("Error fetching collections:", response.error);
    return json<LoaderData>({ 
      collections: [], 
      error: "Failed to load collections. Please try again later." 
    });
  }
  
  return json<LoaderData>({ collections: response.data.collections });
};

export default function Collections() {
  const { collections, error } = useLoaderData<LoaderData>();
  
  return (
    <MainLayout>
      <div className="container-custom py-12">
        <FadeIn>
          <h1 className="mb-8 text-3xl font-bold">Our Collections</h1>
          <p className="mb-10 text-lg text-muted-foreground max-w-3xl">
            Discover our curated collections, each telling a unique story of craftsmanship and tradition from artisans around the world.
          </p>
        </FadeIn>
        
        {error ? (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <FadeIn key={collection.id} delay={100 * (collections.indexOf(collection) % 3)}>
                <Link 
                  to={`/collections/${collection.handle}`}
                  className="group block"
                >
                  <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="aspect-[3/2] relative w-full overflow-hidden">
                      {collection.image ? (
                        <img
                          src={collection.image.url}
                          alt={collection.image.altText || collection.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                          <p className="text-muted-foreground">Collection Image</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-offblack/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h2 className="text-2xl font-bold text-ivory font-serif">{collection.title}</h2>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-muted-foreground line-clamp-2">{collection.description}</p>
                      <div className="mt-3">
                        <span className="text-sm font-medium text-terracotta group-hover:underline">
                          Explore Collection →
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}