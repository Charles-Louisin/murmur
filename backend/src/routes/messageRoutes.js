import express from 'express';
import { sendMessage, getUserMessages, markMessageAsRead } from '../controllers/messageController.js';

const router = express.Router();

// Route pour envoyer un message
router.post('/', sendMessage);

// Route pour obtenir les messages d'un utilisateur
router.get('/user/:userId', getUserMessages);

// Route pour marquer un message comme lu
router.patch('/:messageId/read', markMessageAsRead);

export default router; 