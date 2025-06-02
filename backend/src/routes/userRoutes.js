import express from 'express';
import { createUser, getUserByShareableLink, checkUsername } from '../controllers/userController.js';

const router = express.Router();

// Route pour créer un nouvel utilisateur
router.post('/', createUser);

// Route pour vérifier la disponibilité d'un nom d'utilisateur
router.get('/check-username', checkUsername);

// Route pour obtenir un utilisateur par son lien partageable
router.get('/link/:shareableLink', getUserByShareableLink);

export default router; 