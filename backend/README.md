# Murmur Backend API

API backend pour l'application de messagerie anonyme Murmur.

## Technologies utilisées

- Node.js
- Express.js
- MongoDB
- Mongoose
- CORS
- dotenv

## Installation

1. Cloner le projet
2. Installer les dépendances :
```bash
npm install
```

3. Créer un fichier `.env` à la racine du projet avec les variables suivantes :
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/murmur
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Démarrer le serveur :
```bash
# Mode développement
npm run dev

# Mode production
npm start
```

## Points d'API

### Utilisateurs

#### Créer un utilisateur
- **POST** `/api/users`
- Body: `{ "username": "string" }`

#### Vérifier la disponibilité d'un nom d'utilisateur
- **GET** `/api/users/check-username?username=string`

#### Obtenir un utilisateur par son lien partageable
- **GET** `/api/users/link/:shareableLink`

### Messages

#### Envoyer un message
- **POST** `/api/messages`
- Body: `{ "content": "string", "recipientId": "string" }`

#### Obtenir les messages d'un utilisateur
- **GET** `/api/messages/user/:userId`

#### Marquer un message comme lu
- **PATCH** `/api/messages/:messageId/read`

## Structure du projet

```
backend/
├── src/
│   ├── controllers/
│   │   ├── messageController.js
│   │   └── userController.js
│   ├── models/
│   │   ├── Message.js
│   │   └── User.js
│   ├── routes/
│   │   ├── messageRoutes.js
│   │   └── userRoutes.js
│   └── index.js
├── .env
├── package.json
└── README.md
``` 