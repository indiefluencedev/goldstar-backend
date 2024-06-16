import mongoose from 'mongoose';
import Series from './models/seriesSchema.js';
import LockstitchModel from './models/lockstitchfolder/lockstitchSchema.js';
import OverlockModel from './models/overlockfolder/overlockSchema.js';
import InterlockModel from './models/interlockfolder/interlockSchema.js';
import HeavyDutyModel from './models/heavyDutyfolder/heavyDutySchema.js';
// import SpecialSeriesModel from './models/specialSeriesSchema.js';
// import ZigzagModel from './models/zigzagSchema.js';
// import CuttingModel from './models/cuttingSchema.js';

const modelMapping = {
    Lockstitch: LockstitchModel,
    Overlock: OverlockModel,
    Interlock: InterlockModel,
    HeavyDuty: HeavyDutyModel,
    // SpecialSeries: SpecialSeriesModel,
    // Zigzag: ZigzagModel,
    // Cutting: CuttingModel
};

const cleanupSeries = async () => {
    try {
        // Fetch all series documents
        const allSeries = await Series.find({});

        for (const series of allSeries) {
            const validModels = [];
            const Model = modelMapping[series.modelType];

            if (!Model) {
                console.error(`Model type ${series.modelType} not found in modelMapping.`);
                continue;
            }

            // Check each model reference
            for (const modelId of series.models) {
                const modelExists = await Model.findById(modelId).exec();

                if (modelExists) {
                    validModels.push(modelId);
                }
            }

            // Update the series document with only valid models
            series.models = validModels;
            await series.save();
        }

        console.log('Series cleanup completed.');
    } catch (error) {
        console.error('Error during series cleanup:', error);
    }
};

export default cleanupSeries;
