// lib/dbConnect.ts
import mongoose from 'mongoose';

// Define the connection cache type
type ConnectionCache = {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
};

// Declare the global variable
declare global {
  var mongooseCache: ConnectionCache;
}

// Initialize the cache
global.mongooseCache = global.mongooseCache || { conn: null, promise: null };

/**
 * Gets the MongoDB URI from environment variables
 * @throws Error if MONGODB_URI is not defined
 * @returns The MongoDB URI as a string
 */
function getMongodbUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }
  return uri;
}

export async function connectDB(): Promise<mongoose.Connection> {
  // If connection exists, return it
  if (global.mongooseCache.conn) {
    return global.mongooseCache.conn;
  }

  // If a connection attempt is in progress, wait for it
  if (!global.mongooseCache.promise) {
    // Get the MongoDB URI (will throw if not defined)
    const MONGODB_URI = getMongodbUri();
    
    // Set up connection options
    const opts = {
      bufferCommands: false,
    };

    // Create the connection promise
    global.mongooseCache.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        return mongoose.connection;
      });
  }

  try {
    // Await the connection
    global.mongooseCache.conn = await global.mongooseCache.promise;
  } catch (e) {
    // Reset the promise on error
    global.mongooseCache.promise = null;
    throw e;
  }

  return global.mongooseCache.conn;
}