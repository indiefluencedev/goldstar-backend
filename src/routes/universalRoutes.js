// routes/universalRoutes.js
import express from 'express';
import { getModelById } from '../controllers/universalController.js'; // Adjust the path as necessary

const router = express.Router();

// Define the route
router.get('/models/:type/:id', getModelById);

export default router;
