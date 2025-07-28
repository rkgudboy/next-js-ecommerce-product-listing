'use client';

import { useProducts } from '@/contexts/ProductsContext';
import { useSearchParams } from 'next/navigation';
import Grid from '@/components/grid';
import ProductGridItems from '@/components/layout/product-grid-items';
import CategoryFilter from '@/components/category-filter';
import Loading from '@/components/ui/loading';

export default function HomeContent() {
  const { state, filteredProducts } = useProducts();
  const searchParams = useSearchParams();
  const redirected = searchParams.get('redirected');

  if (state.loading) {
    return <Loading message="Loading products..." />;
  }

  if (state.error) {
    return (
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400">{state.error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-2xl px-4">
      {/* Welcome Header */}
      <div className="py-16 text-center">
        <h1 className="text-6xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-6">
          {process.env.NEXT_PUBLIC_STORE_NAME || ""} Store
        </h1>
        <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
          Welcome to our product catalogue. Browse our collection of high-quality products across different categories.
        </p>
      </div>

      {/* Category Filter */}
      <CategoryFilter />

      {/* Product Listing */}
      <section className="pb-24">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              {state.selectedCategory 
                ? `No products found in "${state.selectedCategory}" category.`
                : 'No products found.'
              }
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {state.selectedCategory 
                  ? `${state.selectedCategory.charAt(0).toUpperCase() + state.selectedCategory.slice(1)} Products`
                  : 'All Products'
                } ({filteredProducts.length})
              </h2>
            </div>
            <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <ProductGridItems products={filteredProducts} />
            </Grid>
          </>
        )}
      </section>
    </div>
  );
}