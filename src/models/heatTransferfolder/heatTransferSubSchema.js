import mongoose from 'mongoose';

const HeatTransferSubModelSchema = new mongoose.Schema({
    model: { type: String, required: true, default: '*' },
    technicalDescription: { type: String, required: true, default: '*' },
    detailedTechnicalDescription: { type: String, required: true, default: '*' },
    voltage: { type: String, required: true, default: '*' },
    power: { type: String, required: true, default: '*' },
    workingDimension: { type: String, required: true, default: '*' },
    workingTemperature: { type: String, required: true, default: '*' },
    TimeDelay: { type: String, required: true, default: '*' },
    image: { type: String, default: '*' }
});

export default HeatTransferSubModelSchema;
