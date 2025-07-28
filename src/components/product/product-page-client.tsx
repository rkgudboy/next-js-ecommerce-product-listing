'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { useProducts } from '@/contexts/ProductsContext';
import { Gallery } from '@/components/product/gallery';
import { ProductDescription } from '@/components/product/product-description';
import Grid from '@/components/grid';
import ProductGridItems from '@/components/layout/product-grid-items';
import Loading from '@/components/ui/loading';
import Link from 'next/link';

interface ProductPageClientProps {
  productId: string;
  initialProduct: Product | null;
}

export default function ProductPageClient({ productId, initialProduct }: ProductPageClientProps) {
  const router = useRouter();
  const { state } = useProducts();
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    console.log('Product page effect:', { 
      productId, 
      productsLength: state.products.length, 
      loading: state.loading,
      error: state.error 
    });
    
    // If there's an error or if we're still loading and no products yet, redirect to home
    if (!hasRedirected && (state.error || (state.loading && state.products.length === 0))) {
      console.log('Redirecting to homepage - products not loaded yet');
      setHasRedirected(true);
      router.push('/?redirected=true');
      return;
    }
    
    // If products are loaded, try to find the current product
    if (productId && state.products.length > 0) {
      const id = parseInt(productId);
      const currentProduct = state.products.find(p => p.id === id);
      
      console.log('Looking for product ID:', id, 'Found:', !!currentProduct);
      
      if (currentProduct) {
        setProduct(currentProduct);
        
        // Get related products from same category
        const related = state.products
          .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
          .slice(0, 4);
        setRelatedProducts(related);
      } else if (!initialProduct) {
        // Product not found after products are loaded
        setProduct(null);
      }
    }
  }, [productId, state, router, hasRedirected, initialProduct]);

  // Scroll to top when product is loaded
  useEffect(() => {
    if (product) {
      window.scrollTo(0, 0);
    }
  }, [product]);

  // If we're still loading products, show loading
  if (state.loading) {
    return <Loading message="Redirecting to homepage..." />;
  }

  // If no products loaded (shouldn't happen if redirect works), redirect
  if (state.products.length === 0) {
    router.push('/');
    return null;
  }

  // If products loaded but specific product not found, show 404  
  if (state.products.length > 0 && product === null) {
    return (
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Product Not Found
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              The product you're looking for doesn't exist.
            </p>
            <Link 
              href="/"
              className="rounded-full bg-blue-600 px-8 py-4 text-lg font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If we don't have a product yet, show loading
  if (!product) {
    return <Loading message="Loading product..." />;
  }

  return (
    <div className="mx-auto max-w-screen-2xl px-4">
      <nav className="flex gap-2 py-4 text-sm" aria-label="Breadcrumb">
        <Link href="/" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
          Home
        </Link>
        <span className="text-neutral-600 dark:text-neutral-400">/</span>
        <Link href="/products" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
          Products
        </Link>
        <span className="text-neutral-600 dark:text-neutral-400">/</span>
        <span className="text-neutral-900 dark:text-neutral-100">{product.title}</span>
      </nav>

      <div className="mx-auto max-w-screen-2xl">
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <Gallery
              images={[{
                src: product.image,
                altText: product.title
              }]}
            />
          </div>

          <div className="basis-full lg:basis-2/6">
            <ProductDescription product={product} />
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="py-8">
            <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
            <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <ProductGridItems products={relatedProducts} />
            </Grid>
          </div>
        )}
      </div>
    </div>
  );
}