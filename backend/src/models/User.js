import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  shareableLink: {
    type: String,
    unique: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isPro: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Générer un lien partageable unique avant de sauvegarder
userSchema.pre('save', async function(next) {
  if (!this.shareableLink) {
    this.shareableLink = `${this._id}-${Math.random().toString(36).substring(2, 15)}`;
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User; 