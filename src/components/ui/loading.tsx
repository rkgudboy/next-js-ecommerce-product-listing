import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Loading({ message = 'Loading...', size = 'md' }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12', 
    lg: 'h-16 w-16'
  };

  return (
    <div className="mx-auto max-w-screen-2xl px-4">
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className={`${sizeClasses[size]} animate-spin text-neutral-900 dark:text-neutral-100 mx-auto`} />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">{message}</p>
        </div>
      </div>
    </div>
  );
}