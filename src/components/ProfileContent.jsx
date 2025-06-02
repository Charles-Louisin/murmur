'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Link from 'next/link';

export default function ProfileContent({ shareableLink }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserAndMessages = async () => {
      try {
        // Récupérer les informations de l'utilisateur
        const userResponse = await fetch(`http://localhost:5000/api/users/link/${shareableLink}`);
        if (!userResponse.ok) {
          throw new Error('Utilisateur non trouvé');
        }
        const userData = await userResponse.json();
        setUser(userData);

        // Récupérer les messages
        const messagesResponse = await fetch(`http://localhost:5000/api/messages/user/${userData.id}`);
        if (!messagesResponse.ok) {
          throw new Error('Erreur lors de la récupération des messages');
        }
        const { messages } = await messagesResponse.json();
        setMessages(messages);
      } catch (error) {
        console.error('Erreur:', error);
        setError('Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    if (shareableLink) {
      fetchUserAndMessages();
    }
  }, [shareableLink]);

  const handleCopyLink = () => {
    const link = `${window.location.origin}/send/${shareableLink}`;
    navigator.clipboard.writeText(link);
    alert('Lien copié !');
  };

  const handleLogout = () => {
    // Effacer les données de l'utilisateur
    localStorage.clear();
    // Rediriger vers la page d'accueil
    router.push('/');
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

  return (
    <>
      <Header />
      <div className="px-0 sm:px-6 py-6 space-y-6">
        {/* Section Admin */}
        {user.role === 'admin' && (
          <div className="card card-hover max-w-3xl mx-auto overflow-hidden mobile-full-width sm:mx-auto">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-indigo-500/30 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
            <span className="badge badge-primary mb-2">Admin</span>
            <h2 className="text-xl font-bold mb-3 text-[rgb(var(--color-primary))]">
              Zone Administrateur
            </h2>
            <p className="text-[rgb(var(--color-text-secondary))] mb-6">
              Accédez au tableau de bord pour gérer l'application.
            </p>
            <Link 
              href={`/profile/${shareableLink}/admin`} 
              className="btn btn-primary w-full group"
            >
              Accéder au tableau de bord
              <svg className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5-5 5M5 7l5 5-5 5" />
              </svg>
            </Link>
          </div>
        )}

        <div className="card card-hover max-w-3xl mx-auto mobile-full-width sm:mx-auto">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <div>
              <span className="badge badge-success mb-2">Profil</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[rgb(var(--color-text))]">
                Bonjour, {user.username} !
              </h2>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-outline text-red-500 border-red-100 hover:bg-red-50 hover:border-red-200 self-start"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Déconnexion
            </button>
          </div>
          
          <div className="bg-[rgb(var(--color-background))] rounded-xl p-4 mb-6">
            <p className="text-[rgb(var(--color-text-secondary))] mb-3">
              Partagez ce lien pour recevoir des messages anonymes :
            </p>
            <button
              onClick={handleCopyLink}
              className="btn btn-outline w-full group"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copier mon lien
              <span className="ml-auto text-xs text-[rgb(var(--color-text-secondary))] opacity-0 group-hover:opacity-100 transition-opacity">
                Cliquez pour copier
              </span>
            </button>
          </div>
        </div>

        <div className="card card-hover max-w-3xl mx-auto mobile-full-width sm:mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-[rgb(var(--color-text))]">
                Mes messages
              </h3>
              <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                Partagez votre lien pour recevoir plus de messages !
              </p>
            </div>
            <div className="flex items-center">
              <span className="badge badge-primary text-sm px-3 py-1">
                {messages.length}
              </span>
              <button 
                onClick={handleCopyLink}
                className="ml-3 btn btn-secondary"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Partager
              </button>
            </div>
          </div>
          
          {messages.length === 0 ? (
            <div className="text-center py-12 bg-[rgb(var(--color-background))] rounded-xl">
              <svg className="w-14 h-14 text-[rgb(var(--color-text-secondary))] mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-[rgb(var(--color-text-secondary))] font-medium">
                Vous n'avez pas encore reçu de messages.
              </p>
              <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-2">
                Partagez votre lien avec vos amis pour commencer à recevoir des messages !
              </p>
              <button
                onClick={handleCopyLink}
                className="mt-6 btn btn-primary"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copier mon lien
              </button>
            </div>
          ) : (
            <div className="message-container">
              {messages.map((message, index) => {
                // Détermine la classe de fond basée sur l'index pour varier l'apparence
                const bgClass = !message.isRead 
                  ? 'bg-message-new' 
                  : `bg-message-${(index % 4) + 1}`;
                
                return (
                  <div
                    key={message.id}
                    className={`ngl-message animate-scale-in`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {!message.isRead && (
                      <div className="ngl-message-badge">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[rgb(var(--color-primary))] text-white shadow-lg">
                          Nouveau
                        </span>
                      </div>
                    )}
                    
                    <div className={`ngl-message-inner ${bgClass}`}>
                      <p className="ngl-message-content">
                        {message.content}
                      </p>
                      
                      <div className="ngl-message-time">
                        <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date(message.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
} 