'use client';

import { useProducts } from '@/contexts/ProductsContext';
import Grid from '@/components/grid';
import ProductGridItems from '@/components/layout/product-grid-items';
import CategoryFilter from '@/components/category-filter';
import Loading from '@/components/ui/loading';

export default function ProductsPage() {
  const { state, filteredProducts } = useProducts();

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
      <div className="pb-4 pt-8">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          All Products
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Browse our complete collection
        </p>
      </div>
      
      {/* Category Filter */}
      <CategoryFilter />
      
      <section className="pb-24 pt-6">
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
          <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <ProductGridItems products={filteredProducts} />
          </Grid>
        )}
      </section>
    </div>
  );
}