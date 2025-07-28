'use client';

import { useProducts } from '@/contexts/ProductsContext';
import clsx from 'clsx';

export default function CategoryFilter() {
  const { state, setSelectedCategory } = useProducts();

  if (state.loading || state.categories.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        Categories
      </h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={clsx(
            'rounded-full px-4 py-2 text-sm font-medium transition-colors',
            state.selectedCategory === null
              ? 'bg-blue-600 text-white'
              : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
          )}
        >
          All Products ({state.products.length})
        </button>
        {state.categories.map((category) => {
          const count = state.products.filter(p => p.category === category).length;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={clsx(
                'rounded-full px-4 py-2 text-sm font-medium transition-colors capitalize',
                state.selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
              )}
            >
              {category} ({count})
            </button>
          );
        })}
      </div>
    </div>
  );
}