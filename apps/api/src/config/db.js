const mongoose = require('mongoose');

let connectionState = {
    mode: 'UNINITIALIZED',
    status: 'OFFLINE',
    host: 'none',
    timestamp: null
};

/**
 * Dual-Mode Resilient Database Adapter
 * Attempts connection to MongoDB Atlas / Local cluster when MONGODB_URI is provided.
 * Gracefully switches to in-memory catalog mode if URI is absent or unreachable.
 */
async function connectDB() {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.log('[INFO] MONGODB_URI not configured. Operating in IN-MEMORY RESILIENT MODE.');
        connectionState = {
            mode: 'IN_MEMORY_MOCK',
            status: 'ACTIVE_FALLBACK',
            host: 'memory://local',
            timestamp: new Date().toISOString()
        };
        return connectionState;
    }

    try {
        console.log(`[INFO] Attempting connection to MongoDB: ${uri.split('@').pop()}`);
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 3000
        });

        connectionState = {
            mode: 'MONGODB_CLUSTER',
            status: 'ONLINE',
            host: mongoose.connection.host,
            timestamp: new Date().toISOString()
        };
        console.log(`[PASS] MongoDB Connected successfully to host: ${connectionState.host}`);
        return connectionState;
    } catch (err) {
        console.warn(`[WARN] MongoDB connection failed: ${err.message}`);
        console.warn('[WARN] Switching automatically to IN-MEMORY RESILIENT MODE.');
        connectionState = {
            mode: 'IN_MEMORY_MOCK',
            status: 'ACTIVE_FALLBACK',
            host: 'memory://fallback',
            error: err.message,
            timestamp: new Date().toISOString()
        };
        return connectionState;
    }
}

function getDbState() {
    return connectionState;
}

module.exports = { connectDB, getDbState };
