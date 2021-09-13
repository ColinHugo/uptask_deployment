// Usualmente es en el modelo donde se coloca toda la descripción de los campos de la base de datos
const Sequelize = require( 'sequelize' );
const slug = require( 'slug' );
const shortid = require( 'shortid' );
const db = require( '../config/db' ); // tiene la configuración y la conexión a la BD

const Proyectos = db.define( 'proyectos', {

    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: Sequelize.STRING( 100 ),
    },
    url:{
        type:Sequelize.STRING( 100 ),
    }
}, {
    hooks: {
        beforeCreate( proyecto ) {

            const url = slug( proyecto.nombre ).toLowerCase();
            proyecto.url = `${ url }-${ shortid.generate() }`;
        }
    }
} );

module.exports = Proyectos;