const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME || 'jobportal', process.env.DB_USERNAME || 'root', process.env.DB_PASSWORD || '', {
    host: 'localhost',
    dialect:'mysql'
});

sequelize.authenticate()
.then(() => {
    console.log(`Database connection successflly established.`);
})
.catch((e) => {
    console.log(`Could not connect to the database. ERROR: ${e}`);
});

module.exports = {sequelize, Sequelize};
