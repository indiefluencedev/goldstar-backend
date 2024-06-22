import HeatTransferModel from '../models/heatTransferfolder/heatTransferSchema.js';
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

// Create Heat Transfer Model
export const createHeatTransferModel = async (req, res) => {
    try {
        let newModelData;

        if (req.is('multipart/form-data')) {
            newModelData = {
                model: req.body.model,
                technicalDescription: req.body.technicalDescription,
                detailedTechnicalDescription: req.body.detailedTechnicalDescription,
                voltage: req.body.voltage,
                power: req.body.power,
                workingDimension: req.body.workingDimension,
                workingTemperature: req.body.workingTemperature,
                TimeDelay: req.body.TimeDelay,
                image: req.file ? req.file.path : req.body.image,
                subModels: JSON.parse(req.body.subModels || '[]'),
            };
        } else {
            newModelData = req.body;
        }

        const newModel = new HeatTransferModel(newModelData);
        await newModel.save();

        res.status(201).json({ message: 'Model created successfully', model: newModel });
    } catch (error) {
        console.error('Error creating model:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all Heat Transfer Models
export const getHeatTransferModels = async (req, res) => {
    try {
        const models = await HeatTransferModel.find();
        res.status(200).json(models);
    } catch (error) {
        console.error('Error fetching models:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get Heat Transfer Model by ID
export const getHeatTransferModelById = async (req, res) => {
    try {
        const model = await HeatTransferModel.findById(req.params.id);
        if (!model) {
            return res.status(404).json({ message: 'Model not found' });
        }
        res.status(200).json(model);
    } catch (error) {
        console.error('Error fetching model by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update Heat Transfer Model
export const updateHeatTransferModel = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedData = req.body;

        if (req.file) {
            updatedData.image = req.file.path;
        }

        const model = await HeatTransferModel.findByIdAndUpdate(id, updatedData, { new: true });
        if (!model) {
            return res.status(404).json({ message: 'Model not found' });
        }

        res.status(200).json({ message: 'Model updated successfully', model });
    } catch (error) {
        console.error('Error updating model:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete Heat Transfer Model
export const deleteHeatTransferModel = async (req, res) => {
    try {
        const model = await HeatTransferModel.findByIdAndDelete(req.params.id);
        if (!model) {
            return res.status(404).json({ message: 'Model not found' });
        }

        res.status(200).json({ message: 'Model deleted successfully' });
    } catch (error) {
        console.error('Error deleting model:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get Heat Transfer Model Schema Fields
export const getHeatTransferModelSchemaFields = async (req, res) => {
    try {
        const schemaFields = Object.keys(HeatTransferModel.schema.paths).reduce((fields, path) => {
            fields[path] = HeatTransferModel.schema.paths[path].instance;
            return fields;
        }, {});
        res.status(200).json(schemaFields);
    } catch (error) {
        console.error('Error fetching schema fields:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export { upload };
