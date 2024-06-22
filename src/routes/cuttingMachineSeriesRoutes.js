import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    createCuttingMachineSeriesModel,
    getCuttingMachineSeriesModels,
    getCuttingMachineSeriesModelById,
    updateCuttingMachineSeriesModel,
    deleteCuttingMachineSeriesModel,
    getCuttingMachineSeriesModelSchemaFields
} from '../controllers/cuttingMachineSeriesController.js';

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
router.post('/', upload.single('image'), createCuttingMachineSeriesModel); // Handle image upload on create
router.get('/', getCuttingMachineSeriesModels);
router.get('/:id', getCuttingMachineSeriesModelById);
router.put('/:id', upload.single('image'), updateCuttingMachineSeriesModel); // Handle image upload on update
router.delete('/:id', deleteCuttingMachineSeriesModel);
router.get('/schema/fields', getCuttingMachineSeriesModelSchemaFields);

export default router;
