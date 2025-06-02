import User from '../models/User.js';

// Créer un nouvel utilisateur
export const createUser = async (req, res) => {
  try {
    const { username } = req.body;
    
    // Vérifier si le nom d'utilisateur existe déjà
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Ce nom d\'utilisateur existe déjà' });
    }

    // Créer un nouvel utilisateur
    const user = new User({ username });
    await user.save();

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: user._id,
        username: user.username,
        shareableLink: user.shareableLink
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur', error: error.message });
  }
};

// Obtenir un utilisateur par son lien partageable
export const getUserByShareableLink = async (req, res) => {
  try {
    const { shareableLink } = req.params;
    const user = await User.findOne({ shareableLink });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({
      id: user._id,
      username: user.username,
      shareableLink: user.shareableLink,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur', error: error.message });
  }
};

// Vérifier si un nom d'utilisateur est disponible
export const checkUsername = async (req, res) => {
  try {
    const { username } = req.query;
    const user = await User.findOne({ username });
    
    res.json({ isAvailable: !user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la vérification du nom d\'utilisateur', error: error.message });
  }
}; 