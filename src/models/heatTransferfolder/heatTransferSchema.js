import mongoose from 'mongoose';
import HeatTransferSubModelSchema from './heatTransferSubSchema.js';

const HeatTransferSchema = new mongoose.Schema({
    model: { type: String, required: true, default: '*' },
    technicalDescription: { type: String, required: true, default: '*' },
    detailedTechnicalDescription: { type: String, required: true, default: '*' },
    voltage: { type: String, required: true, default: '*' },
    power: { type: String, required: true, default: '*' },
    workingDimension: { type: String, required: true, default: '*' },
    workingTemperature: { type: String, required: true, default: '*' },
    TimeDelay: { type: String, required: true, default: '*' },
    image: { type: String, default: '*' },
    series: { type: mongoose.Schema.Types.ObjectId, ref: 'Series', required: true },
    subModels: { type: [HeatTransferSubModelSchema], default: [] }
});

const HeatTransferModel = mongoose.model('Heattransfer', HeatTransferSchema);
export default HeatTransferModel;
