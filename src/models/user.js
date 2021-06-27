const {Model, DataTypes} = require('sequelize');
const {sequelize} = require("../db/connection");
const bcrypt = require('bcrypt');

class User extends Model {}
User.init({
    userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true,
        unique: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    email: {
        type:DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate : {len: 8}
    },
    userType: {
        type: DataTypes.INTEGER,
        defaultValue: 0, // 0 --> recruiter, 1 --> candidate
        allowNull: false,
        validate: {
            isIn: [[0,1]]
        }
    }
}, {sequelize, modelName:'user', timestamps: true, freezeTableName: true});

//hook to hash the password
User.beforeCreate(async (user) => {
    let hashedPassword = await bcrypt.hash(user.password, process.env.BCRYPT_SALT_ROUND || 10);
    user.password = hashedPassword;
});

(async () => {
    try {
        await sequelize.sync();
        console.log(`User Table created successfully`);
    }
    catch(e) {
        console.log(`ERROR: ${e}`);
    }
})();

module.exports = User;




