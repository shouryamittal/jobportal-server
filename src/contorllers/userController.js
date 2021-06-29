const User = require('../models/user');
const Response = require('../utils/response');
const {validationResult} = require('express-validator');
const { INVALID_REQ, SERVER_ERROR, SUCCESS, CONFLICT, NOT_FOUND, UNAUTHORIZED } = require('../utils/statusCode');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class UserController {
    static async singup(req, res) {
        let response = new Response();
        try {
            //check for errors in the req.body
            const allErr = validationResult(req);
            if(!allErr.isEmpty()){
                response.errs = allErr.errors;
                return res.status(INVALID_REQ).send(response);
            }
            
            let {firstName, lastName, email, password, userType} = req.body;
            //check if user already exists
            let user = await User.findOne({where: {email}});
            if(Object.keys(user || {}).length > 0) {
                response.errs = [{msg: `User Already exists with this email`}];
                return res.status(CONFLICT).send(response);
            }

            //save user in db
            let newUser = await User.create({firstName, lastName, email, password, userType});
            //generate auth token
            let payload = {userId:newUser.userId, firstName, lastName, email, userType};
            let token = generateAuthToken(payload);
            response.data = {token};
            response.msg = `User created successfully`;
            res.status(SUCCESS).send(response);
        }
        catch(e) {
            console.log(e);
            response.errs = [{msg: `${e}`}];
            res.status(SERVER_ERROR).send(response);
        }   
    }

    static async login(req, res) {
        let response = new Response();
        try {
            //check for errors in the req.body
            const allErr = validationResult(req);
            if(!allErr.isEmpty()){
                response.errs = allErr.errors;
                return res.status(INVALID_REQ).send(response);
            }
            const {email, password, userType} = req.body;
            let user = await User.findOne({where: {email}});
            if(Object.keys(user || {}).length === 0 || user.userType !== parseInt(userType)) {
                response.errs = [{msg: `No account found with this email or userType`}];
                return res.status(NOT_FOUND).send(response);
            }
            //compare passwords
            let isPasswordValid = await bcrypt.compare(password, user.password);
            if(!isPasswordValid){
                response.errs = [{msg: `Invalid Password`}];
                return res.status(UNAUTHORIZED).send(response);
            }
            let payload = {userId: user.userId, email: user.email, firstName: user.firstName, lastName: user.lastName, userType: user.userType};
            let token = generateAuthToken(payload);
            response.data = {token};
            res.status(SUCCESS).send(response);
        }
        catch(e) {
            response.errs = [{msg: `${e}`}];
            res.status(SERVER_ERROR).send(response);
        }
    }
}

function generateAuthToken(payload) {
    return jwt.sign(payload, process.env.AUTH_SECRET || 'auth@3432878nsdeectr', {expiresIn:'1h'});
}
module.exports = UserController;