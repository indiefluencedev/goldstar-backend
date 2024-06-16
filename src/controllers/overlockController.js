import OverlockModel from '../models/overlockfolder/overlockSchema.js';
import multer from 'multer';
import path from 'path';
import updateSeriesWithNewModels from '../updateSeriesWithNewModels.js';
import cleanupSeries from '../cleanupSeries.js'; // Import the cleanupSeries function

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

// Create Overlock Model
export const createOverlockModel = async (req, res) => {
    try {
        let newModelData;

        if (req.is('multipart/form-data')) {
            newModelData = {
                model: req.body.model,
                technicalDescription: req.body.technicalDescription,
                detailedTechnicalDescription: req.body.detailedTechnicalDescription,
                functions: req.body.functions,
                needleType: req.body.needleType,
                needleNo: Number(req.body.needleNo),
                threadNo: Number(req.body.threadNo),
                doubleNeedleStitchLength: req.body.doubleNeedleStitchLength,
                stitchLengthRange: Number(req.body.stitchLengthRange),
                stitchWidthRange: Number(req.body.stitchWidthRange),
                liftHeightRange: Number(req.body.liftHeightRange),
                isSuitableForLightMaterial: req.body.isSuitableForLightMaterial === 'true',
                isSuitableForMediumMaterial: req.body.isSuitableForMediumMaterial === 'true',
                isSuitableForHeavyMaterial: req.body.isSuitableForHeavyMaterial === 'true',
                differentialRatio: req.body.differentialRatio,
                speedInRPM: Number(req.body.speedInRPM),
                image: req.file ? req.file.path : req.body.image,
                series: req.body.series,
                subModels: JSON.parse(req.body.subModels || '[]'),
            };
        } else {
            newModelData = req.body;
        }

        const newModel = new OverlockModel(newModelData);
        await newModel.save();
        
        // Run the series update function
        await updateSeriesWithNewModels();

        res.status(201).json({ message: 'Model created successfully', model: newModel });
    } catch (error) {
        console.error('Error creating model:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all Overlock Models
export const getOverlockModels = async (req, res) => {
    try {
        const models = await OverlockModel.find();
        res.status(200).json(models);
    } catch (error) {
        console.error('Error fetching models:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get Overlock Model by ID
export const getOverlockModelById = async (req, res) => {
    try {
        const model = await OverlockModel.findById(req.params.id);
        if (!model) {
            return res.status(404).json({ message: 'Model not found' });
        }
        res.status(200).json(model);
    } catch (error) {
        console.error('Error fetching model by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update Overlock Model
export const updateOverlockModel = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if an image file is uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }

        const updatedData = { image: req.file.path };

        const model = await OverlockModel.findByIdAndUpdate(id, updatedData, { new: true });
        if (!model) {
            return res.status(404).json({ message: 'Model not found' });
        }

        // Run the series update function
        await updateSeriesWithNewModels();

        res.status(200).json({ message: 'Model updated successfully', model });
    } catch (error) {
        console.error('Error updating model:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete Overlock Model
export const deleteOverlockModel = async (req, res) => {
    try {
        const model = await OverlockModel.findByIdAndDelete(req.params.id);
        if (!model) {
            return res.status(404).json({ message: 'Model not found' });
        }

        // Run the series update function
        await updateSeriesWithNewModels();

        // Clean up series references
        await cleanupSeries();

        res.status(200).json({ message: 'Model deleted successfully' });
    } catch (error) {
        console.error('Error deleting model:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get Overlock Model Schema Fields
export const getOverlockModelSchemaFields = async (req, res) => {
    try {
        const schemaFields = Object.keys(OverlockModel.schema.paths).reduce((fields, path) => {
            fields[path] = OverlockModel.schema.paths[path].instance;
            return fields;
        }, {});
        res.status(200).json(schemaFields);
    } catch (error) {
        console.error('Error fetching schema fields:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export { upload };
