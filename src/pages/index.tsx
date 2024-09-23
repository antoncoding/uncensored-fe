import React from 'react';
import Meta from '@/components/Meta';
import ForceInclusionCard from '@/components/ForceInclusionCard'; // You'll need to create this component

export default function Home() {
  return (
    <>
      <Meta />
      <div className="w-full flex justify-center items-center">
        <ForceInclusionCard />
      </div>
    </>
  );
}
