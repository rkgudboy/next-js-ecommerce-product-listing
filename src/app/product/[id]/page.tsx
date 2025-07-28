import type { Metadata } from 'next';
import { productService } from '@/services/productService';
import ProductPageClient from '@/components/product/product-page-client';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: paramId } = await params;
  const id = parseInt(paramId);
  
  try {
    const products = await productService.getProducts();
    const product = products.find(p => p.id === id);
    
    if (!product) {
      return {
        title: `Product Not Found | ${process.env.NEXT_PUBLIC_STORE_NAME || ""} Store`,
        description: "Browse our product catalogue and shop online",
      };
    }
    
    return {
      title: `${product.title} | ${process.env.NEXT_PUBLIC_STORE_NAME || ""} Store`,
      description: product.description,
    };
  } catch (error) {
    return {
      title: `${process.env.NEXT_PUBLIC_STORE_NAME || ""} Store`,
      description: "Browse our product catalogue and shop online",
    };
  }
}

export default async function ProductPage({ params }: Props) {
  const { id: paramId } = await params;
  const id = parseInt(paramId);
  let initialProduct = null;
  
  try {
    const products = await productService.getProducts();
    initialProduct = products.find(p => p.id === id) || null;
  } catch (error) {
    console.error('Error fetching product for SSR:', error);
  }
  
  return <ProductPageClient productId={paramId} initialProduct={initialProduct} />;
}