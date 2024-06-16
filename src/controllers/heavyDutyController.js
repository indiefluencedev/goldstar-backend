import HeavyDutyModel from '../models/heavyDutyfolder/heavyDutySchema.js';
import Series from '../models/seriesSchema.js';
import updateSeriesWithNewModels from '../updateSeriesWithNewModels.js';
import cleanupSeries from '../cleanupSeries.js'; // Import the cleanupSeries function
import multer from 'multer';
import path from 'path';

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage });

// Create HeavyDuty Model
export const createHeavyDutyModel = async (req, res) => {
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
                needleNo: Number(req.body.needleNo),
                threadNo: Number(req.body.threadNo),
                doubleNeedleStitchLength: Number(req.body.doubleNeedleStitchLength),
                stitchLengthRange: Number(req.body.stitchLengthRange),
                liftHeightRange: Number(req.body.liftHeightRange),
                hasAutoThreadTrimmer: req.body.hasAutoThreadTrimmer === 'true',
                hasAutoLift: req.body.hasAutoLift === 'true',
                isSuitableForLightMaterial: req.body.isSuitableForLightMaterial === 'true',
                isSuitableForMediumMaterial: req.body.isSuitableForMediumMaterial === 'true',
                isSuitableForHeavyMaterial: req.body.isSuitableForHeavyMaterial === 'true',
                horizontalHook: req.body.horizontalHook === 'true',
                verticalHook: req.body.verticalHook === 'true',
                weight: Number(req.body.weight),
                packingSize: Number(req.body.packingSize),
                differentialRatio: Number(req.body.differentialRatio),
                speedInRPM: Number(req.body.speedInRPM),
                image: req.file ? req.file.path : req.body.image,
                series: req.body.series,
                subModels: JSON.parse(req.body.subModels || '[]'),
            };
        } else {
            newModelData = req.body;
        }

        const newModel = new HeavyDutyModel(newModelData);
        await newModel.save();
        
        // Run the series update function
        await updateSeriesWithNewModels();

        res.status(201).json({ message: 'Model created successfully', model: newModel });
    } catch (error) {
        console.error('Error creating model:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all HeavyDuty Models
export const getHeavyDutyModels = async (req, res) => {
    try {
        const models = await HeavyDutyModel.find().populate('series').populate('subModels');
        res.status(200).json(models);
    } catch (error) {
        console.error('Error fetching models:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get HeavyDuty Model by ID
export const getHeavyDutyModelById = async (req, res) => {
    try {
        const { id } = req.params;
        const model = await HeavyDutyModel.findById(id).populate('series').populate('subModels');
        if (!model) {
            return res.status(404).json({ message: 'Model not found' });
        }
        res.status(200).json(model);
    } catch (error) {
        console.error('Error fetching model by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update HeavyDuty Model by ID (only image field)
export const updateHeavyDutyModel = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if an image file is uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }

        const updatedData = { image: req.file.path };

        const model = await HeavyDutyModel.findByIdAndUpdate(id, updatedData, { new: true });
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

// Delete HeavyDuty Model by ID
export const deleteHeavyDutyModel = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedModel = await HeavyDutyModel.findByIdAndDelete(id);
        if (!deletedModel) {
            return res.status(404).json({ message: 'Model not found' });
        }

        // Remove model reference from series
        const seriesDoc = await Series.findById(deletedModel.series);
        if (seriesDoc) {
            seriesDoc.models.pull(deletedModel._id);
            await seriesDoc.save();
        }

        // Run the series update function
        await updateSeriesWithNewModels();

        // Clean up series references
        await cleanupSeries();

        res.status(200).json({ message: 'Model deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get HeavyDuty Model Schema Fields
export const getHeavyDutyModelSchemaFields = (req, res) => {
    try {
        const schemaFields = HeavyDutyModel.schema.paths;
        const fields = {};

        for (let field in schemaFields) {
            const fieldInfo = schemaFields[field];
            fields[field] = {
                type: fieldInfo.instance,
                default: fieldInfo.options.default
            };
        }

        res.status(200).json(fields);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { upload };
