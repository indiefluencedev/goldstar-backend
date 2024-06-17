import mongoose from 'mongoose';
import LockstitchSubModelSchema from './lockstitchSubSchema.js';

const LockstitchSchema = new mongoose.Schema({
    model: { type: String, required: true, default: '*' },
    technicalDescription: { type: String, required: true, default: '*' },
    detailedTechnicalDescription: { type: String, required: true, default: '*' },
    functions: { type: String, default: '*' },
    needleType: { type: String, default: '*' },
    needleFeed: { type: Boolean, default: false },
    needleStitchLength: { type: String, default: '*' }, // Corrected field name to camelCase
    liftHeightRange: { type: String, default: '*' },
    hasAutoThreadTrimmer: { type: Boolean, default: false },
    hasAutoLift: { type: Boolean, default: false },
    isSuitableForLightMaterial: { type: Boolean, default: false },
    isSuitableForMediumMaterial: { type: Boolean, default: false },
    isSuitableForHeavyMaterial: { type: Boolean, default: false },
    horizontalHook: { type: Boolean, default: false },
    weight: { type: String, default: '*' },
    packingSize: { type: String, default: '*' },
    speedInRPM: { type: Number, default: 0 },
    image: { type: String, default: '*' },
    series: { type: mongoose.Schema.Types.ObjectId, ref: 'Series', required: true },
    subModels: { type: [LockstitchSubModelSchema], default: [] }
});

const LockstitchModel = mongoose.model('Lockstitch', LockstitchSchema);
export default LockstitchModel;
