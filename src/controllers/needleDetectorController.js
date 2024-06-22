import NeedleDetectorModel from '../models/needleDetectorfolder/needleDetectorSchema.js';
import multer from 'multer';
import path from 'path';

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage });

// Create Needle Detector Model
export const createNeedleDetectorModel = async (req, res) => {
    try {
        let newModelData;

        if (req.is('multipart/form-data')) {
            newModelData = {
                model: req.body.model,
                technicalDescription: req.body.technicalDescription,
                detailedTechnicalDescription: req.body.detailedTechnicalDescription,
                detectionWidth: req.body.detectionWidth,
                detectionHeight: req.body.detectionHeight,
                testingStandard: req.body.testingStandard,
                volume: req.body.volume,
                approximateWeight: req.body.approximateWeight,
                power: req.body.power,
                powerSupply: req.body.powerSupply,
                image: req.file ? req.file.path : req.body.image,
                subModels: JSON.parse(req.body.subModels || '[]'),
            };
        } else {
            newModelData = req.body;
        }

        const newModel = new NeedleDetectorModel(newModelData);
        await newModel.save();

        res.status(201).json({ message: 'Model created successfully', model: newModel });
    } catch (error) {
        console.error('Error creating model:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all Needle Detector Models
export const getNeedleDetectorModels = async (req, res) => {
    try {
        const models = await NeedleDetectorModel.find();
        res.status(200).json(models);
    } catch (error) {
        console.error('Error fetching models:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get Needle Detector Model by ID
export const getNeedleDetectorModelById = async (req, res) => {
    try {
        const model = await NeedleDetectorModel.findById(req.params.id);
        if (!model) {
            return res.status(404).json({ message: 'Model not found' });
        }
        res.status(200).json(model);
    } catch (error) {
        console.error('Error fetching model by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update Needle Detector Model
export const updateNeedleDetectorModel = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedData = req.body;

        if (req.file) {
            updatedData.image = req.file.path;
        }

        const model = await NeedleDetectorModel.findByIdAndUpdate(id, updatedData, { new: true });
        if (!model) {
            return res.status(404).json({ message: 'Model not found' });
        }

        res.status(200).json({ message: 'Model updated successfully', model });
    } catch (error) {
        console.error('Error updating model:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete Needle Detector Model
export const deleteNeedleDetectorModel = async (req, res) => {
    try {
        const model = await NeedleDetectorModel.findByIdAndDelete(req.params.id);
        if (!model) {
            return res.status(404).json({ message: 'Model not found' });
        }

        res.status(200).json({ message: 'Model deleted successfully' });
    } catch (error) {
        console.error('Error deleting model:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get Needle Detector Model Schema Fields
export const getNeedleDetectorModelSchemaFields = async (req, res) => {
    try {
        const schemaFields = Object.keys(NeedleDetectorModel.schema.paths).reduce((fields, path) => {
            fields[path] = NeedleDetectorModel.schema.paths[path].instance;
            return fields;
        }, {});
        res.status(200).json(schemaFields);
    } catch (error) {
        console.error('Error fetching schema fields:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export { upload };
