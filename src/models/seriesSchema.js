import mongoose from 'mongoose';

const seriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    models: [{
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'modelType'
    }],
    modelType: {
        type: String,
        required: true,
        enum: ['Lockstitch', 'Overlock', 'Interlock', 'HeavyDuty']

        // , 'SpecialSeries', 'Zigzag', 'Cutting'  add when confermed
    }
});

const Series = mongoose.model('Series', seriesSchema);
export default Series;
