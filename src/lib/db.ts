import mongoose from 'mongoose';

// Define the connection cache type
type ConnectionCache = {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
};

// Type declaration only (required to use `var` here)
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: ConnectionCache | undefined;
}

// Initialize the cache if not already done
const globalWithCache = global as typeof globalThis & {
  mongooseCache: ConnectionCache;
};

if (!globalWithCache.mongooseCache) {
  globalWithCache.mongooseCache = { conn: null, promise: null };
}

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
  if (globalWithCache.mongooseCache.conn) {
    return globalWithCache.mongooseCache.conn;
  }

  if (!globalWithCache.mongooseCache.promise) {
    const MONGODB_URI = getMongodbUri();
    const opts = { bufferCommands: false };

    globalWithCache.mongooseCache.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose.connection;
    });
  }

  try {
    globalWithCache.mongooseCache.conn = await globalWithCache.mongooseCache.promise;
  } catch (e) {
    globalWithCache.mongooseCache.promise = null;
    throw e;
  }

  return globalWithCache.mongooseCache.conn;
}
