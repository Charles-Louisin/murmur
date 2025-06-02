import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const login = async (req, res) => {
  try {
    console.log('Tentative de connexion avec les données:', req.body);
    
    const { username } = req.body;
    if (!username) {
      console.log('Erreur: nom d\'utilisateur manquant');
      return res.status(400).json({ message: 'Le nom d\'utilisateur est requis' });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ username });
    console.log('Utilisateur trouvé:', user ? 'Oui' : 'Non');
    
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET non défini dans les variables d\'environnement');
      return res.status(500).json({ message: 'Erreur de configuration du serveur' });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { 
        userId: user._id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('Token JWT généré avec succès');

    // Renvoyer les informations de l'utilisateur et le token
    res.json({
      message: 'Connexion réussie',
      user: {
        id: user._id,
        username: user.username,
        shareableLink: user.shareableLink,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la connexion',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}; 