'use client';

import Header from '@/components/Header';
import Link from 'next/link';

export default function HomeContent() {
  return (
    <div className="animate-fade-in">
      <Header />
      <div className="max-w-md mx-auto mt-12">
        <div className="card text-center">
          <h2 className="text-2xl font-bold mb-6">
            Envoyez des messages anonymes
          </h2>
          <p className="text-gray-600 mb-8">
            Créez votre compte pour recevoir des messages anonymes de vos amis.
            C'est simple, rapide et sans email !
          </p>
          <div className="space-y-4">
            <Link href="/signup" className="btn-primary block">
              Créer mon compte
            </Link>
            <Link href="/login" className="btn-outline block">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 