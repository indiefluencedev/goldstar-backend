import LockstitchModel from '../models/lockstitchfolder/lockstitchSchema.js';
import multer from 'multer';
import updateSeriesWithNewModels from '../updateSeriesWithNewModels.js';
import cleanupSeries from '../cleanupSeries.js'
import path from 'path'; // Make sure to import path if not already done

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

// Create Lockstitch Model
export const createLockstitchModel = async (req, res) => {
    try {
        let newModelData;

        if (req.is('multipart/form-data')) {
            newModelData = {
                model: req.body.model,
                technicalDescription: req.body.technicalDescription,
                detailedTechnicalDescription: req.body.detailedTechnicalDescription,
                functions: req.body.functions,
                needleType: req.body.needleType,
                needleFeed: req.body.needleFeed === 'true',
                doubleNeedleStitchLength: req.body.doubleNeedleStitchLength,
                liftHeightRange: req.body.liftHeightRange,
                hasAutoThreadTrimmer: req.body.hasAutoThreadTrimmer === 'true',
                hasAutoLift: req.body.hasAutoLift === 'true',
                isSuitableForLightMaterial: req.body.isSuitableForLightMaterial === 'true',
                isSuitableForMediumMaterial: req.body.isSuitableForMediumMaterial === 'true',
                isSuitableForHeavyMaterial: req.body.isSuitableForHeavyMaterial === 'true',
                horizontalHook: req.body.horizontalHook === 'true',
                weight: req.body.weight,
                packingSize: req.body.packingSize,
                speedInRPM: Number(req.body.speedInRPM),
                image: req.file ? req.file.path : req.body.image,
                series: req.body.series,
                subModels: JSON.parse(req.body.subModels || '[]'),
            };
        } else {
            newModelData = req.body;
        }

        const newModel = new LockstitchModel(newModelData);
        await newModel.save();
        
        // Run the series update function
        await updateSeriesWithNewModels();
        await cleanupSeries();

        res.status(201).json({ message: 'Model created successfully', model: newModel });
    } catch (error) {
        console.error('Error creating model:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all Lockstitch Models
export const getLockstitchModels = async (req, res) => {
    try {
        const models = await LockstitchModel.find();
        res.status(200).json(models);
    } catch (error) {
        console.error('Error fetching models:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get Lockstitch Model by ID
export const getLockstitchModelById = async (req, res) => {
    try {
        const model = await LockstitchModel.findById(req.params.id);
        if (!model) {
            return res.status(404).json({ message: 'Model not found' });
        }
        res.status(200).json(model);
    } catch (error) {
        console.error('Error fetching model by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update Lockstitch Model
export const updateLockstitchModel = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if an image file is uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }

        const updatedData = { image: req.file.path };

        const model = await LockstitchModel.findByIdAndUpdate(id, updatedData, { new: true });
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

// Delete Lockstitch Model
// Delete Lockstitch Model
export const deleteLockstitchModel = async (req, res) => {
    try {
        const model = await LockstitchModel.findByIdAndDelete(req.params.id);
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


// Get Lockstitch Model Schema Fields
export const getLockstitchModelSchemaFields = async (req, res) => {
    try {
        const schemaFields = Object.keys(LockstitchModel.schema.paths).reduce((fields, path) => {
            fields[path] = LockstitchModel.schema.paths[path].instance;
            return fields;
        }, {});
        res.status(200).json(schemaFields);
    } catch (error) {
        console.error('Error fetching schema fields:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export { upload };
