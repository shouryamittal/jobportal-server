const {Model, DataTypes} = require('sequelize');
const {sequelize} = require("../db/connection");

class Skill extends Model {}
Skill.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: 100
        }
    }
}, {
    sequelize,
    modelName: 'skill',
    freezeTableName: true
});

(async () => {
    try {
        await Skill.sync();
        console.log(`Skill Table created successfully.`);
    }
    catch(e) {
        console.log(`${e}`);
    }
})();
module.exports = Skill;