import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    createOverlockModel,
    getOverlockModels,
    getOverlockModelById,
    updateOverlockModel,
    deleteOverlockModel,
    getOverlockModelSchemaFields
} from '../controllers/overlockController.js';

const router = express.Router();

// Configure Multer storage options
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files to the 'uploads' directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// Create the Multer instance
const upload = multer({ storage });

// Routes
router.post('/', upload.single('image'), createOverlockModel); // Handle image upload on create
router.get('/', getOverlockModels);
router.get('/:id', getOverlockModelById);
router.put('/:id', upload.single('image'), updateOverlockModel); // Handle image upload on update
router.delete('/:id', deleteOverlockModel);
router.get('/schema/fields', getOverlockModelSchemaFields);

export default router;
