import OverlockModel from '../models/overlockfolder/overlockSchema.js';
import LockstitchModel from '../models/lockstitchfolder/lockstitchSchema.js';
import InterlockModel from '../models/interlockfolder/interlockSchema.js';
import HeavyDutyModel from '../models/heavyDutyfolder/heavyDutySchema.js';
import SpecialSeriesModel from '../models/specialSeriesfolder/specialSeriesSchema.js';
import ZigzagModel from '../models/zigzagSeriesfolder/zigzagSeriesSchema.js';
import CuttingModel from '../models/CuttingSchemafolder/CuttingSchema.js';
import CuttingMachineSeriesModel from '../models/cuttingMachineSeriesfolder/cuttingMachineSeriesSchema.js';
import FusingMachineSeriesModel from '../models/fusingMachineSeriesfolder/fusingMachineSeriesSchema.js';
import HeatTransferModel from '../models/heatTransferfolder/heatTransferSchema.js';
import NeedleDetectorModel from '../models/needleDetectorfolder/needleDetectorSchema.js';

const modelMap = {
    Lockstitch: LockstitchModel,
    Overlock: OverlockModel,
    Interlock: InterlockModel,
    HeavyDuty: HeavyDutyModel,
    SpecialSeries: SpecialSeriesModel,
    Zigzag: ZigzagModel,
    Cutting: CuttingModel,
    Cuttingmachine: CuttingMachineSeriesModel,
    Fusingmachine: FusingMachineSeriesModel,
    Heattransfer: HeatTransferModel,
    Needledetector: NeedleDetectorModel

};

const getModelByType = (type) => {
    return modelMap[type];
};

// Universal getModelById controller
export const getModelById = async (req, res) => {
    const { type, id } = req.params;
    const Model = getModelByType(type);
    if (!Model) return res.status(400).json({ message: 'Invalid model type' });

    try {
        const model = await Model.findById(id).populate('series').populate('subModels');
        if (!model) return res.status(404).json({ message: 'Model not found' });
        res.status(200).json(model);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
