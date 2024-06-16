import app from './app.js';
import events from 'events';
import cleanupSeries from './cleanupSeries.js'; // Import the cleanup function
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Increase max listeners limit to avoid memory leaks
events.EventEmitter.defaultMaxListeners = 20;

const PORT = process.env.PORT || 8000;
let server;

const startServer = (port) => {
    try {
        server = app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });

        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`Port ${port} is already in use. Exiting...`);
                process.exit(1); // Exit to stop infinite loop
            } else {
                throw err;
            }
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1); // Exit to prevent infinite loop
    }
};

const gracefulShutdown = () => {
    if (server) {
        server.close(() => {
            console.log('Server shut down gracefully.');
            process.exit(0);
        });
    }
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

const mongoURI = process.env.MONGODB_URI; // Load MongoDB URI from .env

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');

        // Run the cleanup function
        cleanupSeries().catch(console.error).finally(() => {
            // Start the server after cleanup
            startServer(PORT);
        });
    })
    .catch(error => {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit if MongoDB connection fails
    });
