const { Sequelize } = require( 'sequelize' );
require( 'dotenv' ).config( { path: 'variables.env' } );

const db = new Sequelize( process.env.BD_NOMBRE, process.env.BD_USER, process.env.BD_PASS, {

    timezone: '-05:00',
    host: process.env.BD_HOST,
    dialect: 'mysql',
    port: process.env.BD_PORT,
    operatorsAliases: 0,
    define: {
        timestamps: false
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: false
});

module.exports = db;