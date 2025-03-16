// app/types/collection.ts
import type { Product } from './product';

export interface Collection {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  image: {
    id: string;
    url: string;
    altText: string | null;
    width: number;
    height: number;
  } | null;
  products: Product[];
  updatedAt: string;
}