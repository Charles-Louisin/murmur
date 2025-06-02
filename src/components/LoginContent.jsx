'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';

export default function LoginContent() {
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
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la connexion');
      }

      // Sauvegarder le token et les informations de l'utilisateur
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Rediriger vers la page de profil
      router.push(`/profile/${data.user.shareableLink}`);
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message || 'Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <Header />
      <div className="px-0 sm:px-6 pt-6 sm:pt-12">
        <div className="card card-hover max-w-md mx-auto relative overflow-hidden mobile-full-width sm:mx-auto">
          <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-[rgb(var(--color-primary))/10] to-[rgb(var(--color-accent))/20] rounded-full blur-3xl -z-10 transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-[rgb(var(--color-primary))/10] to-[rgb(var(--color-accent))/20] rounded-full blur-3xl -z-10 transform translate-x-1/2 translate-y-1/2"></div>
          
          <h2 className="text-2xl font-bold mb-2 text-[rgb(var(--color-text))]">Connexion</h2>
          <p className="text-[rgb(var(--color-text-secondary))] mb-6">Accédez à votre compte Murmur</p>
          
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
                  placeholder="Entrez votre nom d'utilisateur"
                  required
                  minLength={3}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg flex items-center text-sm">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  Connexion en cours...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span>Se connecter</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              )}
            </button>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-center text-[rgb(var(--color-text-secondary))]">
                Pas encore de compte ?{' '}
                <Link href="/signup" className="text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-accent))] font-medium transition-colors">
                  Créer un compte
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 