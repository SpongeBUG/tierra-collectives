// app/types/api.ts
import type { Product } from './product';
import type { Collection } from './collection';

export interface ApiResponse<T> {
  data: T;
  status: number;
  error?: string;
}

export interface ProductsResponse {
  products: Product[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalCount: number;
}

export interface CollectionsResponse {
  collections: Collection[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalCount: number;
}

export interface ShopifyError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}