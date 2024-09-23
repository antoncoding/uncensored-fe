import React from 'react';
import Meta from '@/components/Meta';
import ForceInclusionCard from '@/components/ForceInclusionCard'; // You'll need to create this component

export default function Home() {
  return (
    <>
      <Meta />
      <div className="w-full min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900">
        <ForceInclusionCard />
      </div>
    </>
  );
}
