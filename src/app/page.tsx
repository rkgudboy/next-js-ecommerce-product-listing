import { Suspense } from 'react';
import HomeContent from '@/components/home-content';
import Loading from '@/components/ui/loading';

export default function Home() {
  return (
    <Suspense fallback={<Loading message="Loading..." />}>
      <HomeContent />
    </Suspense>
  );
}
