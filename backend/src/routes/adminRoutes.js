import express from 'express';
import { auth, isAdmin } from '../middleware/auth.js';
import {
  getAllUsers,
  getAllMessages,
  getStats,
  deleteMessage,
  flagMessage,
  checkAdmin,
  updateUserRole,
  deleteUser
} from '../controllers/adminController.js';

const router = express.Router();

// Routes protégées par authentification et rôle admin
router.use(auth, isAdmin);

// Vérification des droits admin
router.get('/check', checkAdmin);

// Statistiques
router.get('/stats', getStats);

// Gestion des utilisateurs
router.get('/users', getAllUsers);
router.patch('/users/:userId/role', updateUserRole);
router.delete('/users/:userId', deleteUser);

// Gestion des messages
router.get('/messages', getAllMessages);
router.delete('/messages/:messageId', deleteMessage);
router.patch('/messages/:messageId/flag', flagMessage);

export default router; 