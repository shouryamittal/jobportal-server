const {body, param, query} = require('express-validator/check');

function validateRequest(method) {
    switch(method) {
        case 'signup': {
            return  [
                body('firstName', 'First name cant be empty').exists(),
                body('lastName', 'Last name cant be empty').exists(),
                body('email', 'Invalid Email').isEmail(),
                body('password', 'Password must be atleast 8 character long').isLength({min: 8, max: 13}),
                body('userType', 'User type can only have values 0 or 1').isIn([0,1])
            ];
        }
        case 'login': {
            return [
                body('email', 'Invalid Email').exists().isEmail(),
                body('password', 'Password must be atleast 8 character long').isLength({min: 8, max: 13})
            ];
        }
        case 'saveJob': {
            return [
                body('title', 'Title length must be between 10 - 100').isLength({min:10, max: 100}),
                body('description', 'Description length must be between 10-3000').isLength({min: 10, max: 3000}),
                body('companyName', 'Company name cannot be empty').isLength({min: 3, max: 50}),
                body('location', 'Location must not be empty').exists()
            ];
        }
        case 'findJob' :{
            return [
                param('jobId', 'Job Id required as url parameter').exists()
            ];
        }
        case 'apply': {
            return [
                body('userId', 'User Id required').exists(),
                body('jobId', 'Job id required').exists()
            ]
        }
        case 'jobSearch':{
            return [
                query('text', 'text must be present').exists(),
                query('type', 'type must be one off title, desc, recruiter').isIn(['title', 'desc', 'recruiter'])
            ]
        }
    }
}


module.exports = validateRequest;