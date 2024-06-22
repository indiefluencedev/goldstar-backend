import express from 'express';
import {
    createFusingMachineSeriesModel,
    getFusingMachineSeriesModels,
    getFusingMachineSeriesModelById,
    updateFusingMachineSeriesModel,
    deleteFusingMachineSeriesModel,
    getFusingMachineSeriesModelSchemaFields,
    upload
} from '../controllers/fusingMachineSeriesController.js';

const router = express.Router();

// Routes
router.post('/', upload.single('image'), createFusingMachineSeriesModel); // Handle image upload on create
router.get('/', getFusingMachineSeriesModels);
router.get('/:id', getFusingMachineSeriesModelById);
router.put('/:id', upload.single('image'), updateFusingMachineSeriesModel); // Handle image upload on update
router.delete('/:id', deleteFusingMachineSeriesModel);
router.get('/schema/fields', getFusingMachineSeriesModelSchemaFields);

export default router;
