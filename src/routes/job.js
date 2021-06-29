const router = require('express').Router();
const Job = require('../contorllers/jobController');
const validateRequest = require('../middlewares/validateRequest');

router
    .post('/', validateRequest('saveJob') ,Job.saveJob)
    .get('/all/:userId', Job.findAllJobsPosted)
    .get('/search', validateRequest('jobSearch'), Job.searchJob)
    .get('/:jobId/candidates', Job.findAllCandidates)
    .post('/apply', validateRequest('apply'), Job.applyToJob)
    .get('/all/available/:userId', Job.findAllJobsForCandidate)
    .get('/applied/:userId', Job.findAllAppliedJobs)

module.exports = router;