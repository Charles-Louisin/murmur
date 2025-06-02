import User from '../models/User.js';
import Message from '../models/Message.js';

// Obtenir tous les utilisateurs
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-__v')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error: error.message });
  }
};

// Modifier le rôle d'un utilisateur
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Rôle invalide' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la modification du rôle', error: error.message });
  }
};

// Supprimer un utilisateur
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Supprimer tous les messages de l'utilisateur
    await Message.deleteMany({ recipient: userId });

    // Supprimer l'utilisateur
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Utilisateur et messages supprimés avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur', error: error.message });
  }
};

// Obtenir tous les messages
export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .populate('sender', 'username createdAt')
      .populate('recipient', 'username')
      .select('-__v')
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des messages', error: error.message });
  }
};

// Obtenir les messages reçus d'un utilisateur spécifique
export const getUserMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({ recipient: userId })
      .populate('sender', 'username')
      .populate('recipient', 'username')
      .select('-__v');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des messages', error: error.message });
  }
};

// Obtenir les messages envoyés par un utilisateur spécifique
export const getUserSentMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({ sender: userId })
      .populate('sender', 'username')
      .populate('recipient', 'username')
      .select('-__v');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des messages', error: error.message });
  }
};

// Obtenir les statistiques
export const getStats = async (req, res) => {
  try {
    // Statistiques générales
    const totalUsers = await User.countDocuments();
    const totalMessages = await Message.countDocuments();
    
    // Utilisateurs actifs (ayant envoyé ou reçu un message dans les 7 derniers jours)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const activeUserIds = await Message.distinct('recipient', {
      createdAt: { $gte: sevenDaysAgo }
    });
    const activeUsers = activeUserIds.length;

    // Messages par jour (30 derniers jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const messagesByDay = await Message.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          date: "$_id",
          count: 1,
          _id: 0
        }
      }
    ]);

    // Nouveaux utilisateurs par jour (30 derniers jours)
    const usersByDay = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          date: "$_id",
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json({
      totalUsers,
      totalMessages,
      activeUsers,
      messagesByDay,
      usersByDay
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques', error: error.message });
  }
};

// Supprimer un message
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    await Message.findByIdAndDelete(messageId);
    res.json({ message: 'Message supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du message', error: error.message });
  }
};

// Signaler/Désignaler un message
export const flagMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { isFlagged } = req.body;

    const message = await Message.findByIdAndUpdate(
      messageId,
      { isFlagged },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du signalement du message', error: error.message });
  }
};

// Vérifier si l'utilisateur est admin
export const checkAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    res.status(200).json({ message: 'Accès autorisé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la vérification des droits', error: error.message });
  }
}; 