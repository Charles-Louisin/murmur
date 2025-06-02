'use client';

import { Suspense } from 'react';
import ProfileContent from '@/components/ProfileContent';
import Header from '@/components/Header';

export default function Profile({ params }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense 
        fallback={
          <div className="animate-fade-in">
            <Header />
            <div className="max-w-md mx-auto mt-12 text-center">
              <div className="card p-6">
                Chargement...
              </div>
            </div>
          </div>
        }
      >
        <ProfileContent shareableLink={params.shareableLink} />
      </Suspense>
    </div>
  );
} 