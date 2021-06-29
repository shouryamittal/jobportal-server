const router = require('express').Router();
const Misc = require('../contorllers/miscController');

router
    .post('/skills', Misc.saveSkills)
    .get('/skills', Misc.getAllSkills)
    
module.exports = router;