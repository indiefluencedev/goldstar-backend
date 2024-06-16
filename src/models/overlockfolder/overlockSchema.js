import mongoose from 'mongoose';
import OverlockSubModelSchema from './overlockSubSchema.js';

const OverlockSchema = new mongoose.Schema({
    model: { type: String, required: true, default: '*' },
    technicalDescription: { type: String, required: true, default: '*' },
    detailedTechnicalDescription: { type: String, required: true, default: '*' },
    functions: { type: String, default: '*' },
    needleType: { type: String, default: '*' },
    needleNo: { type: Number, default: 0 },
    threadNo: { type: Number, default: 0 },
    doubleNeedleStitchLength: { type: String, default: '*' },
    stitchLengthRange: { type: Number, default: 0.0 },
    stitchWidthRange: { type: Number, default: 0 },
    liftHeightRange: { type: Number, default: 0.0 },
    isSuitableForLightMaterial: { type: Boolean, default: false },
    isSuitableForMediumMaterial: { type: Boolean, default: false },
    isSuitableForHeavyMaterial: { type: Boolean, default: false },
    differentialRatio: { type: String, default: '*' },
    speedInRPM: { type: Number, default: 0 },
    image: { type: String, default: '*' },
    series: { type: mongoose.Schema.Types.ObjectId, ref: 'Series', required: true },
    subModels: { type: [OverlockSubModelSchema], default: [] }
});

const OverlockModel = mongoose.model('Overlock', OverlockSchema);
export default OverlockModel;
