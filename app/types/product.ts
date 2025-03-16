// app/types/product.ts
export interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface MoneyValue {
  amount: string;
  currencyCode: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: MoneyValue;
  compareAtPrice: MoneyValue | null;
  available: boolean;
  sku: string;
  requiresShipping: boolean;
  taxable: boolean;
  weight: number;
  weightUnit: string;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  tags: string[];
  vendor: string;
  images: ProductImage[];
  variants: ProductVariant[];
  availableForSale: boolean;
  createdAt: string;
  updatedAt: string;
}