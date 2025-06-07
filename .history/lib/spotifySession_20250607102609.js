import mongoose from 'mongoose';
const { Schema, model } = mongoose;

console.log('Starting spotifySession.js file execution.');

const spotifySessionSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Use mongoose.models to check if the model is already registered
const SpotifySession = mongoose.models.SpotifySession || mongoose.model('SpotifySession', spotifySessionSchema);
export default SpotifySession;
export { SpotifySession };