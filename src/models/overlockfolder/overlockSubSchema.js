import mongoose from 'mongoose';

const OverlockSubModelSchema = new mongoose.Schema({
    model: { type: String, required: true, default: '*' },
    technicalDescription: { type: String, required: true, default: '*' },
    detailedTechnicalDescription: { type: String, required: true, default: '*' },
    functions: { type: String, default: '*' },
    needleType: { type: String, default: '*' },
    needleNo: { type: Number, default: 0 },
    threadNo: { type: Number, default: 0 },
    stitchLengthRange: { type: String, default: '*' }, // Changed to string as per the specification
    stitchWidthRange: { type: String, default: '*' }, // Changed to string as per the specification
    liftHeightRange: { type: String, default: '*' }, // Changed to string as per the specification
    isSuitableForLightMaterial: { type: Boolean, default: false },
    isSuitableForMediumMaterial: { type: Boolean, default: false },
    isSuitableForHeavyMaterial: { type: Boolean, default: false },
    // differentialRatio: { type: String, default: '*' },
    speedInRPM: { type: Number, default: 0 },
    image: { type: String, default: '*' }
});

export default OverlockSubModelSchema;
