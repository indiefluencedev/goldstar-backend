import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    createLockstitchModel,
    getLockstitchModels,
    getLockstitchModelById,
    updateLockstitchModel,
    deleteLockstitchModel,
    getLockstitchModelSchemaFields
} from '../controllers/lockstitchController.js';

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
router.post('/', upload.single('image'), createLockstitchModel); // Handle image upload on create
router.get('/', getLockstitchModels);
router.get('/:id', getLockstitchModelById);
router.put('/:id', upload.single('image'), updateLockstitchModel); // Handle image upload on update
router.delete('/:id', deleteLockstitchModel);
router.get('/schema/fields', getLockstitchModelSchemaFields);

export default router;
