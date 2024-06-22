import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    createZigzagSeriesModel,
    getZigzagSeriesModels,
    getZigzagSeriesModelById,
    updateZigzagSeriesModel,
    deleteZigzagSeriesModel,
    getZigzagSeriesModelSchemaFields
} from '../controllers/zigzagSeriesController.js';

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
router.post('/', upload.single('image'), createZigzagSeriesModel); // Handle image upload on create
router.get('/', getZigzagSeriesModels);
router.get('/:id', getZigzagSeriesModelById);
router.put('/:id', upload.single('image'), updateZigzagSeriesModel); // Handle image upload on update
router.delete('/:id', deleteZigzagSeriesModel);
router.get('/schema/fields', getZigzagSeriesModelSchemaFields);

export default router;
