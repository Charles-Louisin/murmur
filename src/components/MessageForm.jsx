import { useState } from 'react';

export default function MessageForm({ recipientId, onMessageSent }) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: message,
          recipientId,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du message');
      }

      setMessage('');
      if (onMessageSent) {
        onMessageSent();
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de l\'envoi du message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <textarea
          className="w-full min-h-[150px] resize-none border-0 bg-transparent focus:ring-0 text-lg font-medium placeholder:text-gray-400 px-0"
          placeholder="Écrivez votre message anonyme ici..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={1000}
          required
        />
        
        <div className="flex justify-end items-center mt-2 text-xs">
          <span className={`${message.length > 900 ? 'text-amber-500 font-medium' : 'text-[rgb(var(--color-text-secondary))]'}`}>
            {message.length}/1000
          </span>
        </div>
      </div>
      
      <button
        type="submit"
        className="w-full py-3 px-6 rounded-full bg-[rgb(var(--color-primary))] text-white font-semibold flex items-center justify-center transition-all duration-300 hover:shadow-lg disabled:opacity-70"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Envoi en cours...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span>Envoyer le message</span>
          </div>
        )}
      </button>
      
      <p className="text-xs text-center text-[rgb(var(--color-text-secondary))]">
        En envoyant ce message, vous acceptez nos conditions d'utilisation. 
        Les messages abusifs pourront être signalés.
      </p>
    </form>
  );
} 