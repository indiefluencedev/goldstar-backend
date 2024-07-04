import mongoose from 'mongoose';

const NeedleDetectorSubModelSchema = new mongoose.Schema({
    model: { type: String, required: true, default: '*' },
    technicalDescription: { type: String, required: true, default: '*' },
    detailedTechnicalDescription: { type: String, required: true, default: '*' },
    detectionWidth: { type: String, required: true, default: '*' },
    detectionHeight: { type: String, required: true, default: '*' },
    testingStandard: { type: String, required: true, default: '*' },
    volume: { type: String, required: true, default: '*' },
    approximateWeight: { type: String, required: true, default: '*' },
    power: { type: String, required: true, default: '*' },
    powerSupply: { type: String, required: true, default: '*' },
    image: { type: String, default: '*' }
});

export default NeedleDetectorSubModelSchema;