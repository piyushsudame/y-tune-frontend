import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
console.log(`[MongoDB] Connecting to ${MONGODB_URI}`);

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;
console.log(cached)

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    }).catch(err => {
      console.error('[MongoDB] Connection error in promise:', err);
      throw err;
    });
  }
  
  try {
    cached.conn = await cached.promise;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  } catch (e) {
    console.error('[MongoDB] Connection error in try/catch:', e);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}