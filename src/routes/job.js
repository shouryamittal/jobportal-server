const router = require('express').Router();
const Job = require('../contorllers/jobController');
const validateRequest = require('../middlewares/validateRequest');

router
    .post('/', validateRequest('saveJob') ,Job.saveJob)
    .get('/', Job.findAllJobs)
    .get('/:jobId', Job.findJob)
    .get('/all/:userId', Job.findAllJobs)
    .get('/search', Job.searchJob)
    .get('/:jobId/candidates', Job.findAllCandidates)
    .post('/apply', validateRequest('apply'), Job.applyToJob)

module.exports = router;