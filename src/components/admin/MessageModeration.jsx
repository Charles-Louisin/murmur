'use client';

import { useState, useEffect } from 'react';

export default function MessageModeration() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/messages', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        setMessages(messages.filter(msg => msg._id !== messageId));
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleFlagMessage = async (messageId, isFlagged) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/messages/${messageId}/flag`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isFlagged })
      });

      if (response.ok) {
        setMessages(messages.map(msg => 
          msg._id === messageId ? { ...msg, isFlagged } : msg
        ));
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (loading) {
    return <div className="text-center">Chargement...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Modération des messages</h2>
      
      <div className="space-y-4">
        {messages.map(message => (
          <div 
            key={message._id} 
            className={`p-4 rounded-lg border ${
              message.isFlagged ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">De:</span>{' '}
                    {message.sender ? (
                      <span className="text-blue-600">{message.sender.username}</span>
                    ) : (
                      <span className="text-orange-500">Anonyme</span>
                    )}
                    {message.senderIp && (
                      <span className="text-gray-400 text-xs ml-2">(IP: {message.senderIp})</span>
                    )}
                    <span className="mx-2">→</span>
                    <span className="font-medium">À:</span>{' '}
                    <span className="text-purple-600">{message.recipient.username}</span>
                  </p>
                </div>
                <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{message.content}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <p>
                    Envoyé le:{' '}
                    {new Date(message.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  {message.sender && (
                    <p>
                      Compte créé le:{' '}
                      {new Date(message.sender.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleFlagMessage(message._id, !message.isFlagged)}
                  className={`px-3 py-1 rounded ${
                    message.isFlagged
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                  }`}
                >
                  {message.isFlagged ? 'Retirer le signalement' : 'Signaler'}
                </button>
                <button
                  onClick={() => handleDeleteMessage(message._id)}
                  className="px-3 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 