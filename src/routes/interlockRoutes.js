import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    createInterlockModel,
    getInterlockModels,
    getInterlockModelById,
    updateInterlockModel,
    deleteInterlockModel,
    getInterlockModelSchemaFields
} from '../controllers/interlockController.js';

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
router.post('/', upload.single('image'), createInterlockModel); // Handle image upload on create
router.get('/', getInterlockModels);
router.get('/:id', getInterlockModelById);
router.put('/:id', upload.single('image'), updateInterlockModel); // Handle image upload on update
router.delete('/:id', deleteInterlockModel);
router.get('/schema/fields', getInterlockModelSchemaFields);

export default router;
