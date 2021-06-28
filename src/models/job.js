const {Model, DataTypes} = require('sequelize');
const {sequelize} = require("../db/connection");
const JobSkill = require('./jobSkill');

class Job extends Model {}
Job.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true,
        unique: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [10, 100]
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: ''
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3,100],
            notEmpty: true
        }
    },
    postedBy: {
        type: DataTypes.UUID,
        allowNull: false
    },
    postedOn: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: DataTypes.NOW
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize, 
    modelName: 'job',
    timestamps: true,
    freezeTableName: true,
    indexes: [
        {
            unique: false,
            fields: ['title']
        },
        {
            unique: false,
            fields: ['postedBy']
        },
        {
            type: 'FULLTEXT',
            fields: ['description']
        }
    ]
});

Job.hasMany(JobSkill);

(async () => {
    try {
        await Job.sync();
        console.log(`Job Table created successfully`);
    }
    catch(e) {
        console.log(`${e}`);
    }
})();

module.exports = Job;