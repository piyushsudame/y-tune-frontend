import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
console.log(`[MongoDB] Connecting to ${MONGODB_URI}`);

if (!MONGODB_URI) {
  console.error('[MongoDB] MONGODB_URI is not defined');
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;
console.log('[MongoDB] Current cached connection:', cached);

if (!cached) {
  console.log('[MongoDB] Initializing new cache');
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  console.log('[MongoDB] Attempting to connect to database');
  
  if (cached.conn) {
    console.log('[MongoDB] Using existing connection');
    return cached.conn;
  } 

  console.log(cached.conn, cached.promise)

  if (!cached.promise) {
    console.log('[MongoDB] Creating new connection promise');
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('[MongoDB] Successfully connected to database');
      return mongoose;
    }).catch(err => {
      console.error('[MongoDB] Connection error in promise:', err);
      throw err;
    });
  }
  
  try {
    console.log('[MongoDB] Waiting for connection promise to resolve');
    cached.conn = await cached.promise;
    console.log('[MongoDB] Connection state:', mongoose.connection.readyState);
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  } catch (e) {
    console.error('[MongoDB] Connection error in try/catch:', e);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}