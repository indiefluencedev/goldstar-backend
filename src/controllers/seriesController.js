import Series from '../models/seriesSchema.js';
import LockstitchModel from '../models/lockstitchfolder/lockstitchSchema.js';
import OverlockModel from '../models/overlockfolder/overlockSchema.js';
import InterlockModel from '../models/interlockfolder/interlockSchema.js';
import HeavyDutyModel from '../models/heavyDutyfolder/heavyDutySchema.js';
import SpecialSeriesModel from '../models/specialSeriesfolder/specialSeriesSchema.js';
import ZigzagModel from '../models/zigzagSeriesfolder/zigzagSeriesSchema.js';
// import CuttingModel from '../models/cuttingSeriesfolder/cuttingSeriesSchema.js';
import CuttingMachineSeriesModel from '../models/cuttingMachineSeriesfolder/cuttingMachineSeriesSchema.js';
import FusingMachineModel from '../models/fusingMachineSeriesfolder/fusingMachineSeriesSchema.js';
import HeatTransferModel from '../models/heatTransferfolder/heatTransferSchema.js';
import NeedleDetectorModel from '../models/needleDetectorfolder/needleDetectorSchema.js';

// A map to easily access model types
const modelMap = {
    'Lockstitch': LockstitchModel,
    'Overlock': OverlockModel,
    'Interlock': InterlockModel,
    'HeavyDuty': HeavyDutyModel,
    'SpecialSeries': SpecialSeriesModel,
    'Zigzag': ZigzagModel,
    // 'Cutting': CuttingModel,
    'CuttingMachineSeries': CuttingMachineSeriesModel,
    'FusingMachine': FusingMachineModel,
    'HeatTransfer': HeatTransferModel,
    'NeedleDetector': NeedleDetectorModel
};

// Create Series
export const createSeries = async (req, res) => {
    try {
        const seriesData = req.body;
        const series = new Series(seriesData);
        await series.save();
        res.status(201).json(series);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all Series
export const getSeries = async (req, res) => {
    try {
        const series = await Series.find().populate('models');
        res.status(200).json(series);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Series by ID
export const getSeriesById = async (req, res) => {
    try {
        const { id } = req.params;
        const series = await Series.findById(id).populate('models');
        if (!series) {
            return res.status(404).json({ message: 'Series not found' });
        }
        res.status(200).json(series);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Series by ID
export const updateSeries = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedSeries = await Series.findByIdAndUpdate(id, req.body, { new: true }).populate('models');
        if (!updatedSeries) {
            return res.status(404).json({ message: 'Series not found' });
        }
        res.status(200).json(updatedSeries);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete Series by ID
export const deleteSeries = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSeries = await Series.findByIdAndDelete(id);
        if (!deletedSeries) {
            return res.status(404).json({ message: 'Series not found' });
        }
        res.status(200).json({ message: 'Series deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a model to a series
export const addModelToSeries = async (req, res) => {
    try {
        const { seriesId, modelId, modelType } = req.body;
        const series = await Series.findById(seriesId);

        const Model = modelMap[modelType];
        if (!Model) {
            return res.status(400).json({ message: 'Invalid model type' });
        }

        const model = await Model.findById(modelId);
        if (!series || !model) {
            return res.status(404).json({ message: 'Series or Model not found' });
        }

        series.models.push(model._id);
        await series.save();
        res.status(200).json(series);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
