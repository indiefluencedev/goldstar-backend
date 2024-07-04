import mongoose from 'mongoose';
import Series from './models/seriesSchema.js';
import LockstitchModel from './models/lockstitchfolder/lockstitchSchema.js';
import OverlockModel from './models/overlockfolder/overlockSchema.js';
import InterlockModel from './models/interlockfolder/interlockSchema.js';
import HeavyDutyModel from './models/heavyDutyfolder/heavyDutySchema.js';
import SpecialSeriesModel from './models/specialSeriesfolder/specialSeriesSchema.js';
import ZigzagModel from './models/zigzagSeriesfolder/zigzagSeriesSchema.js';
import CuttingSeriesModel from './models/CuttingSchemafolder/CuttingSchema.js';
// import CuttingMachineSeriesModel from './models/cuttingMachineSeriesfolder/cuttingMachineSeriesSchema.js';
import FusingMachineModel from './models/fusingMachineSeriesfolder/fusingMachineSeriesSchema.js';
import HeatTransferModel from './models/heatTransferfolder/heatTransferSchema.js';
import NeedleDetectorModel from './models/needleDetectorfolder/needleDetectorSchema.js';

const modelMapping = {
    Lockstitch: LockstitchModel,
    Overlock: OverlockModel,
    Interlock: InterlockModel,
    HeavyDuty: HeavyDutyModel,
    SpecialSeries: SpecialSeriesModel,
    Zigzag: ZigzagModel,
    CuttingSeries: CuttingSeriesModel,
    // Cuttingmachine: CuttingMachineSeriesModel,
    Fusingmachine: FusingMachineModel,
    Heattransfer: HeatTransferModel,
    Needledetector: NeedleDetectorModel
};

const updateSeriesWithNewModels = async () => {
    try {
        // Fetch all series documents
        const allSeries = await Series.find({});

        for (const series of allSeries) {
            const Model = modelMapping[series.modelType];

            if (!Model) {
                console.error(`Model type ${series.modelType} not found in modelMapping.`);
                continue;
            }

            // Fetch all models of this type
            const allModels = await Model.find({}).exec();
            const modelIds = allModels.map(model => model._id.toString());

            // Filter out existing models
            const existingModelIds = series.models.map(id => id.toString());
            const newModelIds = modelIds.filter(id => !existingModelIds.includes(id));

            // If there are new models, update the series
            if (newModelIds.length > 0) {
                const updatedModels = [...existingModelIds, ...newModelIds];
                await Series.findByIdAndUpdate(
                    series._id,
                    { models: updatedModels },
                    { new: true }
                );
                console.log(`Updated series ${series.name} with new models.`);
            }
        }

        console.log('Series update with new models completed.');
    } catch (error) {
        console.error('Error during series update with new models:', error);
    }
};

export default updateSeriesWithNewModels;
