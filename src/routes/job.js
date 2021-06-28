const router = require('express').Router();
const Job = require('../contorllers/jobController');
const validateRequest = require('../middlewares/validateRequest');

router
    .post('/', validateRequest('saveJob') ,Job.saveJob)
    .get('/', Job.findAllJobs)
    .get('/all/:userId', Job.findAllJobs)
    .get('/search', validateRequest('jobSearch'), Job.searchJob)
    .get('/:jobId/candidates', Job.findAllCandidates)
    .post('/apply', validateRequest('apply'), Job.applyToJob)
    .get('/:jobId', Job.findJob)

module.exports = router;