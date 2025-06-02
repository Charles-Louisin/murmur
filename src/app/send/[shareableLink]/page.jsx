import { Suspense } from 'react';
import SendMessageContent from '@/components/SendMessageContent';
import Header from '@/components/Header';

export default function SendMessage({ params }) {
  return (
    <Suspense 
      fallback={
        <div className="animate-fade-in">
          <Header />
          <div className="max-w-md mx-auto mt-12 text-center">
            Chargement...
          </div>
        </div>
      }
    >
      <SendMessageContent shareableLink={params.shareableLink} />
    </Suspense>
  );
} 