const router = require('express').Router();
const User = require('../contorllers/userController');
const validateRequest = require('../middlewares/validateRequest');

router
    .post('/signup',validateRequest('signup'), User.singup)
    .post('/login', validateRequest('login'), User.login)

module.exports = router;
