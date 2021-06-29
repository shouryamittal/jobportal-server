const {Op, Sequelize} = require('sequelize');
const { validationResult } = require('express-validator');
const Job = require('../models/job');
const JobSkill = require('../models/jobSkill');
const Skill = require('../models/skill');
const JobActivity = require('../models/jobActivity');
const Response = require('../utils/response');
const { SUCCESS, SERVER_ERROR, INVALID_REQ} = require('../utils/statusCode');
const User = require('../models/user');

class JobController {
    /** 
     * @param {*} req 
     * @param {*} res 
     * saves the job details on db
     */
    static async saveJob(req, res) {
        const response = new Response();
        try {
            const allErr = validationResult(req);
            if(!allErr.isEmpty()){
                response.errs = allErr.errors;
                return res.status(INVALID_REQ).send(response);
            }

            let {title, description, companyName, location, postedBy, skillIds} = req.body;
            let jobSkills = []; /*this array will contain the ids of the skills to be associated with the job */
            skillIds = skillIds || [];
            for(let id of skillIds){
                jobSkills.push({skillId: id});
            }
            //TODO: validate postedby to be a valid user id in the system
            await Job.create({title, description, companyName, location, postedBy, jobSkills}, {include: JobSkill});
            response.msg = `Job entry has been created successfully`;
            res.status(SUCCESS).send(response);
        }
        catch(e) {
            console.log(e)
            response.errs = [{msg: `${e}`}];
            res.status(SERVER_ERROR).send(response);
        }
    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns all jobs for a recruiter
     */
    static async findAllJobsPosted(req, res) {
        const response = new Response();
        try {
            const userId = req.params.userId;
            const condition = {where: {postedBy: userId},include: JobSkill};
            let jobs = await Job.findAll(condition);
            if((jobs || []).length === 0) {
                response.data = [];
                return res.status(SUCCESS).send(response);
            }
            let allJobs = await findJobSkills(jobs);
            response.data = allJobs;
            res.status(SUCCESS).send(response);
        }   
        catch(e) {
            response.errs = [{msg: `${e}`}];
            res.status(SERVER_ERROR).send(response);
        }
    }

    /**
     * @param {*} req 
     * @param {*} res
     * @returns all candidates for a job 
     */
    static async findAllCandidates(req, res) {
        const response = new Response();
        try {
            const jobId = req.params.jobId;
            let candidates = await JobActivity.findAll({where: {jobId}, attributes: ['userId']});
            let candidatesIds = candidates.map(candidate => {return candidate.userId});
            let allCandidateDetails = await User.findAll({where: {userId: {[Op.in]:candidatesIds}}, attributes: ['firstName', 'lastName', 'email']});
            if((allCandidateDetails || []).length === 0) {
                response.data = [];
                return res.status(SUCCESS).send(response);
            }

            response.data = allCandidateDetails;
            res.status(SUCCESS).send(response);
        }
        catch(e) {
            // console.log(e);
            response.errs = [{msg: `${e}`}];
            res.status(SERVER_ERROR).send(response);
        }
    }

    static async applyToJob(req, res) {
        const response = new Response();
        try {
            let {jobId, userId} = req.body;
            //check of user exists with given userid
            let user = await User.findOne({where: {userId: userId}});
            if(Object.keys(user).length === 0) {
                response.errs = [{msg:`Invalid user id`}];
                return res.status(INVALID_REQ).send(response);
            }

            await JobActivity.create({
                jobId, userId
            });
            response.data = {msg: `Successfully applied to the job`};
            res.status(SUCCESS).send(response);
        }
        catch(e) {
            response.errs = [{msg: `You have already applied`}];
            res.status(SERVER_ERROR).send(response);
        }
    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns list of jobs matching the search criteria
     */

    static async searchJob(req, res) {
        const response = new Response();
        try {
            const allErr = validationResult(req);
            if(!allErr.isEmpty()){
                response.errs = allErr.errors;
                return res.status(INVALID_REQ).send(response);
            }

            const {text, type} = req.query;
            let decodedText = decodeURI(text);
            let allJobs = [];
            let jobs = [];
            switch(type) {
                case 'title': {
                    let lowerCaseText = decodedText.toLowerCase();
                    let upperCaseText = decodedText.toUpperCase();
                    jobs = await Job.findAll({
                        where: {
                            title: {
                                [Op.or]: [
                                    {[Op.like]: '%' + decodedText + '%'},
                                    {[Op.like]: '%' + lowerCaseText + '%'},
                                    {[Op.like]: '%' + upperCaseText + '%'}
                                ]
                            }
                        },
                        include: JobSkill
                    });
                    break;
                }
                case 'recruiter': {
                    let [firstName, lastName] = decodedText.split(' ');
                    let recruiters = await User.findAll({
                            where: {
                                [Op.and]: [
                                    {firstName: firstName},
                                    {lastName: lastName}  
                                ] 
                            },
                            attributes:['userId']
                        });
                    let userIds = recruiters.map(recruiter => recruiter.userId);
                    jobs = await Job.findAll({where: {postedBy: {[Op.in]: userIds}}, include: JobSkill});
                    break;
                }
                case 'desc': {
                    jobs = await Job.findAll({
                        where: Sequelize.literal('MATCH (description) AGAINST (:text)'),
                        replacements: {
                          text: decodedText
                        }, include:JobSkill});
                }
            }
            let allJobs = await findJobSkills(jobs);
            response.data = allJobs;
            res.status(SUCCESS).send(response)
        }
        catch(e) {
            response.errs = [{msg: `${e}`}];
            res.status(SERVER_ERROR).send(response);
        }
    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns list of jobs to which candidate has applied
     */
    static async findAllAppliedJobs(req, res) {
        const response = new Response();
        try {
            let userId = req.params.userId;
            console.log(userId)
            let jobIds = await findAppliedJobIds(userId);
            console.log(jobIds)
            let jobs = await Job.findAll({where:{id: {[Op.in]: jobIds}}, include:JobSkill});

            if((jobs || []).length === 0) {
                response.data = [];
                return res.status(SUCCESS).send(response);
            }
            let allJobs = await findJobSkills(jobs);
            response.data = allJobs;
            res.status(SUCCESS).send(response);
        }
        catch(e) {
            response.errs = [{msg: `${e}`}];
            res.status(SERVER_ERROR).send(response);
        }
    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns list of all jobs excluding the ones to which user has already applied.
     */
    static async findAllJobsForCandidate(req, res) {
        const response = new Response();
        try {
            let userId = req.params.userId;
            let appliedJobIds = await findAppliedJobIds(userId);
            let jobs = await Job.findAll({where: {id: {[Op.notIn]: appliedJobIds}}, include: JobSkill});
            if((jobs || []).length === 0) {
                response.data = [];
                return res.status(SUCCESS).send(response);
            }
            let allJobs = await findJobSkills(jobs);
            response.data = allJobs;
            res.status(SUCCESS).send(response);
        }
        catch(e) {
            response.errs = [{msg: `${e}`}];
            res.status(SERVER_ERROR).send(response);
        }
    }
}


async function findJobSkills(jobs) {
    let promises = [];
    jobs.forEach((job) => {
        let skillIds = job.jobSkills.map(skillObj => {return skillObj.skillId});
        promises.push(Skill.findAll({where: {id: {[Op.in]: skillIds}},attributes:['name']}));
    });
    let allSkills = await Promise.all(promises);
    let allJobs = [];
    for(let i = 0; i < jobs.length; i++) {
        let jobDetails = {
            title: jobs[i].title,
            description: jobs[i].description,
            orgName:jobs[i].companyName,
            recruiterId: jobs[i].postedBy,
            postedOn: jobs[i].postedOn,
            requiredSkills: allSkills[i],
            jobId: jobs[i].id
        };
        allJobs.push(jobDetails);
    }
    return allJobs;
}

async function findAppliedJobIds(userId) {
    let jobs = await JobActivity.findAll({where: {userId}, attributes:['jobId']});
    let jobIds = jobs.map(job => job.jobId);
    return jobIds;
}

module.exports = JobController;