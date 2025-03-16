// app/components/product/ProductCardSkeleton.tsx
import { Skeleton } from '~/components/ui/Skeleton';
import { Card, CardContent, CardFooter } from '~/components/ui/Card';

export function ProductCardSkeleton() {
  return (
    <Card>
      <div className="overflow-hidden rounded-t-lg">
        <Skeleton className="h-64 w-full" />
      </div>
      <CardContent className="p-4">
        <Skeleton className="mb-2 h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <Skeleton className="h-6 w-20" />
      </CardFooter>
    </Card>
  );
}