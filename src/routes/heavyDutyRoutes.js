import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    createHeavyDutyModel,
    getHeavyDutyModels,
    getHeavyDutyModelById,
    updateHeavyDutyModel,
    deleteHeavyDutyModel,
    getHeavyDutyModelSchemaFields
} from '../controllers/heavyDutyController.js';

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
router.post('/', upload.single('image'), createHeavyDutyModel); // Handle image upload on create
router.get('/', getHeavyDutyModels);
router.get('/:id', getHeavyDutyModelById);
router.put('/:id', upload.single('image'), updateHeavyDutyModel); // Handle image upload on update
router.delete('/:id', deleteHeavyDutyModel);
router.get('/schema/fields', getHeavyDutyModelSchemaFields);

export default router;
