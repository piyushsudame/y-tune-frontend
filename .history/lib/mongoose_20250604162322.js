import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  console.log('Attempting to connect to MongoDB...');
  if (cached.conn) {
    console.log('Using cached MongoDB connection.');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB connection successful.');
      return mongoose;
    }).catch(err => {
      console.error('[MongoDB] Connection error in promise:', err);
      throw err;
    });
  }
  
  try {
    console.log('[MongoDB] Awaiting connection promise');
    cached.conn = await cached.promise;
    console.log('[MongoDB] Connection established successfully');
    console.log('[MongoDB] Connection state:', mongoose.connection.readyState);
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  } catch (e) {
    console.error('[MongoDB] Connection error in try/catch:', e);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}