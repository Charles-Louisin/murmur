'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import MessageForm from '@/components/MessageForm';
import Link from 'next/link';

export default function SendMessageContent({ shareableLink }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/link/${shareableLink}`);
        if (!response.ok) {
          throw new Error('Utilisateur non trouvé');
        }
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Erreur:', error);
        setError('Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    if (shareableLink) {
      fetchUser();
    }
  }, [shareableLink]);

  const handleMessageSent = () => {
    setMessageSent(true);
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <Header />
        <div className="px-4 sm:px-6 mt-6 sm:mt-12 text-center">
          <div className="card max-w-md mx-auto p-8 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[rgb(var(--color-primary))] border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-[rgb(var(--color-text-secondary))]">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="animate-fade-in">
        <Header />
        <div className="px-4 sm:px-6 mt-6 sm:mt-12 text-center">
          <div className="card max-w-md mx-auto p-8">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-lg text-red-500 font-medium">
              {error || 'Utilisateur non trouvé'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (messageSent) {
    return (
      <div className="animate-fade-in">
        <Header />
        <div className="px-4 sm:px-6 pt-6 sm:pt-12">
          <div className="card card-hover max-w-md mx-auto relative overflow-hidden mobile-full-width sm:mx-auto">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-100 rounded-full blur-3xl opacity-60 -z-10"></div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-[rgb(var(--color-text))]">Message envoyé !</h2>
              <p className="text-[rgb(var(--color-text-secondary))] mb-6">
                Votre message a été envoyé anonymement à <span className="font-medium text-[rgb(var(--color-text))]">{user.username}</span>.
              </p>
              <button
                onClick={() => setMessageSent(false)}
                className="btn btn-primary w-full group"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Envoyer un autre message
              </button>
            </div>

            {/* Section pour inviter à créer un compte */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <div className="bg-[rgb(var(--color-background))] rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[rgb(var(--color-primary))/5] to-[rgb(var(--color-accent))/10] rounded-xl -z-10"></div>
                
                <h3 className="text-xl font-bold mb-3 text-[rgb(var(--color-text))]">
                  Vous aussi, recevez des messages anonymes !
                </h3>
                <p className="text-[rgb(var(--color-text-secondary))] mb-4">
                  Créez votre compte gratuitement et partagez votre lien pour recevoir des messages anonymes de vos amis.
                </p>
                <Link href="/signup" className="btn btn-outline w-full group">
                  <span>Créer mon compte</span>
                  <svg className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Header />
      <div className="px-0 sm:px-6 pt-6 sm:pt-12 space-y-6">
        <div className="card card-hover max-w-md mx-auto relative overflow-hidden mobile-full-width sm:mx-auto">
          <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-[rgb(var(--color-primary))/10] to-[rgb(var(--color-accent))/20] rounded-full blur-3xl -z-10 transform -translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="mb-6 flex items-center gap-3">
            <div className="w-12 h-12 bg-[rgb(var(--color-primary))/10 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-[rgb(var(--color-primary))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <span className="badge badge-primary mb-1">Message anonyme</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[rgb(var(--color-text))]">
                À {user.username}
              </h2>
            </div>
          </div>
          
          <div className="p-5 bg-message-new rounded-[28px] mb-6">
            <MessageForm
              recipientId={user.id}
              onMessageSent={handleMessageSent}
            />
          </div>
        </div>

        {/* Section pour inviter à créer un compte */}
        <div className="card card-hover max-w-md mx-auto">
          <div className="bg-[rgb(var(--color-background))] rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[rgb(var(--color-primary))/5] to-[rgb(var(--color-accent))/10] rounded-xl -z-10"></div>
            
            <h3 className="text-xl font-bold mb-3 text-[rgb(var(--color-text))]">
              Envie de recevoir des messages vous aussi ?
            </h3>
            <p className="text-[rgb(var(--color-text-secondary))] mb-4">
              Créez votre compte gratuitement et partagez votre lien pour recevoir des messages anonymes de vos amis.
            </p>
            <Link href="/signup" className="btn btn-outline w-full group">
              <span>Créer mon compte</span>
              <svg className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 