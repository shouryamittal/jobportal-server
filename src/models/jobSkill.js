const {Model, DataTypes} = require('sequelize');
const {sequelize} = require("../db/connection");

class JobSkill extends Model{}

JobSkill.init({
    skillId :{
        type: DataTypes.UUID,
        allowNull: false
    }
}, {sequelize, modelName:'jobSkill', freezeTableName: true});

(async () => {
    try {
        await JobSkill.sync();
        console.log(`JobSkill Table created successfully`);
    }
    catch(e) {
        console.log(`${e}`);
    }
});

module.exports = JobSkill;