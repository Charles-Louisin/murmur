import Message from '../models/Message.js';
import User from '../models/User.js';

// Envoyer un nouveau message
export const sendMessage = async (req, res) => {
  try {
    const { content, recipientId } = req.body;
    const senderId = req.user ? req.user._id : null;

    // Vérifier si le destinataire existe
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Destinataire non trouvé' });
    }

    // Créer et sauvegarder le message
    const message = new Message({
      content,
      recipient: recipientId,
      sender: senderId
    });
    await message.save();

    // Préparer la réponse en fonction du type d'utilisateur
    const response = {
      message: 'Message envoyé avec succès',
      data: {
        id: message._id,
        content: message.content,
        createdAt: message.createdAt
      }
    };

    // Si l'utilisateur est admin ou pro, inclure plus d'informations
    if (req.user && (req.user.role === 'admin' || req.user.isPro)) {
      response.data.sender = senderId;
      response.data.recipient = recipientId;
    }

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'envoi du message', error: error.message });
  }
};

// Récupérer les messages d'un utilisateur
export const getUserMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Récupérer tous les messages de l'utilisateur
    const messages = await Message.find({ recipient: userId })
      .sort({ createdAt: -1 }); // Du plus récent au plus ancien

    // Préparer la réponse en fonction du type d'utilisateur
    const messageResponse = messages.map(msg => {
      const response = {
        id: msg._id,
        content: msg.content,
        createdAt: msg.createdAt,
        isRead: msg.isRead
      };

      // Si l'utilisateur est admin ou pro, inclure l'information sur l'expéditeur
      if (req.user && (req.user.role === 'admin' || (req.user.isPro && req.user._id.equals(userId)))) {
        response.sender = msg.sender;
      }

      return response;
    });

    res.json({ messages: messageResponse });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des messages', error: error.message });
  }
};

// Marquer un message comme lu
export const markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }

    message.isRead = true;
    await message.save();

    res.json({ message: 'Message marqué comme lu' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du message', error: error.message });
  }
}; 