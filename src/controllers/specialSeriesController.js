import SpecialSeriesModel from '../models/specialSeriesfolder/specialSeriesSchema.js';
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

// Create SpecialSeries Model
export const createSpecialSeriesModel = async (req, res) => {
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
                needleGauge: req.body.needleGauge,
                needleNo: req.body.needleNo,
                needleBarStroke: req.body.needleBarStroke,
                threadNo: req.body.threadNo,
                doubleNeedleStitchLength: req.body.doubleNeedleStitchLength,
                stitchLengthRange: req.body.stitchLengthRange,
                stitchWidthRange: req.body.stitchWidthRange,
                liftHeightRange: req.body.liftHeightRange,
                hasAutoThreadTrimmer: req.body.hasAutoThreadTrimmer === 'true',
                hasAutoLift: req.body.hasAutoLift === 'true',
                isSuitableForLightMaterial: req.body.isSuitableForLightMaterial === 'true',
                isSuitableForMediumMaterial: req.body.isSuitableForMediumMaterial === 'true',
                isSuitableForHeavyMaterial: req.body.isSuitableForHeavyMaterial === 'true',
                horizontalHook: req.body.horizontalHook === 'true',
                verticalHook: req.body.verticalHook === 'true',
                weight: req.body.weight,
                packingSize: req.body.packingSize,
                differentialRatio: req.body.differentialRatio,
                speedInRPM: req.body.speedInRPM,
                quantityOfStandardPattern: req.body.quantityOfStandardPattern,
                rateOfMagnifyAndShrink: req.body.rateOfMagnifyAndShrink,
                powerOfMotorsOutputting: req.body.powerOfMotorsOutputting,
                power: req.body.power,
                cutterSize: req.body.cutterSize,
                zigzagSewingLength: req.body.zigzagSewingLength,
                buttonDiameter: req.body.buttonDiameter,
                buttonStitch: req.body.buttonStitch,
                stirches: req.body.stirches,
                sewingArea: req.body.sewingArea,
                sizeOfButtonsThatCanBeSewn: req.body.sizeOfButtonsThatCanBeSewn,
                clothFeedingMethod: req.body.clothFeedingMethod,
                pitch: req.body.pitch,
                maximumNumberOfStitches: req.body.maximumNumberOfStitches,
                presserFootLiftMethod: req.body.presserFootLiftMethod,
                liftingAmountOfPresserFoot: req.body.liftingAmountOfPresserFoot,
                buttonClampLift: req.body.buttonClampLift,
                useHook: req.body.useHook,
                wipingDevice: req.body.wipingDevice,
                threadCuttingDevice: req.body.threadCuttingDevice,
                dataStorageMethod: req.body.dataStorageMethod,
                externalDataStorageMedium: req.body.externalDataStorageMedium,
                numberOfCyclicPrograms: req.body.numberOfCyclicPrograms,
                storingData: req.body.storingData,
                motors: req.body.motors,
                powerSupply: req.body.powerSupply,
                barometricPressure: req.body.barometricPressure,
                oilSupply: req.body.oilSupply,
                threadNipper: req.body.threadNipper,
                twoStepPresserFoot: req.body.twoStepPresserFoot,
                intermittentPressureRise: req.body.intermittentPressureRise,
                intermittentPressureOnTheTrip: req.body.intermittentPressureOnTheTrip,
                speed: req.body.speed,
                compressedAir: req.body.compressedAir,
                upperPressureWheelLiftDistance: req.body.upperPressureWheelLiftDistance,
                maxOveredgingWidth: req.body.maxOveredgingWidth,
                threadLine: req.body.threadLine,
                maxSewingThick: req.body.maxSewingThick,
                needleStitchRange: req.body.needleStitchRange,
                image: req.file ? req.file.path : req.body.image,
                series: req.body.series,
                subModels: JSON.parse(req.body.subModels || '[]'),
            };
        } else {
            newModelData = req.body;
        }

        const newModel = new SpecialSeriesModel(newModelData);
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

// Get all SpecialSeries Models
export const getSpecialSeriesModels = async (req, res) => {
    try {
        const models = await SpecialSeriesModel.find();
        res.status(200).json(models);
    } catch (error) {
        console.error('Error fetching models:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get SpecialSeries Model by ID
export const getSpecialSeriesModelById = async (req, res) => {
    try {
        const model = await SpecialSeriesModel.findById(req.params.id);
        if (!model) {
            return res.status(404).json({ message: 'Model not found' });
        }
        res.status(200).json(model);
    } catch (error) {
        console.error('Error fetching model by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update SpecialSeries Model
export const updateSpecialSeriesModel = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if an image file is uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }

        const updatedData = { image: req.file.path };

        const model = await SpecialSeriesModel.findByIdAndUpdate(id, updatedData, { new: true });
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

// Delete SpecialSeries Model
export const deleteSpecialSeriesModel = async (req, res) => {
    try {
        const model = await SpecialSeriesModel.findByIdAndDelete(req.params.id);
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

// Get SpecialSeries Model Schema Fields
export const getSpecialSeriesModelSchemaFields = async (req, res) => {
    try {
        const schemaFields = Object.keys(SpecialSeriesModel.schema.paths).reduce((fields, path) => {
            fields[path] = SpecialSeriesModel.schema.paths[path].instance;
            return fields;
        }, {});
        res.status(200).json(schemaFields);
    } catch (error) {
        console.error('Error fetching schema fields:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export { upload };
