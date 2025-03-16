// app/components/product/ProductDetailSkeleton.tsx
import { Skeleton } from '~/components/ui/Skeleton';
import { MainLayout } from '~/components/layout/MainLayout';

export function ProductDetailSkeleton() {
  return (
    <MainLayout>
      <div className="container mx-auto py-12">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Product Images Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-96 w-full rounded-lg" />
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-24 w-24 flex-shrink-0 rounded-md" />
              ))}
            </div>
          </div>
          
          {/* Product Details Skeleton */}
          <div className="space-y-6">
            <div>
              <Skeleton className="mb-2 h-10 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
            </div>
            
            <Skeleton className="h-8 w-32" />
            
            <div>
              <Skeleton className="mb-2 h-5 w-24" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 3 }, (_, i) => (
                  <Skeleton key={i} className="h-8 w-20 rounded-md" />
                ))}
              </div>
            </div>
            
            <div>
              <Skeleton className="mb-2 h-5 w-24" />
              <Skeleton className="h-10 w-20 rounded-md" />
            </div>
            
            <Skeleton className="h-12 w-full rounded-md" />
            
            <div>
              <Skeleton className="mb-4 h-6 w-36" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}