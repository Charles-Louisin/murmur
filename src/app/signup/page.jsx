'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

export default function SignUp() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      // Vérifier si le nom d'utilisateur est disponible
      const checkResponse = await fetch(`http://localhost:5000/api/users/check-username?username=${encodeURIComponent(username)}`);
      const { isAvailable } = await checkResponse.json();

      if (!isAvailable) {
        setError('Ce nom d\'utilisateur est déjà pris');
        return;
      }

      // Créer le compte
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du compte');
      }

      const data = await response.json();
      // Rediriger vers la page de profil avec le lien partageable
      router.push(`/profile/${data.user.shareableLink}`);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Une erreur est survenue lors de la création du compte');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <Header />
      <div className="px-0 sm:px-6 pt-6 sm:pt-12">
        <div className="card card-hover max-w-md mx-auto relative overflow-hidden mobile-full-width sm:mx-auto">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[rgb(var(--color-accent))/10] to-[rgb(var(--color-primary))/20] rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
          
          <span className="badge badge-primary mb-2">Nouveau compte</span>
          <h2 className="text-2xl font-bold mb-2 text-[rgb(var(--color-text))]">
            Créer votre compte
          </h2>
          <p className="text-[rgb(var(--color-text-secondary))] mb-6">Rejoignez Murmur pour recevoir des messages anonymes</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[rgb(var(--color-text))] mb-2">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="username"
                  className="input pl-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choisissez un nom d'utilisateur"
                  minLength={3}
                  required
                />
              </div>
              <p className="mt-2 text-xs text-[rgb(var(--color-text-secondary))]">
                Votre nom sera visible par les personnes qui vous envoient des messages.
              </p>
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg flex items-center text-sm">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            )}
            
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Création en cours...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span>Créer mon compte</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              )}
            </button>
            
            <div className="pt-4 border-t border-gray-100">
              <p className="text-center text-[rgb(var(--color-text-secondary))]">
                Déjà un compte ?{' '}
                <a href="/login" className="text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-accent))] font-medium transition-colors">
                  Se connecter
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 