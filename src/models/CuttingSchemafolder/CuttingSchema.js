import mongoose from 'mongoose';
import CuttingSubModelSchema from './CuttingSubModelSchema.js';

const CuttingSchema = new mongoose.Schema({
    model: { type: String, required: true, default: '*' },
    technicalDescription: { type: String, required: true, default: '*' },
    detailedTechnicalDescription: { type: String, required: true, default: '*' },
    functions: { type: String, default: '*' },
    needleType: { type: String, default: '*' },
    needleFeed: { type: Boolean, default: false },
    needleGauge: { type: String, default: '*' },
    needleFALSE: { type: String, default: '*' },
    needleBarStroke: { type: String, default: '*' },
    threadFALSE: { type: String, default: '*' },
    doubleNeedleStitchLength: { type: String, default: '*' },
    stitchLengthRange: { type: String, default: '*' },
    stitchWidthRange: { type: String, default: '*' },
    stitchWidthForInterlock: { type: String, default: '*' }, // Adjusted field name to camelCase
    liftHeightRange: { type: String, default: '*' },
    hasAutoThreadTrimmer: { type: Boolean, default: false },
    hasAutoLift: { type: Boolean, default: false },
    isSuitableForLightMaterial: { type: Boolean, default: false },
    isSuitableForMediumMaterial: { type: Boolean, default: false },
    isSuitableForHeavyMaterial: { type: Boolean, default: false },
    horizontalHook: { type: Boolean, default: false },
    verticalHook: { type: Boolean, default: false },
    weight: { type: String, default: '*' },
    packingSize: { type: String, default: '*' },
    differentialRatio: { type: String, default: '*' },
    speedInRPM: { type: String, default: '*' },
    quantityOfStandardPattern: { type: String, default: '*' },
    rateOfMagnifyAndShrink: { type: String, default: '*' },
    powerOfMotorsOutputting: { type: String, default: '*' },
    power: { type: String, default: '*' },
    cutterSize: { type: String, default: '*' },
    zigzagSewinggLength: { type: String, default: '*' },
    buttonDiameter: { type: String, default: '*' },
    stitchWidth: { type: String, default: '*' },
    dot: { type: String, default: '*' },
    plug: { type: String, default: '*' },
    buttonHoleWidth: { type: String, default: '*' },
    cuttingHeightInches: { type: String, default: '*' }, // Adjusted field name to camelCase
    voltage: { type: String, default: '*' },
    frequency: { type: String, default: '*' },
    pipingCuttingWidth: { type: String, default: '*' },
    image: { type: String, default: '*' },
    series: { type: mongoose.Schema.Types.ObjectId, ref: 'Series', required: true },
    subModels: { type: [CuttingSubModelSchema], default: [] }
});

const CuttingModel = mongoose.model('CuttingSeries', CuttingSchema);
export default CuttingModel;
