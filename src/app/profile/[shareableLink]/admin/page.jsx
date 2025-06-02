'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import AdminStats from '@/components/admin/AdminStats';
import UsersList from '@/components/admin/UsersList';
import MessageModeration from '@/components/admin/MessageModeration';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        // Récupérer l'utilisateur du localStorage
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          router.push('/');
          return;
        }

        const user = JSON.parse(userStr);
        if (user.role !== 'admin') {
          router.push(`/profile/${user.shareableLink}`);
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        router.push('/');
      }
    };

    checkAdminAccess();
  }, [router]);

  if (loading) {
    return (
      <div className="animate-fade-in">
        <Header />
        <div className="px-4 sm:px-6 mt-6 sm:mt-12 text-center">
          <div className="card max-w-6xl mx-auto p-8 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[rgb(var(--color-primary))] border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-[rgb(var(--color-text-secondary))]">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in min-h-screen">
      <Header />
      <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
        <div className="card card-hover mb-8 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-[rgb(var(--color-primary))/5] to-[rgb(var(--color-accent))/10] rounded-full blur-3xl -z-10"></div>
          
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <span className="badge badge-primary">Admin</span>
              <h1 className="text-2xl sm:text-3xl font-bold mt-2 text-[rgb(var(--color-text))]">
                Tableau de bord administrateur
              </h1>
            </div>
            
            <button 
              onClick={() => router.push('/')}
              className="btn btn-outline"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Retour à l'accueil
            </button>
          </div>
          
          {/* Navigation */}
          <div className="flex flex-wrap gap-2 mb-8 bg-[rgb(var(--color-background))] p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center ${
                activeTab === 'stats'
                  ? 'bg-[rgb(var(--color-primary))] text-white shadow-md'
                  : 'bg-transparent text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-primary))/10'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Statistiques
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center ${
                activeTab === 'users'
                  ? 'bg-[rgb(var(--color-primary))] text-white shadow-md'
                  : 'bg-transparent text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-primary))/10'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Utilisateurs
            </button>
            <button
              onClick={() => setActiveTab('moderation')}
              className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center ${
                activeTab === 'moderation'
                  ? 'bg-[rgb(var(--color-primary))] text-white shadow-md'
                  : 'bg-transparent text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-primary))/10'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Modération
            </button>
          </div>

          {/* Contenu */}
          <div className="bg-[rgb(var(--color-background))] rounded-xl p-4">
            {activeTab === 'stats' && <AdminStats />}
            {activeTab === 'users' && <UsersList />}
            {activeTab === 'moderation' && <MessageModeration />}
          </div>
        </div>
      </div>
    </div>
  );
} 