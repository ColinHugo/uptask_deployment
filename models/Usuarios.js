const Sequelize = require( 'sequelize' );
const bcrypt = require( 'bcrypt-nodejs' );

const db = require( '../config/db' );
const Proyectos = require( './Proyectos' );

const Usuarios = db.define( 'usuarios', {

    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    email: {
        type: Sequelize.STRING( 60 ),
        allowNull: false,
        unique: {
            args: true,
            msg: 'Usuario ya registrado'
        },
        validate: {
            isEmail: {
                msg: 'Agrega un correo válido'
            },
            notEmpty: {
                msg: 'El E-mail no puede ir vacío'
            }
        }
    },
    password: {
        type: Sequelize.STRING( 60 ),
        allowNull: false,

        validate: {
            notEmpty: {
                msg: 'El password no puede ir vacío'
            }
        }
    },

    activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },

    token: Sequelize.STRING,
    expiracion: Sequelize.DATE,

}, {
    hooks: {
        beforeCreate( usuario ) {
            usuario.password = bcrypt.hashSync( usuario.password, bcrypt.genSaltSync() );
        }
    }
} );

// Métodos personalizados
Usuarios.prototype.verificarPassword = function ( password ) {
    return bcrypt.compareSync( password, this.password );
}

Usuarios.hasMany( Proyectos );

module.exports = Usuarios;