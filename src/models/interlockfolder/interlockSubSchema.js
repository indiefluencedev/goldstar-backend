import mongoose from 'mongoose';

const InterlockSubModelSchema = new mongoose.Schema({
    model: { type: String, required: true, default: '*' },
    technicalDescription: { type: String, required: true, default: '*' },
    detailedTechnicalDescription: { type: String, required: true, default: '*' },
    functions: { type: String, default: '*' },
    needleType: { type: String, default: '*' },
    needleGauge: { type: String, default: '*' },
    needleNo: { type: String, default: '*' },
    needleBarStroke: { type: String, default: '*' },
    threadNo: { type: String, default: '*' },
    stitchLengthRange: { type: String, default: '*' },
    stitchWidthRange: { type: String, default: '*' },
    liftHeightRange: { type: String, default: '*' },
    stitchWidthForInterlockSeries: { type: String, default: '*' },
    isSuitableForLightMaterial: { type: Boolean, default: false },
    isSuitableForMediumMaterial: { type: Boolean, default: false },
    isSuitableForHeavyMaterial: { type: Boolean, default: false },
    weight: { type: String, default: '*' },
    packingSize: { type: String, default: '*' },
    differentialRatio: { type: String, default: '*' },
    speedInRPM: { type: Number, default: 0 },
    image: { type: String, default: '*' }
});

export default InterlockSubModelSchema;
