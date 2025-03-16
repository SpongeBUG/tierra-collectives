// app/routes/collections.$handle.tsx
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { MainLayout } from '~/components/layout/MainLayout';
import { ProductGrid } from '~/components/product/ProductGrid';
import collectionService from '~/services/collection.server';
import type { Collection } from '~/types';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.collection) {
    return [
      { title: 'Collection Not Found | Tierra Collectives' },
      { name: 'description', content: 'The requested collection could not be found.' },
    ];
  }

  return [
    { title: `${data.collection.title} | Tierra Collectives` },
    { name: 'description', content: data.collection.description.substring(0, 160) },
  ];
};

type LoaderData = {
  collection: Collection | null;
  error?: string;
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { handle } = params;

  if (!handle) {
    return json<LoaderData>({ 
      collection: null, 
      error: 'Collection handle is required' 
    }, { status: 400 });
  }

  const response = await collectionService.getCollectionByHandle(handle);
  
  if (response.error || !response.data.collection) {
    console.error("Error fetching collection:", response.error);
    return json<LoaderData>({ 
      collection: null, 
      error: response.error || 'Collection not found' 
    }, { status: response.status });
  }
  
  return json<LoaderData>({ collection: response.data.collection });
};

export default function CollectionDetail() {
  const { collection, error } = useLoaderData<typeof loader>();
  
  if (error || !collection) {
    return (
      <MainLayout>
        <div className="container mx-auto py-12">
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-red-700">{error || 'Collection not found'}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-12">
        {/* Collection Header */}
        <div className="mb-12">
          {collection.image && (
            <div className="mb-8 h-64 w-full overflow-hidden rounded-lg md:h-96">
              <img
                src={collection.image.url}
                alt={collection.image.altText || collection.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <h1 className="mb-4 text-3xl font-bold">{collection.title}</h1>
          {collection.description && (
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: collection.descriptionHtml }} />
          )}
        </div>
        
        {/* Products */}
        <div>
          <h2 className="mb-6 text-2xl font-semibold">Products</h2>
          <ProductGrid products={collection.products} />
        </div>
      </div>
    </MainLayout>
  );
}