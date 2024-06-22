import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    createHeatTransferModel,
    getHeatTransferModels,
    getHeatTransferModelById,
    updateHeatTransferModel,
    deleteHeatTransferModel,
    getHeatTransferModelSchemaFields
} from '../controllers/heatTransferController.js';

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
router.post('/', upload.single('image'), createHeatTransferModel); // Handle image upload on create
router.get('/', getHeatTransferModels);
router.get('/:id', getHeatTransferModelById);
router.put('/:id', upload.single('image'), updateHeatTransferModel); // Handle image upload on update
router.delete('/:id', deleteHeatTransferModel);
router.get('/schema/fields', getHeatTransferModelSchemaFields);

export default router;
