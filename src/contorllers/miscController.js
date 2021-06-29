const Skill = require("../models/skill");
const Response = require("../utils/response");
const { SUCCESS, SERVER_ERROR } = require("../utils/statusCode");

class MiscController {
    static async saveSkills(req, res) {
        const response = new Response();
        try {
            const names = req.body.skillNames;
            const skills = names.map(name =>  {
                return {name};
            })
            await Skill.bulkCreate(skills);
            response.msg = `Skill created successfully`;
            res.status(SUCCESS).send(response);
        }
        catch(e) {
            response.errs = [{msg: `${e}`}];
            res.status(SERVER_ERROR).send(response);
        }

    }

    static async getAllSkills(req, res) {
        let response = new Response();
        try {
            let skills = await Skill.findAll({attributes:['id', 'name']});
            response.data = skills;
            res.status(SUCCESS).send(response);
        }
        catch(e) {
            response.errs = [{msg: `${e}`}];
            res.status(SERVER_ERROR).send(response);
        }
    }
}

module.exports = MiscController;