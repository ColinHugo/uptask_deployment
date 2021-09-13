const passport = require( 'passport' );
const crypto = require( 'crypto' );
const bcrypt = require( 'bcrypt-nodejs' );

const Sequelize = require( 'sequelize' );
const Op = Sequelize.Op;

const Usuarios = require('../models/Usuarios');
const enviarEmail = require( '../handlers/email' );

exports.autenticarUsuario = passport.authenticate( 'local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos Campos son obligatorios'
} );

// Función para revisar si el usuario está logueado o no
exports.usuarioAutenticado = ( req, res, next ) => {

    // Si el usuario está autenticado, adelante
    if ( req.isAuthenticated() ) {
        return next();
    }

    // sino está autenticado, redirigir al formulario
    return res.redirect( '/iniciar-sesion' );
}

// función para cerrar sesión
exports.cerrarSesion = ( req, res ) => {

    req.session.destroy( () => {
        res.redirect( '/iniciar-sesion' );
    } );
}

// genera un token si el usuario es válido
exports.enviarToken = async ( req, res ) => {

    // verificar que el usuario exista
    const usuario = await Usuarios.findOne( { where: { email: req.body.email } } );

    // si no existe el usuario
    if ( !usuario ) {
        req.flash( 'error', 'No existe esa cuenta' )
        res.redirect( '/reestablecer' );
    }

    // usuario existe
    usuario.token = crypto.randomBytes( 20 ).toString( 'hex' );
    usuario.expiracion = new Date().getTime() + 3600000;

    // guardarlos en la bases de datos
    await usuario.save();

    // url de reset
    const resetUrl = `http://${ req.headers.host }/reestablecer/${ usuario.token }`;

    // Envía el correo con el token
    await enviarEmail.enviar( {
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reestablecer-password'
    } );

    //terminar
    req.flash( 'correcto', 'Se envió un mensaje a tu correo' );
    res.redirect( '/iniciar-sesion' );
    
    // res.redirect( `/reestablecer/${ usuario.token }` );
}

exports.validarToken = async ( req, res ) => {

    const usuario = await Usuarios.findOne( {
        where: {
            token: req.params.token
        }
    } );

    // si no encuentra el usuario
    if ( !usuario ) {
        req.flash( 'error', 'No válido' );
        res.redirect( '/reestablecer' )
    }

    // Formulario para generar el password
    res.render( 'resetPassword', {
        nombrePagina: 'Reestablecer Contraseña'
    } );
}

// Cambia el password por uno nuevo
exports.actualizarPassword = async ( req, res ) => {

    // Verifica el token válido pero también la fecha de expiración
    const usuario = await Usuarios.findOne( { 
        where: {
            token: req.params.token,
            expiracion: {
                [ Op.gte ] : Date.now()
            }
        }
     } );

     // Verificamos si el usuario existe
     if ( !usuario ) {
         req.flash( 'error', 'No válido actualizarPassword' );
         res.redirect( '/reestablecer' )
     }

     // hashear el nuevo password
     usuario.password = bcrypt.hashSync( req.body.password, bcrypt.genSaltSync() );

     usuario.token = null;
     usuario.expiracion = null;

     // guardamos el nuevo password
     await usuario.save();

     req.flash( 'correcto', 'Tu password se ha modificado correctamente' );
     res.redirect( '/iniciar-sesion' );

}