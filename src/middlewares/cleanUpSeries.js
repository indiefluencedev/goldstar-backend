// middlewares/cleanUpSeries.js
import Series from '../models/seriesSchema.js';
import Model from '../models/modelSchema.js';

const cleanUpSeries = async () => {
    try {
        const seriesList = await Series.find();

        for (const series of seriesList) {
            const validModelIds = [];

            for (const modelId of series.models) {
                const modelExists = await Model.findById(modelId);
                if (modelExists) {
                    validModelIds.push(modelId);
                }
            }

            if (validModelIds.length !== series.models.length) {
                series.models = validModelIds;
                await series.save();
                console.log(`Updated series: ${series.name}`);
            }
        }

        console.log('Clean-up completed!');
    } catch (error) {
        console.error('Error cleaning up series:', error);
    }
};

export default cleanUpSeries;
