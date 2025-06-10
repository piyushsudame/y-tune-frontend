// lib/mongodb.js
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
console.log('[MongoDB] URI:', uri)

const options = { 
  useNewUrlParser: true,
}
console.log('[MongoDB] Connection options:', options)

let client
let clientPromise

if (!process.env.MONGODB_URI) {
  console.error('[MongoDB] Missing MONGODB_URI in environment variables')
  throw new Error('Add Mongo URI to .env.local')
}

if (process.env.NODE_ENV === 'development') { 
  console.log('[MongoDB] Running in development mode')
  if (!global._mongoClientPromise) {
    console.log('[MongoDB] Creating new client in development')
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
    console.log('[MongoDB] Development client connected')
  } else {
    console.log('[MongoDB] Using existing development client')
  }
  clientPromise = global._mongoClientPromise
} else {
  console.log('[MongoDB] Running in production mode')
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
  console.log('[MongoDB] Production client connected')
}

export default clientPromise