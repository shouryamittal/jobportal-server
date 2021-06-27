const router = require('express').Router();
const Misc = require('../contorllers/miscController');

router
    .post('/skills', Misc.saveSkills)
    
module.exports = router;