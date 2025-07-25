import mongoose from 'mongoose';
const { Schema, model } = mongoose;

console.log('Starting spotifySession.js file execution.');

console.log('Defining spotifySessionSchema...');
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

console.log('Checking for existing SpotifySession model or creating a new one...');
export default SpotifySessionModel =
  model('SpotifySession', spotifySessionSchema) || model('SpotifySession', spotifySessionSchema);

export { SpotifySessionModel };