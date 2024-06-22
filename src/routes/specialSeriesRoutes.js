import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    createSpecialSeriesModel,
    getSpecialSeriesModels,
    getSpecialSeriesModelById,
    updateSpecialSeriesModel,
    deleteSpecialSeriesModel,
    getSpecialSeriesModelSchemaFields
} from '../controllers/specialSeriesController.js';

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
router.post('/', upload.single('image'), createSpecialSeriesModel); // Handle image upload on create
router.get('/', getSpecialSeriesModels);
router.get('/:id', getSpecialSeriesModelById);
router.put('/:id', upload.single('image'), updateSpecialSeriesModel); // Handle image upload on update
router.delete('/:id', deleteSpecialSeriesModel);
router.get('/schema/fields', getSpecialSeriesModelSchemaFields);

export default router;
