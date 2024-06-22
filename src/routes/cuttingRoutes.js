import express from 'express';
import multer from 'multer';
import path from 'path'; // Ensure path is imported
import {
    createCuttingModel,
    getCuttingModels,
    getCuttingModelById,
    updateCuttingModel,
    deleteCuttingModel,
    getCuttingModelSchemaFields
} from '../controllers/cuttingController.js';

const router = express.Router();

// Configure Multer storage options
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files to the 'uploads' directory
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Create the Multer instance
const upload = multer({ storage });

// Define the routes for Cutting Series
router.post('/', upload.single('image'), createCuttingModel); // Added upload middleware for image upload
router.get('/', getCuttingModels);
router.get('/:id', getCuttingModelById);
router.put('/:id', upload.single('image'), updateCuttingModel); // Added upload middleware for image upload
router.delete('/:id', deleteCuttingModel);
router.get('/schema/fields', getCuttingModelSchemaFields);

export default router;
