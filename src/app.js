import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import killPort from 'kill-port';
import helmet from 'helmet';
import updateSeriesWithNewModels from './updateSeriesWithNewModels.js';

import authRoutes from './routes/userRoutes.js';
import { protect } from './middlewares/authMiddleware.js';
import universalRoutes from './routes/universalRoutes.js';
import lockstitchRoutes from './routes/lockstitchRoutes.js';
import overlockRoutes from './routes/overlockRoutes.js';
import interlockRoutes from './routes/interlockRoutes.js';
import heavyDutyRoutes from './routes/heavyDutyRoutes.js';
import seriesRoutes from './routes/seriesRoutes.js';

dotenv.config();

const app = express();

// Use Helmet for setting various HTTP headers for security
app.use(helmet());

// Custom CSP configuration to allow image loading from the backend
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; img-src 'self' https://testing-backend-s0dg.onrender.com https://testing-frontend-omega.vercel.app; script-src 'self'; style-src 'self' 'unsafe-inline';");
    next();
});

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL, // Use environment variable for frontend URL
    credentials: true,
}));

// Middleware for parsing request bodies and cookies
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true, // HTTP only, prevents JavaScript access to cookies
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));

// Serve static files from 'public' and 'uploads' directories
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/users', authRoutes);
app.use('/api/protected-route', protect, (req, res) => {
    res.status(200).json({ message: 'This is a protected route' });
});
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
    const server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
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
