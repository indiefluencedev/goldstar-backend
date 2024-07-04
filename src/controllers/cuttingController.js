import CuttingModel from '../models/CuttingSchemafolder/CuttingSchema.js';
import multer from 'multer';
import updateSeriesWithNewModels from '../updateSeriesWithNewModels.js';
import cleanupSeries from '../cleanupSeries.js';
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

// Create Cutting Model
export const createCuttingModel = async (req, res) => {
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
                doubleNeedleStitchLength: req.body.doubleNeedleStitchLength,
                stitchLengthRange: req.body.stitchLengthRange,
                stitchWidthRange: req.body.stitchWidthRange,
                liftHeightRange: req.body.liftHeightRange,
                isSuitableForLightMaterial: req.body.isSuitableForLightMaterial === 'true',
                isSuitableForMediumMaterial: req.body.isSuitableForMediumMaterial === 'true',
                isSuitableForHeavyMaterial: req.body.isSuitableForHeavyMaterial === 'true',
                weight: req.body.weight,
                packingSize: req.body.packingSize,
                differentialRatio: req.body.differentialRatio,
                speedInRPM: req.body.speedInRPM,
                quantityOfStandardPattern: req.body.quantityOfStandardPattern,
                rateOfMagnifyAndShrink: req.body.rateOfMagnifyAndShrink,
                powerOfMotorsOutputting: req.body.powerOfMotorsOutputting,
                power: req.body.power,
                cutterSize: req.body.cutterSize,
                buttonDiameter: req.body.buttonDiameter,
                stitchWidth: req.body.stitchWidth,
                dot: req.body.dot,
                plug: req.body.plug,
                buttonHoleWidth: req.body.buttonHoleWidth,
                cuttingHeight: req.body.cuttingHeight,
                voltage: req.body.voltage,
                frequency: req.body.frequency,
                pipingCuttingWidth: req.body.pipingCuttingWidth,
                tableSize: req.body.tableSize,
                armSize: req.body.armSize,
                knifeSize: req.body.knifeSize,
                netWeight: req.body.netWeight,
                powerSupply: req.body.powerSupply,
                ratedOutput: req.body.ratedOutput,
                temperature: req.body.temperature,
                pressure: req.body.pressure,
                beltSpeed: req.body.beltSpeed,
                heatingTime: req.body.heatingTime,
                fusingWidth: req.body.fusingWidth,
                dimension: req.body.dimension,
                cuttingLength: req.body.cuttingLength,
                maximumCutting: req.body.maximumCutting,
                cuttingSpeed: req.body.cuttingSpeed,
                maximumBladeTemperature: req.body.maximumBladeTemperature,
                powerKw: req.body.powerKw,
                packageSizeLxWxH: req.body.packageSizeLxWxH,
                recommendedAirPressure: req.body.recommendedAirPressure,
                oil: req.body.oil,
                image: req.file ? req.file.path : req.body.image,
                series: req.body.series,
                subModels: JSON.parse(req.body.subModels || '[]'),
            };
        } else {
            newModelData = req.body;
        }

        // Check for duplicate model
        const existingModel = await CuttingModel.findOne({ model: newModelData.model });
        if (existingModel) {
            return res.status(409).json({ message: 'Model already exists' });
        }

        const newModel = new CuttingModel(newModelData);
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

// Get all Cutting Models
export const getCuttingModels = async (req, res) => {
    try {
        const models = await CuttingModel.find();
        res.status(200).json(models);
    } catch (error) {
        console.error('Error fetching models:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get Cutting Model by ID
export const getCuttingModelById = async (req, res) => {
    try {
        const model = await CuttingModel.findById(req.params.id);
        if (!model) {
            return res.status(404).json({ message: 'Model not found' });
        }
        res.status(200).json(model);
    } catch (error) {
        console.error('Error fetching model by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update Cutting Model
export const updateCuttingModel = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if an image file is uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }

        const updatedData = { image: req.file.path };

        const model = await CuttingModel.findByIdAndUpdate(id, updatedData, { new: true });
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

// Delete Cutting Model
export const deleteCuttingModel = async (req, res) => {
    try {
        const model = await CuttingModel.findByIdAndDelete(req.params.id);
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

// Get Cutting Model Schema Fields
export const getCuttingModelSchemaFields = async (req, res) => {
    try {
        const schemaFields = Object.keys(CuttingModel.schema.paths).reduce((fields, path) => {
            fields[path] = CuttingModel.schema.paths[path].instance;
            return fields;
        }, {});
        res.status(200).json(schemaFields);
    } catch (error) {
        console.error('Error fetching schema fields:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export { upload };
