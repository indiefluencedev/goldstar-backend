import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import killPort from 'kill-port';
import path from 'path';
import { fileURLToPath } from 'url';
import updateSeriesWithNewModels from './updateSeriesWithNewModels.js';

import authRoutes from './routes/userRoutes.js';
import { protect } from './middlewares/authMiddleware.js';

dotenv.config();

// Import routes
import universalRoutes from './routes/universalRoutes.js';
import lockstitchRoutes from './routes/lockstitchRoutes.js';
import overlockRoutes from './routes/overlockRoutes.js';
import interlockRoutes from './routes/interlockRoutes.js';
import heavyDutyRoutes from './routes/heavyDutyRoutes.js';
import seriesRoutes from './routes/seriesRoutes.js';

const app = express();

// Define __dirname
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

app.use(cors({
    origin: 'http://localhost:5173', // Your frontend's origin
    credentials: true, // Allow credentials (cookies)
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(express.static('public'));



// importent to be correct for displaying the image 
app.use('/uploads', express.static('uploads')); // Serve static files from the uploads directory




app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Use secure: true if using HTTPS
}));

app.use('/api/users', authRoutes); // Ensure this path matches your frontend requests

// Example of protecting a route
app.use('/api/protected-route', protect, (req, res) => {
    res.status(200).json({ message: 'This is a protected route' });
});

// Your routes
app.use('/api', universalRoutes);
app.use('/api/lockstitch', lockstitchRoutes);
app.use('/api/overlock', overlockRoutes);
app.use('/api/interlock', interlockRoutes);
app.use('/api/heavyDuty', heavyDutyRoutes);
app.use('/api/series', seriesRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Function to start the server
const startServer = (port) => {
    const bindAddress = process.env.NODE_ENV === 'development' ? '127.0.0.1' : '0.0.0.0';
    const server = app.listen(port, bindAddress, () => {
        console.log(`Server running on port ${port}, bound to ${bindAddress}`);
    });

    const shutdown = () => {
        if (server) {
            server.close(() => {
                console.log('Server closed');
                mongoose.connection.close(false, () => {
                    console.log('MongoDB connection closed');
                    process.exit(0);
                });
            });
        } else {
            process.exit(0);
        }
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
};

// Function to free the port
const freePort = async (port) => {
    try {
        await killPort(port);
        console.log(`Port ${port} has been freed.`);
    } catch (err) {
        console.error(`Error freeing port ${port}:`, err);
    }
};

// Main function to start the application
const startApplication = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');

        const port = parseInt(process.env.PORT, 10) || 8002;

        await freePort(port);

        startServer(port);

        await updateSeriesWithNewModels();
    } catch (error) {
        console.error('Failed to start application:', error.message);
        process.exit(1);
    }
};

startApplication();

export default app;
