/***
 * 
 * This model acts as a lookup for candidate and job which he has applied for. 
 * 
 */

const {Model, DataTypes} = require('sequelize');
const {sequelize} = require("../db/connection");

class JobActivity extends Model {}
JobActivity.init({
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
    },
    jobId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
    },
    appliedOn: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    sequelize,
    modelName: 'jobActivity', 
    freezeTableName: true
});

(async () => {
    try {
        console.log(`JobActivity Table created successfully`);
    }
    catch(e) {
        console.log(`${e}`);
    }
})();

module.exports = JobActivity;