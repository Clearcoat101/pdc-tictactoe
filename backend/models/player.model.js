// player.model.js
import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  username: { 
    type: String, 
    unique: true 
  },
  level: { 
    type: Number, 
    default: 1 
  },
  lifetimePoints: { 
    type: Number, 
    default: 0 
  },
  gamesPlayed: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model('Player', playerSchema);