import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    createNeedleDetectorModel,
    getNeedleDetectorModels,
    getNeedleDetectorModelById,
    updateNeedleDetectorModel,
    deleteNeedleDetectorModel,
    getNeedleDetectorModelSchemaFields
} from '../controllers/needleDetectorController.js';

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

// Routes
router.post('/', upload.single('image'), createNeedleDetectorModel); // Handle image upload on create
router.get('/', getNeedleDetectorModels);
router.get('/:id', getNeedleDetectorModelById);
router.put('/:id', upload.single('image'), updateNeedleDetectorModel); // Handle image upload on update
router.delete('/:id', deleteNeedleDetectorModel);
router.get('/schema/fields', getNeedleDetectorModelSchemaFields);

export default router;
