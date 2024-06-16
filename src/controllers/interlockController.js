import InterlockModel from '../models/interlockfolder/interlockSchema.js';
import updateSeriesWithNewModels from '../updateSeriesWithNewModels.js';
import cleanupSeries from '../cleanupSeries.js';

// Create Interlock Model
export const createInterlockModel = async (req, res) => {
    try {
        let newModelData;

        if (req.is('multipart/form-data')) {
            newModelData = {
                model: req.body.model,
                technicalDescription: req.body.technicalDescription,
                detailedTechnicalDescription: req.body.detailedTechnicalDescription,
                functions: req.body.functions,
                needleType: req.body.needleType,
                needleGauge: req.body.needleGauge,
                needleNo: req.body.needleNo,
                needleBarStroke: req.body.needleBarStroke,
                threadNo: req.body.threadNo,
                stitchLengthRange: req.body.stitchLengthRange,
                stitchWidthRange: req.body.stitchWidthRange,
                liftHeightRange: req.body.liftHeightRange,
                stitchWidthForInterlockSeries: req.body.stitchWidthForInterlockSeries, // New field
                isSuitableForLightMaterial: req.body.isSuitableForLightMaterial === 'true',
                isSuitableForMediumMaterial: req.body.isSuitableForMediumMaterial === 'true',
                isSuitableForHeavyMaterial: req.body.isSuitableForHeavyMaterial === 'true',
                weight: req.body.weight,
                packingSize: req.body.packingSize,
                differentialRatio: req.body.differentialRatio,
                speedInRPM: req.body.speedInRPM,
                image: req.file ? req.file.path : req.body.image,
                series: req.body.series,
                subModels: req.body.subModels ? JSON.parse(req.body.subModels) : []
            };
        } else {
            newModelData = req.body;
        }

        const newModel = new InterlockModel(newModelData);
        await newModel.save();
        
        // Run the series update function
        await updateSeriesWithNewModels();

        res.status(201).json({ message: 'Model created successfully', model: newModel });
    } catch (error) {
        console.error('Error creating model:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all Interlock Models
export const getInterlockModels = async (req, res) => {
    try {
        const models = await InterlockModel.find();
        res.status(200).json(models);
    } catch (error) {
        console.error('Error fetching models:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get Interlock Model by ID
export const getInterlockModelById = async (req, res) => {
    try {
        const model = await InterlockModel.findById(req.params.id);
        if (!model) {
            return res.status(404).json({ message: 'Model not found' });
        }
        res.status(200).json(model);
    } catch (error) {
        console.error('Error fetching model by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update Interlock Model
export const updateInterlockModel = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if an image file is uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }

        const updatedData = { image: req.file.path };

        const model = await InterlockModel.findByIdAndUpdate(id, updatedData, { new: true });
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

// Delete Interlock Model
export const deleteInterlockModel = async (req, res) => {
    try {
        const model = await InterlockModel.findByIdAndDelete(req.params.id);
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

// Get Interlock Model Schema Fields
export const getInterlockModelSchemaFields = async (req, res) => {
    try {
        const schemaFields = Object.keys(InterlockModel.schema.paths).reduce((fields, path) => {
            fields[path] = InterlockModel.schema.paths[path].instance;
            return fields;
        }, {});
        res.status(200).json(schemaFields);
    } catch (error) {
        console.error('Error fetching schema fields:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
