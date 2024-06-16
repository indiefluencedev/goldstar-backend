import app from './app.js';
import events from 'events';
import cleanupSeries from './cleanupSeries.js';
import updateSeriesWithNewModels from './updateSeriesWithNewModels.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

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
                console.error(`Port ${port} is already in use. Trying another port...`);
                startServer(port + 1); // Try the next port
            } else {
                throw err;
            }
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

const gracefulShutdown = () => {
    if (server) {
        server.close(() => {
            console.log('Server shut down gracefully.');
            mongoose.connection.close(false, () => {
                console.log('MongoDB connection closed.');
                process.exit(0);
            });
        });
    }
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

const mongoURI = process.env.MONGODB_URI;

const startApplication = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');

        const port = parseInt(process.env.PORT, 10) || 8000;

        await updateSeriesWithNewModels();
        console.log('Series update with new models completed.');

        await cleanupSeries();
        console.log('Series cleanup completed.');

        startServer(port);
    } catch (error) {
        console.error('Failed to start application:', error.message);
        process.exit(1);
    }
};

startApplication();

export default app;
