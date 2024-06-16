// routes/seriesRoutes.js
import express from 'express';
import {
    createSeries,
    getSeries,
    getSeriesById,
    updateSeries,
    deleteSeries,
    addModelToSeries
} from '../controllers/seriesController.js';

const router = express.Router();

router.post('/', createSeries);
router.get('/', getSeries);
router.get('/:id', getSeriesById);
router.put('/:id', updateSeries);
router.delete('/:id', deleteSeries);
router.post('/add-model', addModelToSeries);

export default router;
