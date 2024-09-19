import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import helmet from 'helmet';
import killPort from 'kill-port';
import updateSeriesWithNewModels from './updateSeriesWithNewModels.js';

import authRoutes from './routes/userRoutes.js';
import googleAuthRoutes from './routes/googleAuthRoutes.js';
import protectedRoutes from './routes/userRoutes.js'; // Import protected routes
import checkJwt from './middlewares/authMiddleware.js'; // Ensure correct import
import universalRoutes from './routes/universalRoutes.js';
import lockstitchRoutes from './routes/lockstitchRoutes.js';
import overlockRoutes from './routes/overlockRoutes.js';
import interlockRoutes from './routes/interlockRoutes.js';
import heavyDutyRoutes from './routes/heavyDutyRoutes.js';
import specialSeriesRoutes from './routes/specialSeriesRoutes.js';
import zigzagSeriesRoutes from './routes/zigzagSeriesRoutes.js';
import cuttingSeriesRoutes from './routes/cuttingRoutes.js';
import fusingMachineSeriesRoutes from './routes/fusingMachineSeriesRoutes.js';
import heatTransferSeriesRoutes from './routes/heatTransferRoutes.js';
import needleDetectorSeriesRoutes from './routes/needleDetectorRoutes.js';
import seriesRoutes from './routes/seriesRoutes.js';

dotenv.config();

const app = express();

app.use(helmet());

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; img-src 'self' https://goldstar-backend.onrender.com; script-src 'self'; style-src 'self' 'unsafe-inline';");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://goldstarsewing.com',
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.use('/users', authRoutes);
app.use('/auth', googleAuthRoutes);
app.use('/api/protected-route', checkJwt, (req, res) => { // Use checkJwt to protect this route
  res.status(200).json({ message: 'This is a protected route' });
});
app.use('/api', universalRoutes);
app.use('/api/lockstitch', lockstitchRoutes);
app.use('/api/overlock', overlockRoutes);
app.use('/api/interlock', interlockRoutes);
app.use('/api/heavyDuty', heavyDutyRoutes);
app.use('/api/specialseries', specialSeriesRoutes);
app.use('/api/zigzag', zigzagSeriesRoutes);
app.use('/api/cuttingseries', cuttingSeriesRoutes);
app.use('/api/fusingmachine', fusingMachineSeriesRoutes);
app.use('/api/heattransfer', heatTransferSeriesRoutes);
app.use('/api/needledetector', needleDetectorSeriesRoutes);
app.use('/api/series', seriesRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

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

const freePort = async (port) => {
  try {
    await killPort(port);
    console.log(`Port ${port} has been freed.`);
  } catch (err) {
    console.error(`Error freeing port ${port}:`, err);
  }
};

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
